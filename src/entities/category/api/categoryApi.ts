// [Собес: TypeScript → unknown + zod.parse (граница API)]
// [Собес: HTTP → REST CRUD (GET / POST / PATCH / DELETE)]
// [Собес: HTTP → 204 No Content для DELETE]

import { apiFetch } from '@/shared/api';
import type { Category, CategoryInput, CategoryPatch } from '../model/types';
import { CategoryListResponseSchema, CategorySchema } from './schemas';

export const categoryApi = {
	async list(): Promise<Category[]> {
		const raw = await apiFetch<unknown>('/categories');
		return CategoryListResponseSchema.parse(raw).items;
	},

	async create(input: CategoryInput): Promise<Category> {
		const raw = await apiFetch<unknown>('/categories', {
			method: 'POST',
			body: input,
		});
		return CategorySchema.parse(raw);
	},

	async update(id: string, patch: CategoryPatch): Promise<Category> {
		const raw = await apiFetch<unknown>(`/categories/${id}`, {
			method: 'PATCH',
			body: patch,
		});
		return CategorySchema.parse(raw);
	},

	async delete(id: string): Promise<void> {
		await apiFetch<void>(`/categories/${id}`, { method: 'DELETE' });
	},
} as const;
