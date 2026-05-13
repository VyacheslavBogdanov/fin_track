import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { http, HttpResponse } from 'msw';
import { ApiHttpError } from '@/shared/api';
import { server } from '@/shared/api/mocks/server';
import { useUserStore } from '@/entities/user';
import { seedMockUser } from '@/shared/api/mocks';

describe('useUserStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('login: успех — сохраняет user и accessToken, статус success', async () => {
		seedMockUser({ email: 'alice@example.com', password: 'secret123' });
		const store = useUserStore();

		await store.login({ email: 'alice@example.com', password: 'secret123' });

		expect(store.isAuthenticated).toBe(true);
		expect(store.user?.email).toBe('alice@example.com');
		expect(store.accessToken).toBeTruthy();
		expect(store.status).toBe('success');
		expect(store.error).toBeNull();
	});

	it('login: 401 — статус error, accessToken не выставляется, ошибка пробрасывается', async () => {
		seedMockUser({ email: 'alice@example.com', password: 'secret123' });
		const store = useUserStore();

		await expect(
			store.login({ email: 'alice@example.com', password: 'wrong-password' }),
		).rejects.toBeInstanceOf(ApiHttpError);

		expect(store.isAuthenticated).toBe(false);
		expect(store.accessToken).toBeNull();
		expect(store.status).toBe('error');
		expect(store.error).toBeTruthy();
	});

	it('initSession: успешный refresh + me восстанавливают session', async () => {
		const fakeUser = {
			id: 'u1',
			email: 'carol@example.com',
			name: 'Carol',
			baseCurrency: 'RUB' as const,
			settings: { theme: 'light' as const, locale: 'ru' as const, notifications: true },
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
		};
		server.use(
			http.post('/api/auth/refresh', () =>
				HttpResponse.json({ accessToken: 'restored-token' }),
			),
			http.get('/api/auth/me', () => HttpResponse.json({ user: fakeUser })),
		);
		const store = useUserStore();

		await store.initSession();

		expect(store.isAuthenticated).toBe(true);
		expect(store.accessToken).toBe('restored-token');
		expect(store.user?.email).toBe('carol@example.com');
	});

	it('initSession: 401 от refresh — сессия остаётся пустой, ошибка не пробрасывается', async () => {
		const store = useUserStore();

		await expect(store.initSession()).resolves.toBeUndefined();

		expect(store.isAuthenticated).toBe(false);
		expect(store.user).toBeNull();
		expect(store.accessToken).toBeNull();
	});
});
