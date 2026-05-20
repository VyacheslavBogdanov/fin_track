// [Собес: Pinia → setup-store (defineStore + Composition API)]
// [Собес: Vue → computed (lazy + memoized по реактивным зависимостям)]
// [Собес: JS → reduce (агрегация totalIncome / totalExpense)]
// [Собес: TypeScript → Omit/Partial (DTO без serverside-полей)]
// [Собес: JS → async/await + try/catch в action (loading / success / error state-machine)]
// [Собес: JS → Map (groupBy для агрегата ТОП-5 категорий)]
// [Собес: JS → массивы (sort + slice для топ-N)]

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { ApiHttpError, type AsyncStatus } from '@/shared/api';
import type { CategoryTotal, Transaction, TransactionInput, TransactionPatch } from './types';
import { transactionApi } from '../api/transactionApi';

export const useTransactionStore = defineStore('transaction', () => {
	const items = ref<Transaction[]>([]);
	const status = ref<AsyncStatus>('idle');
	const error = ref<string | null>(null);

	const totalIncome = computed(() =>
		items.value.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
	);

	const totalExpense = computed(() =>
		items.value.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
	);

	const balance = computed(() => totalIncome.value - totalExpense.value);

	const expensesThisMonth = computed(() => {
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = now.getMonth();
		return items.value
			.filter((t) => t.type === 'expense')
			.filter((t) => {
				const d = new Date(t.date);
				return d.getFullYear() === yyyy && d.getMonth() === mm;
			})
			.reduce((sum, t) => sum + t.amount, 0);
	});

	const topExpenseCategories = computed<CategoryTotal[]>(() => {
		const byCategory = new Map<string, { total: number; count: number }>();
		for (const t of items.value) {
			if (t.type !== 'expense') continue;
			const acc = byCategory.get(t.categoryId) ?? { total: 0, count: 0 };
			acc.total += t.amount;
			acc.count += 1;
			byCategory.set(t.categoryId, acc);
		}
		return [...byCategory.entries()]
			.map(([categoryId, { total, count }]) => ({ categoryId, total, count }))
			.sort((a, b) => b.total - a.total)
			.slice(0, 5);
	});

	async function fetchAll(): Promise<void> {
		status.value = 'loading';
		error.value = null;
		try {
			items.value = await transactionApi.list();
			status.value = 'success';
		} catch (e) {
			status.value = 'error';
			error.value = extractMessage(e);
			throw e;
		}
	}

	async function add(input: TransactionInput): Promise<Transaction> {
		const created = await transactionApi.create(input);
		items.value.push(created);
		return created;
	}

	async function update(id: string, patch: TransactionPatch): Promise<Transaction> {
		const updated = await transactionApi.update(id, patch);
		const idx = items.value.findIndex((t) => t.id === id);
		if (idx === -1) {
			items.value.push(updated);
		} else {
			items.value[idx] = updated;
		}
		return updated;
	}

	async function remove(id: string): Promise<void> {
		await transactionApi.delete(id);
		const idx = items.value.findIndex((t) => t.id === id);
		if (idx !== -1) items.value.splice(idx, 1);
	}

	return {
		items,
		status,
		error,
		totalIncome,
		totalExpense,
		balance,
		expensesThisMonth,
		topExpenseCategories,
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
