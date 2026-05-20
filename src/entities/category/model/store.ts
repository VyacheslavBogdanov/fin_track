// [Собес: Pinia → setup-store (defineStore + Composition API)]
// [Собес: Vue → computed (производные списки incomeCategories / expenseCategories)]
// [Собес: JS → массивы (filter по type для UI-select'ов)]
// [Собес: Browser → crypto.randomUUID (UUID v4 без зависимостей — пока api нет)]

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Category, CategoryInput, CategoryPatch } from './types';

export const useCategoryStore = defineStore('category', () => {
	const items = ref<Category[]>([]);

	const incomeCategories = computed(() => items.value.filter((c) => c.type === 'income'));
	const expenseCategories = computed(() => items.value.filter((c) => c.type === 'expense'));

	function add(input: CategoryInput): Category {
		const now = new Date().toISOString();
		const category: Category = {
			...input,
			id: crypto.randomUUID(),
			createdAt: now,
			updatedAt: now,
		};
		items.value.push(category);
		return category;
	}

	function update(id: string, patch: CategoryPatch): Category | null {
		const idx = items.value.findIndex((c) => c.id === id);
		if (idx === -1) return null;
		items.value[idx] = {
			...items.value[idx],
			...patch,
			updatedAt: new Date().toISOString(),
		};
		return items.value[idx];
	}

	function remove(id: string): boolean {
		const idx = items.value.findIndex((c) => c.id === id);
		if (idx === -1) return false;
		items.value.splice(idx, 1);
		return true;
	}

	return {
		items,
		incomeCategories,
		expenseCategories,
		add,
		update,
		remove,
	};
});
