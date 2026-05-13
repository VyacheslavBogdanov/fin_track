// [Собес: Vue Router → createWebHistory vs createWebHashHistory]
// [Собес: Vue Router → lazy-импорт компонентов / code splitting]
// [Собес: Vue Router → navigation guards (beforeEach + query.redirect)]
// [Собес: Vue Router → typed route meta (declaration merging)]

import {
	createRouter,
	createWebHistory,
	type NavigationGuard,
	type RouteRecordRaw,
} from 'vue-router';
import { useUserStore } from '@/entities/user';

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

export const authGuard: NavigationGuard = (to) => {
	const store = useUserStore();

	if (to.meta.requiresAuth && !store.isAuthenticated) {
		return { name: 'Auth', query: { redirect: to.fullPath } };
	}

	if (to.meta.requiresGuest && store.isAuthenticated) {
		return { name: 'Dashboard' };
	}

	// TODO Phase 2+: requiresPremium — проверка флага user.isPremium после расширения модели.
	return true;
};

export const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(_to, _from, savedPosition) {
		return savedPosition || { top: 0 };
	},
});

router.beforeEach(authGuard);
