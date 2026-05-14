// [Собес: Pinia → setup-store (defineStore + Composition API)]
// [Собес: Vue → computed (lazy + memoized по реактивным зависимостям)]
// [Собес: JS → reduce (агрегация totalIncome / totalExpense)]
// [Собес: TypeScript → Omit/Partial (DTO без serverside-полей)]
// [Собес: Browser → crypto.randomUUID (UUID v4 без зависимостей)]

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Transaction, TransactionInput, TransactionPatch } from './types';

export const useTransactionStore = defineStore('transaction', () => {
	const items = ref<Transaction[]>([]);

	const totalIncome = computed(() =>
		items.value.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
	);

	const totalExpense = computed(() =>
		items.value.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
	);

	function add(input: TransactionInput): Transaction {
		const now = new Date().toISOString();
		const tx: Transaction = {
			...input,
			id: crypto.randomUUID(),
			createdAt: now,
			updatedAt: now,
		};
		items.value.push(tx);
		return tx;
	}

	function update(id: string, patch: TransactionPatch): Transaction | null {
		const idx = items.value.findIndex((t) => t.id === id);
		if (idx === -1) return null;
		items.value[idx] = {
			...items.value[idx],
			...patch,
			updatedAt: new Date().toISOString(),
		};
		return items.value[idx];
	}

	function remove(id: string): boolean {
		const idx = items.value.findIndex((t) => t.id === id);
		if (idx === -1) return false;
		items.value.splice(idx, 1);
		return true;
	}

	return {
		items,
		totalIncome,
		totalExpense,
		add,
		update,
		remove,
	};
});
