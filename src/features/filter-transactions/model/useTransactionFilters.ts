// [Собес: Vue → composable как абстракция над module-level singleton-state]
// [Собес: Vue → computed (производная без мутации items)]
// [Собес: JS → массивы (filter chain по нескольким условиям)]
// [Собес: Vue → effectScope (detached scope для module-level watch)]

import { computed, effectScope, reactive, toRef } from 'vue';
import {
	useTransactionStore,
	type Transaction,
	type TransactionType,
} from '@/entities/transaction';
import { useDebounce } from '@/shared/composables/useDebounce';

export interface TransactionFilterState {
	searchQuery: string;
	typeFilter: TransactionType | 'all';
	categoryFilter: string;
	dateFrom: string;
	dateTo: string;
}

const initial: TransactionFilterState = {
	searchQuery: '',
	typeFilter: 'all',
	categoryFilter: '',
	dateFrom: '',
	dateTo: '',
};

const state = reactive<TransactionFilterState>({ ...initial });

const scope = effectScope(true);
const debouncedQuery = scope.run(() => useDebounce(toRef(state, 'searchQuery'), 300))!;

export function useTransactionFilters() {
	const transactionStore = useTransactionStore();

	const filteredItems = computed<Transaction[]>(() => {
		const q = debouncedQuery.value.trim().toLowerCase();
		return transactionStore.items.filter((tx) => {
			if (state.typeFilter !== 'all' && tx.type !== state.typeFilter) return false;
			if (state.categoryFilter && tx.categoryId !== state.categoryFilter) return false;
			if (state.dateFrom && tx.date.slice(0, 10) < state.dateFrom) return false;
			if (state.dateTo && tx.date.slice(0, 10) > state.dateTo) return false;
			if (q && !tx.description.toLowerCase().includes(q)) return false;
			return true;
		});
	});

	function reset(): void {
		Object.assign(state, initial);
	}

	return {
		state,
		filteredItems,
		reset,
	};
}
