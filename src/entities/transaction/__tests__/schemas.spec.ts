import { describe, expect, it } from 'vitest';
import { transactionFormSchema, type TransactionFormInput } from '@/entities/transaction';

const validInput: TransactionFormInput = {
	type: 'expense',
	amount: 100,
	currency: 'RUB',
	categoryId: 'food',
	accountId: 'cash',
	description: 'Lunch',
	date: '2026-05-20',
	tags: [],
};

function fieldsWithError(input: unknown): string[] {
	const result = transactionFormSchema.safeParse(input);
	if (result.success) return [];
	return result.error.issues.map((i) => String(i.path[0]));
}

describe('transactionFormSchema', () => {
	it('валидный input → success', () => {
		expect(transactionFormSchema.safeParse(validInput).success).toBe(true);
	});

	it('amount = 0 → ошибка на поле amount', () => {
		expect(fieldsWithError({ ...validInput, amount: 0 })).toContain('amount');
	});

	it('amount < 0 → ошибка на поле amount', () => {
		expect(fieldsWithError({ ...validInput, amount: -10 })).toContain('amount');
	});

	it('пустой categoryId → ошибка', () => {
		expect(fieldsWithError({ ...validInput, categoryId: '' })).toContain('categoryId');
	});

	it('пустой accountId → ошибка', () => {
		expect(fieldsWithError({ ...validInput, accountId: '' })).toContain('accountId');
	});

	it('пустая date → ошибка', () => {
		expect(fieldsWithError({ ...validInput, date: '' })).toContain('date');
	});

	it('description > 200 символов → ошибка', () => {
		expect(fieldsWithError({ ...validInput, description: 'x'.repeat(201) })).toContain(
			'description',
		);
	});

	it('type=transfer без toAccountId → ошибка на toAccountId (.refine)', () => {
		expect(fieldsWithError({ ...validInput, type: 'transfer' })).toContain('toAccountId');
	});

	it('type=transfer с toAccountId → success', () => {
		const result = transactionFormSchema.safeParse({
			...validInput,
			type: 'transfer',
			toAccountId: 'savings',
		});
		expect(result.success).toBe(true);
	});

	it('type=expense без toAccountId → success (.refine пропускает)', () => {
		expect(transactionFormSchema.safeParse(validInput).success).toBe(true);
	});
});
