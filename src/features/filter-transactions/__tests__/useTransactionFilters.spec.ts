import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { useTransactionStore, type Transaction } from '@/entities/transaction';
import { useTransactionFilters } from '@/features/filter-transactions';

let txIdCounter = 0;
function mkTx(overrides: Partial<Transaction> = {}): Transaction {
	txIdCounter += 1;
	return {
		id: `tx-${txIdCounter}`,
		type: 'expense',
		amount: 100,
		currency: 'RUB',
		categoryId: 'c1',
		accountId: 'a1',
		description: '',
		date: '2026-05-20T00:00:00.000Z',
		tags: [],
		createdAt: '2026-05-20T00:00:00.000Z',
		updatedAt: '2026-05-20T00:00:00.000Z',
		...overrides,
	};
}

describe('useTransactionFilters', () => {
	beforeEach(async () => {
		vi.useFakeTimers();
		setActivePinia(createPinia());
		const { reset } = useTransactionFilters();
		reset();
		await nextTick();
		vi.advanceTimersByTime(300);
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it('typeFilter: оставляет только income', () => {
		const store = useTransactionStore();
		store.items = [
			mkTx({ type: 'income' }),
			mkTx({ type: 'expense' }),
			mkTx({ type: 'transfer' }),
		];
		const { state, filteredItems } = useTransactionFilters();

		state.typeFilter = 'income';

		expect(filteredItems.value).toHaveLength(1);
		expect(filteredItems.value[0]?.type).toBe('income');
	});

	it('categoryFilter: оставляет только указанную категорию', () => {
		const store = useTransactionStore();
		store.items = [mkTx({ categoryId: 'food' }), mkTx({ categoryId: 'transport' })];
		const { state, filteredItems } = useTransactionFilters();

		state.categoryFilter = 'food';

		expect(filteredItems.value).toHaveLength(1);
		expect(filteredItems.value[0]?.categoryId).toBe('food');
	});

	it('dateFrom / dateTo: ограничивает диапазон включительно', () => {
		const store = useTransactionStore();
		store.items = [
			mkTx({ date: '2026-05-01T00:00:00.000Z' }),
			mkTx({ date: '2026-05-15T00:00:00.000Z' }),
			mkTx({ date: '2026-05-25T00:00:00.000Z' }),
		];
		const { state, filteredItems } = useTransactionFilters();

		state.dateFrom = '2026-05-10';
		state.dateTo = '2026-05-20';

		expect(filteredItems.value).toHaveLength(1);
		expect(filteredItems.value[0]?.date.slice(0, 10)).toBe('2026-05-15');
	});

	it('searchQuery: применяется только после debounce 300ms (case-insensitive по description)', async () => {
		const store = useTransactionStore();
		store.items = [mkTx({ description: 'Coffee' }), mkTx({ description: 'Lunch' })];
		const { state, filteredItems } = useTransactionFilters();

		state.searchQuery = 'cof';
		await nextTick();
		expect(filteredItems.value).toHaveLength(2);

		vi.advanceTimersByTime(300);
		expect(filteredItems.value).toHaveLength(1);
		expect(filteredItems.value[0]?.description).toBe('Coffee');
	});

	it('reset: сбрасывает все поля state к defaults', async () => {
		const store = useTransactionStore();
		store.items = [mkTx({ type: 'income' }), mkTx({ type: 'expense' })];
		const { state, filteredItems, reset } = useTransactionFilters();

		state.typeFilter = 'income';
		state.categoryFilter = 'c1';
		expect(filteredItems.value).toHaveLength(1);

		reset();
		await nextTick();
		vi.advanceTimersByTime(300);

		expect(state.typeFilter).toBe('all');
		expect(state.categoryFilter).toBe('');
		expect(filteredItems.value).toHaveLength(2);
	});
});
