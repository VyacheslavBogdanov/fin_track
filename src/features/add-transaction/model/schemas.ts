// [Собес: TypeScript → zod schema + z.infer (один источник истины для формы)]
// [Собес: Zod → cross-field валидация через .refine (transfer требует toAccountId)]

import { z } from 'zod';

const TransactionTypeSchema = z.enum(['income', 'expense', 'transfer']);
const CurrencySchema = z.enum(['RUB', 'USD', 'EUR', 'GBP', 'CNY']);

export const addTransactionSchema = z
	.object({
		type: TransactionTypeSchema,
		amount: z.number().positive('Сумма должна быть больше 0'),
		currency: CurrencySchema,
		categoryId: z.string().min(1, 'Укажите категорию'),
		accountId: z.string().min(1, 'Укажите счёт'),
		description: z.string().max(200, 'Максимум 200 символов'),
		date: z.string().min(1, 'Укажите дату'),
		tags: z.array(z.string()),
		toAccountId: z.string().optional(),
	})
	.refine((data) => data.type !== 'transfer' || !!data.toAccountId, {
		message: 'Укажите счёт назначения',
		path: ['toAccountId'],
	});

export type AddTransactionFormInput = z.infer<typeof addTransactionSchema>;
