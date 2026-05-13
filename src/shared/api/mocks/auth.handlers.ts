// [Собес: Browser → Cookie HttpOnly / SameSite (Set-Cookie + credentials:'include')]
// [Собес: Browser → CORS / preflight (same-origin /api/* через Vite proxy)]
//
// MSW-handlers — это симулятор бэка для DEV/тестов. Контракты соответствуют ТЗ §6.5.
// Доменный код (entities/user/api) не знает про моки и не должен из них импортировать.

import { http, HttpResponse, type HttpHandler } from 'msw';
import { v4 as uuid } from 'uuid';

interface MockUser {
	id: string;
	email: string;
	passwordHash: string;
	name: string;
	baseCurrency: 'RUB' | 'USD' | 'EUR';
	settings: { theme: 'light' | 'dark'; locale: 'ru' | 'en'; notifications: boolean };
	createdAt: string;
	updatedAt: string;
}

const users = new Map<string, MockUser>();
const sessions = new Map<string, string>();
const accessTokens = new Map<string, string>();

const STORAGE_KEY = 'fintrack:mock-auth-state';
const COOKIE_STORAGE_KEY = 'fintrack:mock-refresh-cookie';

interface PersistedState {
	users: Array<[string, MockUser]>;
	sessions: Array<[string, string]>;
	accessTokens: Array<[string, string]>;
}

function isPersistEnabled(): boolean {
	return (
		typeof window !== 'undefined' &&
		typeof window.localStorage !== 'undefined' &&
		import.meta.env.DEV
	);
}

// MSW в browser-mode не может реально установить HttpOnly cookie (ServiceWorker
// не управляет cookie jar браузера для synthetic responses). Поэтому в DEV мы
// дублируем refresh-токен в localStorage и читаем оттуда. В тестах
// (isPersistEnabled() === false) handlers полагаются на стандартные cookies
// или server.use(...) overrides.
function writeMockCookie(refreshToken: string): void {
	if (!isPersistEnabled()) return;
	try {
		window.localStorage.setItem(COOKIE_STORAGE_KEY, refreshToken);
	} catch {
		// ignore
	}
}

function readMockCookie(): string | null {
	if (!isPersistEnabled()) return null;
	try {
		return window.localStorage.getItem(COOKIE_STORAGE_KEY);
	} catch {
		return null;
	}
}

function clearMockCookie(): void {
	if (!isPersistEnabled()) return;
	try {
		window.localStorage.removeItem(COOKIE_STORAGE_KEY);
	} catch {
		// ignore
	}
}

function saveState(): void {
	if (!isPersistEnabled()) return;
	try {
		const state: PersistedState = {
			users: Array.from(users.entries()),
			sessions: Array.from(sessions.entries()),
			accessTokens: Array.from(accessTokens.entries()),
		};
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// ignore quota / serialization errors — это dev-only удобство
	}
}

function loadState(): void {
	if (!isPersistEnabled()) return;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw) as PersistedState;
		for (const [k, v] of parsed.users) users.set(k, v);
		for (const [k, v] of parsed.sessions) sessions.set(k, v);
		for (const [k, v] of parsed.accessTokens) accessTokens.set(k, v);
	} catch {
		// corrupt storage — игнорируем, перезапишем при следующем save
	}
}

loadState();

function hashPassword(p: string): string {
	return `hashed:${p}`;
}

function nowIso(): string {
	return new Date().toISOString();
}

function toPublicUser(u: MockUser) {
	return {
		id: u.id,
		email: u.email,
		name: u.name,
		baseCurrency: u.baseCurrency,
		settings: u.settings,
		createdAt: u.createdAt,
		updatedAt: u.updatedAt,
	};
}

function issueTokens(userId: string): { accessToken: string; refreshToken: string } {
	const accessToken = uuid();
	const refreshToken = uuid();
	accessTokens.set(accessToken, userId);
	sessions.set(refreshToken, userId);
	saveState();
	return { accessToken, refreshToken };
}

function rotateRefresh(oldRefresh: string): { accessToken: string; refreshToken: string } | null {
	const userId = sessions.get(oldRefresh);
	if (!userId) return null;
	sessions.delete(oldRefresh);
	return issueTokens(userId);
}

function cookieFor(refreshToken: string): string {
	return `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Lax`;
}

