// [Собес: TypeScript → unknown + zod.parse (граница API: парсим перед использованием)]
// [Собес: JS → почему auth-эндпоинты идут со skipRefresh: 401 от login/register
//  означает «креды неверны», запускать refresh-цикл бессмысленно и опасно
//  (старая cookie может ответить чужой ошибкой, замаскировав исходную)]

import { apiFetch } from '@/shared/api';
import type {
	AuthResponse,
	LoginInput,
	RefreshResponse,
	RegisterInput,
	User,
} from '../model/types';
import { AuthResponseSchema, MeResponseSchema, RefreshResponseSchema } from './schemas';

export const authApi = {
	async login(input: LoginInput): Promise<AuthResponse> {
		const raw = await apiFetch<unknown>('/auth/login', {
			method: 'POST',
			body: input,
			skipAuth: true,
			skipRefresh: true,
		});
		return AuthResponseSchema.parse(raw);
	},

	async register(input: RegisterInput): Promise<AuthResponse> {
		const raw = await apiFetch<unknown>('/auth/register', {
			method: 'POST',
			body: input,
			skipAuth: true,
			skipRefresh: true,
		});
		return AuthResponseSchema.parse(raw);
	},

	async refresh(): Promise<RefreshResponse> {
		const raw = await apiFetch<unknown>('/auth/refresh', {
			method: 'POST',
			skipAuth: true,
			skipRefresh: true,
		});
		return RefreshResponseSchema.parse(raw);
	},

	async logout(): Promise<void> {
		await apiFetch<void>('/auth/logout', {
			method: 'POST',
			skipRefresh: true,
		});
	},

	async me(): Promise<{ user: User }> {
		const raw = await apiFetch<unknown>('/auth/me', { method: 'GET' });
		return MeResponseSchema.parse(raw);
	},
} as const;
