import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';
import { authGuard } from '../router';
import { useUserStore } from '@/entities/user';

function buildRouter(): Router {
	const router = createRouter({
		history: createMemoryHistory(),
		routes: [
			{ path: '/', redirect: '/dashboard' },
			{
				path: '/dashboard',
				name: 'Dashboard',
				component: { template: '<div>dashboard</div>' },
				meta: { requiresAuth: true },
			},
			{
				path: '/transactions',
				name: 'Transactions',
				component: { template: '<div>tx</div>' },
				meta: { requiresAuth: true },
			},
			{
				path: '/auth',
				name: 'Auth',
				component: { template: '<div>auth</div>' },
				meta: { requiresGuest: true },
			},
		],
	});
	router.beforeEach(authGuard);
	return router;
}

describe('authGuard', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('блокирует приватный роут анонима → редирект на /auth с query.redirect', async () => {
		const router = buildRouter();
		await router.push('/dashboard');
		await router.isReady();

		expect(router.currentRoute.value.name).toBe('Auth');
		expect(router.currentRoute.value.query.redirect).toBe('/dashboard');
	});

	it('пускает залогиненного на приватный роут', async () => {
		const router = buildRouter();
		const store = useUserStore();
		store.accessToken = 'fake-jwt-token';

		await router.push('/transactions');
		await router.isReady();

		expect(router.currentRoute.value.name).toBe('Transactions');
	});

	it('выкидывает залогиненного с /auth на /dashboard', async () => {
		const router = buildRouter();
		const store = useUserStore();
		store.accessToken = 'fake-jwt-token';

		await router.push('/auth');
		await router.isReady();

		expect(router.currentRoute.value.name).toBe('Dashboard');
	});

	it('пускает анонима на /auth', async () => {
		const router = buildRouter();

		await router.push('/auth');
		await router.isReady();

		expect(router.currentRoute.value.name).toBe('Auth');
	});
});
