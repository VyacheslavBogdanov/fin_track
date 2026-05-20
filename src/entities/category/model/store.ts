// [Собес: Pinia → setup-store (defineStore + Composition API)]
// [Собес: Vue → computed (производные списки incomeCategories / expenseCategories)]
// [Собес: JS → массивы (filter по type для UI-select'ов)]
// [Собес: JS → async/await + try/catch в action (loading / success / error state-machine)]

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { ApiHttpError, type AsyncStatus } from '@/shared/api';
import type { Category, CategoryInput, CategoryPatch } from './types';
import { categoryApi } from '../api/categoryApi';

export const useCategoryStore = defineStore('category', () => {
	const items = ref<Category[]>([]);
	const status = ref<AsyncStatus>('idle');
	const error = ref<string | null>(null);

	const incomeCategories = computed(() => items.value.filter((c) => c.type === 'income'));
	const expenseCategories = computed(() => items.value.filter((c) => c.type === 'expense'));

	async function fetchAll(): Promise<void> {
		status.value = 'loading';
		error.value = null;
		try {
			items.value = await categoryApi.list();
			status.value = 'success';
		} catch (e) {
			status.value = 'error';
			error.value = extractMessage(e);
			throw e;
		}
	}

	async function add(input: CategoryInput): Promise<Category> {
		const created = await categoryApi.create(input);
		items.value.push(created);
		return created;
	}

	async function update(id: string, patch: CategoryPatch): Promise<Category> {
		const updated = await categoryApi.update(id, patch);
		const idx = items.value.findIndex((c) => c.id === id);
		if (idx === -1) {
			items.value.push(updated);
		} else {
			items.value[idx] = updated;
		}
		return updated;
	}

	async function remove(id: string): Promise<void> {
		await categoryApi.delete(id);
		const idx = items.value.findIndex((c) => c.id === id);
		if (idx !== -1) items.value.splice(idx, 1);
	}

	return {
		items,
		status,
		error,
		incomeCategories,
		expenseCategories,
		fetchAll,
		add,
		update,
		remove,
	};
});

function extractMessage(e: unknown): string {
	if (e instanceof ApiHttpError) return e.message;
	if (e instanceof Error) return e.message;
	return 'Unknown error';
}
