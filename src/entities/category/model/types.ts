// [Собес: TypeScript → interface extends (наследование от BaseEntity)]
// [Собес: TypeScript → discriminated union (CategoryType income/expense)]
// [Собес: TypeScript → nullable type (parentId: string | null) — задел под дерево Phase 2]
// [Собес: TypeScript → Omit/Partial utility types (DTO без serverside-полей)]

import type { BaseEntity } from '@/shared/types/entity';

export type CategoryType = 'income' | 'expense';

export interface Category extends BaseEntity {
	name: string;
	type: CategoryType;
	icon: string;
	color: string;
	/** null = корневая категория; в Phase 1 используется только null (плоский список). */
	parentId: string | null;
}

export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryPatch = Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>;
