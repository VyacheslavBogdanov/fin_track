// [Собес: TypeScript → interface extends (наследование от BaseEntity)]
// [Собес: TypeScript → discriminated union (TransactionType)]
// [Собес: TypeScript → optional properties (toAccountId?)]
// [Собес: TypeScript → Omit/Partial utility types (DTO без serverside-полей)]

import type { BaseEntity } from '@/shared/types/entity';
import type { Currency } from '@/shared/types/currency';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction extends BaseEntity {
	type: TransactionType;
	amount: number;
	currency: Currency;
	categoryId: string;
	accountId: string;
	description: string;
	date: string; // ISO 8601
	tags: string[];
	/** ID целевого счёта для type === 'transfer' */
	toAccountId?: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type TransactionPatch = Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>;
