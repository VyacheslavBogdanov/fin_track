// [Собес: TypeScript → zod schema + z.infer (один источник истины для form-DTO)]
// [Собес: Zod → regex-валидация (HEX-цвет)]

import { z } from 'zod';

const CategoryTypeSchema = z.enum(['income', 'expense']);
const ColorSchema = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Цвет в формате #RRGGBB');

export const categoryFormSchema = z.object({
	name: z.string().min(1, 'Введите название').max(60, 'Максимум 60 символов'),
	type: CategoryTypeSchema,
	icon: z.string().max(4, 'Максимум 4 символа'),
	color: ColorSchema,
	parentId: z.string().nullable(),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
