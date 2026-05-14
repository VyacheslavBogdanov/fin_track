// [Собес: TypeScript → unknown + zod.parse на границе API (рантайм-валидация)]

import { z } from 'zod';

const TransactionTypeSchema = z.enum(['income', 'expense', 'transfer']);
const CurrencySchema = z.enum(['RUB', 'USD', 'EUR', 'GBP', 'CNY']);

export const TransactionSchema = z.object({
	id: z.string(),
	type: TransactionTypeSchema,
	amount: z.number(),
	currency: CurrencySchema,
	categoryId: z.string(),
	accountId: z.string(),
	description: z.string(),
	date: z.string(),
	tags: z.array(z.string()),
	toAccountId: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const TransactionListResponseSchema = z.object({
	items: z.array(TransactionSchema),
});
