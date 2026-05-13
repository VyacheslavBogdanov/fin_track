// [Собес: Pinia → setup-store (defineStore + Composition API)]
// [Собес: Pinia → storeToRefs (для реактивных ссылок наружу)]
// [Собес: JS → async/await + try/catch в action]
// [Собес: Browser → access token в памяти vs HttpOnly cookie для refresh]

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { ApiHttpError, type AsyncStatus } from '@/shared/api';
import { authApi } from '../api/authApi';
import type { LoginInput, RegisterInput, User } from './types';

export const useUserStore = defineStore('user', () => {
	const user = ref<User | null>(null);
	const accessToken = ref<string | null>(null);
	const status = ref<AsyncStatus>('idle');
	const error = ref<string | null>(null);

	const isAuthenticated = computed(() => accessToken.value !== null);

	async function login(input: LoginInput): Promise<void> {
		status.value = 'loading';
		error.value = null;
		try {
			const result = await authApi.login(input);
			user.value = result.user;
			accessToken.value = result.accessToken;
			status.value = 'success';
		} catch (e) {
			status.value = 'error';
			error.value = extractMessage(e);
			throw e;
		}
	}

	async function register(input: RegisterInput): Promise<void> {
		status.value = 'loading';
		error.value = null;
		try {
			const result = await authApi.register(input);
			user.value = result.user;
			accessToken.value = result.accessToken;
			status.value = 'success';
		} catch (e) {
			status.value = 'error';
			error.value = extractMessage(e);
			throw e;
		}
	}

	async function logout(): Promise<void> {
		try {
			await authApi.logout();
		} finally {
			clearSession();
		}
	}

	async function refreshSession(): Promise<string> {
		const { accessToken: newToken } = await authApi.refresh();
		accessToken.value = newToken;
		return newToken;
	}

	function clearSession(): void {
		user.value = null;
		accessToken.value = null;
		status.value = 'idle';
		error.value = null;
	}

	// [Собес: Browser → cookie HttpOnly (refresh-cookie уезжает автоматически
	//  через credentials:'include' — JS до неё не дотягивается, восстановление возможно
	//  только через сервер)]
	// Восстановление сессии при F5: пробуем refresh по cookie; если ОК — тянем /auth/me.
	// Любая ошибка (нет cookie / просрочен / отозван) → остаёмся анонимом, на /auth.
	async function initSession(): Promise<void> {
		try {
			const { accessToken: newToken } = await authApi.refresh();
			accessToken.value = newToken;
			const { user: u } = await authApi.me();
			user.value = u;
		} catch {
			clearSession();
		}
	}

	return {
		user,
		accessToken,
		status,
		error,
		isAuthenticated,
		login,
		register,
		logout,
		refreshSession,
		clearSession,
		initSession,
	};
});

function extractMessage(e: unknown): string {
	if (e instanceof ApiHttpError) return e.message;
	if (e instanceof Error) return e.message;
	return 'Unknown error';
}
