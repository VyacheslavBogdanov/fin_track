// [Собес: TypeScript → unknown + zod.parse (граница API: парсим перед использованием)]
// [Собес: HTTP → REST CRUD (GET / POST / PATCH / DELETE)]
// [Собес: HTTP → 204 No Content для DELETE]

import { apiFetch } from '@/shared/api';
import type { Transaction, TransactionInput, TransactionPatch } from '../model/types';
import { TransactionListResponseSchema, TransactionSchema } from './schemas';

export const transactionApi = {
	async list(): Promise<Transaction[]> {
		const raw = await apiFetch<unknown>('/transactions');
		return TransactionListResponseSchema.parse(raw).items;
	},

	async create(input: TransactionInput): Promise<Transaction> {
		const raw = await apiFetch<unknown>('/transactions', {
			method: 'POST',
			body: input,
		});
		return TransactionSchema.parse(raw);
	},

	async update(id: string, patch: TransactionPatch): Promise<Transaction> {
		const raw = await apiFetch<unknown>(`/transactions/${id}`, {
			method: 'PATCH',
			body: patch,
		});
		return TransactionSchema.parse(raw);
	},

	async delete(id: string): Promise<void> {
		await apiFetch<void>(`/transactions/${id}`, { method: 'DELETE' });
	},
} as const;
