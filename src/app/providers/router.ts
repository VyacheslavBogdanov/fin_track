// [Собес: Vue Router → createWebHistory vs createWebHashHistory]
// [Собес: Vue Router → lazy-импорт компонентов / code splitting]
// [Собес: Vue Router → navigation guards (beforeEach)]
// [Собес: Vue Router → typed route meta (declaration merging)]

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
	interface RouteMeta {
		requiresAuth?: boolean;
		requiresGuest?: boolean;
		requiresPremium?: boolean;
		title?: string;
	}
}

const routes: RouteRecordRaw[] = [
	{ path: '/', redirect: '/dashboard' },
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: () => import('@/pages/DashboardPage/DashboardPage.vue'),
		meta: { requiresAuth: true, title: 'Дашборд' },
	},
	{
		path: '/transactions',
		name: 'Transactions',
		component: () => import('@/pages/TransactionsPage/TransactionsPage.vue'),
		meta: { requiresAuth: true, title: 'Транзакции' },
	},
	{
		path: '/budget',
		name: 'Budget',
		component: () => import('@/pages/BudgetPage/BudgetPage.vue'),
		meta: { requiresAuth: true, title: 'Бюджеты' },
	},
	{
		path: '/reports',
		name: 'Reports',
		component: () => import('@/pages/ReportsPage/ReportsPage.vue'),
		meta: { requiresAuth: true, requiresPremium: true, title: 'Отчёты' },
	},
	{
		path: '/settings',
		name: 'Settings',
		component: () => import('@/pages/SettingsPage/SettingsPage.vue'),
		meta: { requiresAuth: true, title: 'Настройки' },
	},
	{
		path: '/auth',
		name: 'Auth',
		component: () => import('@/pages/AuthPage/AuthPage.vue'),
		meta: { requiresGuest: true, title: 'Вход' },
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('@/pages/NotFoundPage/NotFoundPage.vue'),
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(_to, _from, savedPosition) {
		return savedPosition || { top: 0 };
	},
});

router.beforeEach(() => {
	// auth/guest/premium-логика добавится в Phase 1.3
	// (см. implementation-plan.md §1.3 «Авторизация»)
});
