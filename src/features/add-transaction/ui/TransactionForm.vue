<script setup lang="ts">
// [Собес: Vue → v-model на компоненте (AppInput через defineModel)]
// [Собес: Vue → v-if/v-show (условный показ toAccountId для transfer)]
// [Собес: Vue → defineEmits (типизированный emit success)]
// [Собес: JS → Date.toISOString() (нормализация даты в ISO 8601 перед отправкой)]

import { AppButton, AppInput } from '@/shared/ui';
import { useTransactionStore } from '@/entities/transaction';
import { useUserStore } from '@/entities/user';
import { useZodForm } from '@/shared/composables/useZodForm';
import { addTransactionSchema, type AddTransactionFormInput } from '../model/schemas';

const emit = defineEmits<{ success: [] }>();

const transactionStore = useTransactionStore();
const userStore = useUserStore();

const todayIsoDate = new Date().toISOString().slice(0, 10);

const { values, errors, isSubmitting, serverError, handleSubmit, reset } =
	useZodForm<AddTransactionFormInput>(addTransactionSchema, {
		type: 'expense',
		amount: 0,
		currency: userStore.user?.baseCurrency ?? 'RUB',
		categoryId: '',
		accountId: '',
		description: '',
		date: todayIsoDate,
		tags: [],
		toAccountId: undefined,
	});

const submit = handleSubmit(async (input) => {
	await transactionStore.add({
		...input,
		date: new Date(input.date).toISOString(),
		toAccountId: input.type === 'transfer' ? input.toAccountId : undefined,
	});
	reset();
	emit('success');
});
</script>

<template>
	<form class="tx-form" novalidate @submit="submit">
		<p v-if="serverError" class="tx-form__server-error" role="alert">
			{{ serverError }}
		</p>

		<label class="tx-form__field">
			<span class="tx-form__label">Тип</span>
			<select v-model="values.type" class="tx-form__select">
				<option value="expense">Расход</option>
				<option value="income">Доход</option>
				<option value="transfer">Перевод</option>
			</select>
		</label>

		<AppInput
			v-model.number="values.amount"
			type="number"
			label="Сумма"
			step="0.01"
			min="0"
			:error="errors.amount"
		/>

		<label class="tx-form__field">
			<span class="tx-form__label">Валюта</span>
			<select v-model="values.currency" class="tx-form__select">
				<option value="RUB">RUB</option>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
				<option value="GBP">GBP</option>
				<option value="CNY">CNY</option>
			</select>
		</label>

		<AppInput v-model="values.categoryId" label="Категория (id)" :error="errors.categoryId" />

		<AppInput v-model="values.accountId" label="Счёт (id)" :error="errors.accountId" />

		<AppInput
			v-if="values.type === 'transfer'"
			v-model="values.toAccountId"
			label="Счёт назначения (id)"
			:error="errors.toAccountId"
		/>

		<AppInput v-model="values.description" label="Описание" :error="errors.description" />

		<label class="tx-form__field">
			<span class="tx-form__label">Дата</span>
			<input v-model="values.date" type="date" class="tx-form__date" />
			<span v-if="errors.date" class="tx-form__error">{{ errors.date }}</span>
		</label>

		<AppButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
			Добавить
		</AppButton>
	</form>
</template>

<style lang="scss" scoped>
.tx-form {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);

	&__server-error {
		margin: 0;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(220, 38, 38, 0.08);
		color: var(--color-danger);
		font-size: var(--font-size-sm);
	}

	&__field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	&__label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	&__select,
	&__date {
		min-height: var(--touch-target-min);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--bg-primary);
		color: var(--color-text-primary);
		font-size: var(--font-size-base);
	}

	&__error {
		font-size: var(--font-size-sm);
		color: var(--color-danger);
	}
}
</style>