function clearCookie(): string {
	return 'refreshToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

function err(status: number, code: string, message: string, fields?: Record<string, string>) {
	return HttpResponse.json({ code, message, ...(fields ? { fields } : {}) }, { status });
}

function readRefreshTokenFromHeader(cookieHeader: string | null): string | null {
	if (!cookieHeader) return null;
	for (const part of cookieHeader.split(';')) {
		const [k, v] = part.trim().split('=');
		if (k === 'refreshToken' && v) return v;
	}
	return null;
}

function readBearer(headers: Headers): string | null {
	const auth = headers.get('Authorization');
	if (!auth || !auth.startsWith('Bearer ')) return null;
	return auth.slice('Bearer '.length);
}

export function resetMockState(): void {
	users.clear();
	sessions.clear();
	accessTokens.clear();
	if (isPersistEnabled()) {
		try {
			window.localStorage.removeItem(STORAGE_KEY);
		} catch {
			// ignore
		}
		clearMockCookie();
	}
}

export function seedMockUser(input: { email: string; password: string; name?: string }): MockUser {
	const user: MockUser = {
		id: uuid(),
		email: input.email,
		passwordHash: hashPassword(input.password),
		name: input.name ?? 'Test User',
		baseCurrency: 'RUB',
		settings: { theme: 'light', locale: 'ru', notifications: true },
		createdAt: nowIso(),
		updatedAt: nowIso(),
	};
	users.set(input.email, user);
	saveState();
	return user;
}

export const authHandlers: HttpHandler[] = [
	http.post('/api/auth/register', async ({ request }) => {
		let payload: unknown;
		try {
			payload = await request.json();
		} catch {
			return err(400, 'BAD_BODY', 'Invalid JSON');
		}
		const { email, password, name } = (payload as Record<string, unknown>) ?? {};
		if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			return err(422, 'VALIDATION', 'Invalid email', { email: 'Invalid email' });
		}
		if (typeof password !== 'string' || password.length < 8) {
			return err(422, 'VALIDATION', 'Password too short', { password: 'Min 8 chars' });
		}
		if (typeof name !== 'string' || name.trim().length < 2) {
			return err(422, 'VALIDATION', 'Invalid name', { name: 'Min 2 chars' });
		}
		if (users.has(email)) {
			return err(409, 'EMAIL_TAKEN', 'Email already registered', { email: 'Taken' });
		}
		const user = seedMockUser({ email, password, name: name.trim() });
		const tokens = issueTokens(user.id);
		writeMockCookie(tokens.refreshToken);
		return HttpResponse.json(
			{ user: toPublicUser(user), accessToken: tokens.accessToken },
			{ status: 201, headers: { 'Set-Cookie': cookieFor(tokens.refreshToken) } },
		);
	}),

	http.post('/api/auth/login', async ({ request }) => {
		let payload: unknown;
		try {
			payload = await request.json();
		} catch {
			return err(400, 'BAD_BODY', 'Invalid JSON');
		}
		const { email, password } = (payload as Record<string, unknown>) ?? {};
		if (typeof email !== 'string' || typeof password !== 'string') {
			return err(422, 'VALIDATION', 'Email and password required');
		}
		const user = users.get(email);
		if (!user || user.passwordHash !== hashPassword(password)) {
			return err(401, 'UNAUTHORIZED', 'Invalid email or password');
		}
		const tokens = issueTokens(user.id);
		writeMockCookie(tokens.refreshToken);
		return HttpResponse.json(
			{ user: toPublicUser(user), accessToken: tokens.accessToken },
			{ headers: { 'Set-Cookie': cookieFor(tokens.refreshToken) } },
		);
	}),

	http.post('/api/auth/refresh', async ({ request, cookies }) => {
		const refreshToken =
			cookies['refreshToken'] ??
			readRefreshTokenFromHeader(request.headers.get('cookie')) ??
			readMockCookie();
		if (!refreshToken) {
			return err(401, 'UNAUTHORIZED', 'Missing refresh token');
		}
		const tokens = rotateRefresh(refreshToken);
		if (!tokens) {
			clearMockCookie();
			return err(401, 'UNAUTHORIZED', 'Refresh token invalid or expired');
		}
		writeMockCookie(tokens.refreshToken);
		return HttpResponse.json(
			{ accessToken: tokens.accessToken },
			{ headers: { 'Set-Cookie': cookieFor(tokens.refreshToken) } },
		);
	}),

	http.post('/api/auth/logout', async ({ request, cookies }) => {
		const refreshToken =
			cookies['refreshToken'] ??
			readRefreshTokenFromHeader(request.headers.get('cookie')) ??
			readMockCookie();
		if (refreshToken) {
			sessions.delete(refreshToken);
			saveState();
		}
		clearMockCookie();
		return new HttpResponse(null, {
			status: 204,
			headers: { 'Set-Cookie': clearCookie() },
		});
	}),

	http.get('/api/auth/me', ({ request }) => {
		const accessToken = readBearer(request.headers);
		if (!accessToken) {
			return err(401, 'UNAUTHORIZED', 'Missing token');
		}
		const userId = accessTokens.get(accessToken);
		if (!userId) {
			return err(401, 'UNAUTHORIZED', 'Invalid access token');
		}
		const user = Array.from(users.values()).find((u) => u.id === userId);
		if (!user) {
			return err(404, 'NOT_FOUND', 'User not found');
		}
		return HttpResponse.json({ user: toPublicUser(user) });
	}),
];
