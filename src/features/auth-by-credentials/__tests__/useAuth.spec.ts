import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';
import { ApiHttpError } from '@/shared/api';
import { seedMockUser } from '@/shared/api/mocks';
import { useUserStore } from '@/entities/user';
import { useAuth } from '../model/useAuth';

function buildRouter(): Router {
	return createRouter({
		history: createMemoryHistory(),
		routes: [
			{ path: '/auth', name: 'Auth', component: { template: '<div>auth</div>' } },
			{
				path: '/dashboard',
				name: 'Dashboard',
				component: { template: '<div>dashboard</div>' },
			},
			{
				path: '/transactions',
				name: 'Transactions',
				component: { template: '<div>tx</div>' },
			},
		],
	});
}

function createHarness(router: Router) {
	let api: ReturnType<typeof useAuth> | null = null;
	const Harness = defineComponent({
		setup() {
			api = useAuth();
			return () => h('div');
		},
	});
	mount(Harness, { global: { plugins: [router] } });
	if (!api) throw new Error('useAuth не инициализирован');
	return api;
}

describe('useAuth', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('login успех → router.replace на /dashboard, store.isAuthenticated=true', async () => {
		seedMockUser({ email: 'bob@example.com', password: 'password123' });
		const router = buildRouter();
		await router.push('/auth');
		await router.isReady();
		const api = createHarness(router);

		await api.login({ email: 'bob@example.com', password: 'password123' });

		expect(router.currentRoute.value.fullPath).toBe('/dashboard');
		expect(useUserStore().isAuthenticated).toBe(true);
	});

	it('login успех с ?redirect=/transactions → replace на /transactions', async () => {
		seedMockUser({ email: 'bob@example.com', password: 'password123' });
		const router = buildRouter();
		await router.push('/auth?redirect=/transactions');
		await router.isReady();
		const api = createHarness(router);

		await api.login({ email: 'bob@example.com', password: 'password123' });

		expect(router.currentRoute.value.fullPath).toBe('/transactions');
	});

	it('login 401 → throw ApiHttpError, currentRoute не меняется, isAuthenticated=false', async () => {
		seedMockUser({ email: 'bob@example.com', password: 'password123' });
		const router = buildRouter();
		await router.push('/auth');
		await router.isReady();
		const api = createHarness(router);

		await expect(
			api.login({ email: 'bob@example.com', password: 'wrong-pass' }),
		).rejects.toBeInstanceOf(ApiHttpError);

		expect(router.currentRoute.value.fullPath).toBe('/auth');
		expect(useUserStore().isAuthenticated).toBe(false);
	});
});
