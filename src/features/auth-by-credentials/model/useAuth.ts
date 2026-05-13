// [Собес: Vue Router → push vs replace (replace убирает /auth из history после логина)]
// [Собес: Vue Router → query parameter (redirect: куда вернуть после логина)]
// [Собес: Pinia → storeToRefs (реактивные ссылки на state в потребителях)]
// [Собес: UX → fire-and-forget backend call для мгновенной смены маршрута без мерцания]

import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { authApi, useUserStore } from '@/entities/user';
import type { LoginInput, RegisterInput } from '@/entities/user';

export function useAuth() {
	const store = useUserStore();
	const router = useRouter();
	const route = useRoute();
	const { isAuthenticated, status, error, user } = storeToRefs(store);

	async function login(input: LoginInput): Promise<void> {
		await store.login(input);
		await router.replace(resolveRedirect());
	}

	async function register(input: RegisterInput): Promise<void> {
		await store.register(input);
		await router.replace(resolveRedirect());
	}

	async function logout(): Promise<void> {
		// Чистим state синхронно и сразу уводим на /auth — без ожидания бэкенда,
		// иначе между кликом «Выйти» и переходом маршрут ещё /dashboard, а user уже
		// исчезает из стора, и видна вспышка дашборда без шапки.
		store.clearSession();
		await router.replace({ name: 'Auth' });
		void authApi.logout().catch(() => {
			// best-effort: сессия на клиенте уже разорвана; если backend упал — не блок
		});
	}

	function resolveRedirect(): string {
		const target = route.query.redirect;
		if (typeof target === 'string' && target.startsWith('/')) {
			return target;
		}
		return '/dashboard';
	}

	return { isAuthenticated, status, error, user, login, register, logout };
}
