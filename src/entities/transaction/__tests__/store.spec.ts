import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { setAuthBridge } from '@/shared/api';
import { seedMockUser } from '@/shared/api/mocks';
import { useUserStore } from '@/entities/user';
import { useTransactionStore } from '@/entities/transaction';
import type { TransactionInput } from '@/entities/transaction';

const txInput = (overrides: Partial<TransactionInput> = {}): TransactionInput => ({
	type: 'expense',
	amount: 100,
	currency: 'RUB',
	categoryId: 'food',
	accountId: 'cash',
	description: '',
	date: '2026-05-20T00:00:00.000Z',
	tags: [],
	...overrides,
});

describe('useTransactionStore', () => {
	beforeEach(async () => {
		setActivePinia(createPinia());
		seedMockUser({ email: 'tester@example.com', password: 'secret123' });
		const userStore = useUserStore();
		setAuthBridge({
			getAccessToken: () => userStore.accessToken,
			setAccessToken: (token) => {
				userStore.accessToken = token;
			},
			refresh: () => userStore.refreshSession(),
			onAuthFailure: () => userStore.clearSession(),
		});
		await userStore.login({ email: 'tester@example.com', password: 'secret123' });
	});

	it('add: создаёт транзакцию с серверными id/createdAt и пушит в items', async () => {
		const store = useTransactionStore();

		const tx = await store.add(txInput({ amount: 250, description: 'Lunch' }));

		expect(store.items).toHaveLength(1);
		expect(store.items[0]).toEqual(tx);
		expect(tx.id).toBeTruthy();
		expect(tx.createdAt).toBeTruthy();
		expect(tx.updatedAt).toBeTruthy();
		expect(tx.amount).toBe(250);
		expect(tx.description).toBe('Lunch');
	});

	it('totalIncome / totalExpense: reduce-агрегация по типу', async () => {
		const store = useTransactionStore();

		await store.add(txInput({ type: 'income', amount: 1000 }));
		await store.add(txInput({ type: 'income', amount: 500 }));
		await store.add(txInput({ type: 'expense', amount: 200 }));
		await store.add(txInput({ type: 'expense', amount: 50 }));
		await store.add(txInput({ type: 'transfer', amount: 300 }));

		expect(store.totalIncome).toBe(1500);
		expect(store.totalExpense).toBe(250);
	});

	it('remove: удаляет транзакцию из items и обновляет totals', async () => {
		const store = useTransactionStore();

		const a = await store.add(txInput({ type: 'income', amount: 1000 }));
		await store.add(txInput({ type: 'income', amount: 500 }));
		expect(store.totalIncome).toBe(1500);

		await store.remove(a.id);

		expect(store.items).toHaveLength(1);
		expect(store.totalIncome).toBe(500);
	});

	it('update: меняет поля существующей транзакции, totalExpense пересчитывается', async () => {
		const store = useTransactionStore();

		const tx = await store.add(txInput({ type: 'expense', amount: 100 }));
		expect(store.totalExpense).toBe(100);

		await store.update(tx.id, { amount: 250 });

		expect(store.items[0]?.amount).toBe(250);
		expect(store.totalExpense).toBe(250);
	});
});
