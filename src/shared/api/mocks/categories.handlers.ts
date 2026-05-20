// [Собес: HTTP → REST CRUD endpoints (list / create / update / delete)]
// [Собес: Browser → Bearer-токен в Authorization header]
// [Собес: JS → Map для in-memory state мока (изоляция per-user)]
//
// MSW-handlers для /api/categories — авторизация через общий helper
// из auth.handlers (one source of truth для access-токенов).

import { http, HttpResponse, type HttpHandler } from 'msw';
import { v4 as uuid } from 'uuid';
import { getUserIdByAccessToken, readBearer } from './auth.handlers';

interface MockCategory {
	id: string;
	name: string;
	type: 'income' | 'expense';
	icon: string;
	color: string;
	parentId: string | null;
	createdAt: string;
	updatedAt: string;
}

const categoriesByUser = new Map<string, MockCategory[]>();

function nowIso(): string {
	return new Date().toISOString();
}

function err(status: number, code: string, message: string) {
	return HttpResponse.json({ code, message }, { status });
}

function authorize(headers: Headers): string | null {
	const token = readBearer(headers);
	if (!token) return null;
	return getUserIdByAccessToken(token);
}

export function resetMockCategories(): void {
	categoriesByUser.clear();
}

export const categoryHandlers: HttpHandler[] = [
	http.get('/api/categories', ({ request }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		const items = categoriesByUser.get(userId) ?? [];
		return HttpResponse.json({ items });
	}),

	http.post('/api/categories', async ({ request }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		let payload: unknown;
		try {
			payload = await request.json();
		} catch {
			return err(400, 'BAD_BODY', 'Invalid JSON');
		}
		const input = payload as Omit<MockCategory, 'id' | 'createdAt' | 'updatedAt'>;
		const now = nowIso();
		const cat: MockCategory = {
			...input,
			id: uuid(),
			createdAt: now,
			updatedAt: now,
		};
		const list = categoriesByUser.get(userId) ?? [];
		list.push(cat);
		categoriesByUser.set(userId, list);
		return HttpResponse.json(cat, { status: 201 });
	}),

	http.patch('/api/categories/:id', async ({ request, params }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		let payload: unknown;
		try {
			payload = await request.json();
		} catch {
			return err(400, 'BAD_BODY', 'Invalid JSON');
		}
		const list = categoriesByUser.get(userId);
		const idx = list?.findIndex((c) => c.id === params['id']) ?? -1;
		if (!list || idx === -1) return err(404, 'NOT_FOUND', 'Category not found');
		const patch = payload as Partial<Omit<MockCategory, 'id' | 'createdAt' | 'updatedAt'>>;
		list[idx] = {
			...list[idx],
			...patch,
			updatedAt: nowIso(),
		};
		return HttpResponse.json(list[idx]);
	}),

	http.delete('/api/categories/:id', ({ request, params }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		const list = categoriesByUser.get(userId);
		const idx = list?.findIndex((c) => c.id === params['id']) ?? -1;
		if (!list || idx === -1) return err(404, 'NOT_FOUND', 'Category not found');
		list.splice(idx, 1);
		return new HttpResponse(null, { status: 204 });
	}),
];
