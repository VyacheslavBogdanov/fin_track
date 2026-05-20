// [Собес: TypeScript → unknown + zod.parse на границе API (рантайм-валидация)]

import { z } from 'zod';

const CategoryTypeSchema = z.enum(['income', 'expense']);

export const CategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	type: CategoryTypeSchema,
	icon: z.string(),
	color: z.string(),
	parentId: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const CategoryListResponseSchema = z.object({
	items: z.array(CategorySchema),
});
