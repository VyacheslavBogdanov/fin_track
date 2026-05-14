<script setup lang="ts">
// [Собес: Vue → defineProps + defineEmits (типизированный API компонента)]
// [Собес: Vue → key для пересоздания формы при смене prop (родитель задаёт :key="tx.id")]
// [Собес: Pinia → action update через api (server-side timestamp обновляется)]

import { AppButton, AppInput } from '@/shared/ui';
import {
	useTransactionStore,
	transactionFormSchema,
	type Transaction,
	type TransactionFormInput,
} from '@/entities/transaction';
import { useZodForm } from '@/shared/composables/useZodForm';

const props = defineProps<{ transaction: Transaction }>();
const emit = defineEmits<{ success: []; cancel: [] }>();

const transactionStore = useTransactionStore();

const { values, errors, isSubmitting, serverError, handleSubmit } =
	useZodForm<TransactionFormInput>(transactionFormSchema, {
		type: props.transaction.type,
		amount: props.transaction.amount,
		currency: props.transaction.currency,
		categoryId: props.transaction.categoryId,
		accountId: props.transaction.accountId,
		description: props.transaction.description,
		date: props.transaction.date.slice(0, 10),
		tags: [...props.transaction.tags],
		toAccountId: props.transaction.toAccountId,
	});

const submit = handleSubmit(async (input) => {
	await transactionStore.update(props.transaction.id, {
		...input,
		date: new Date(input.date).toISOString(),
		toAccountId: input.type === 'transfer' ? input.toAccountId : undefined,
	});
	emit('success');
});
</script>

<template>
	<form class="tx-edit-form" novalidate @submit="submit">
		<p v-if="serverError" class="tx-edit-form__server-error" role="alert">
			{{ serverError }}
		</p>

		<label class="tx-edit-form__field">
			<span class="tx-edit-form__label">Тип</span>
			<select v-model="values.type" class="tx-edit-form__select">
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

		<label class="tx-edit-form__field">
			<span class="tx-edit-form__label">Валюта</span>
			<select v-model="values.currency" class="tx-edit-form__select">
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

		<label class="tx-edit-form__field">
			<span class="tx-edit-form__label">Дата</span>
			<input v-model="values.date" type="date" class="tx-edit-form__date" />
			<span v-if="errors.date" class="tx-edit-form__error">{{ errors.date }}</span>
		</label>

		<div class="tx-edit-form__actions">
			<AppButton
				type="button"
				variant="ghost"
				:disabled="isSubmitting"
				@click="emit('cancel')"
			>
				Отмена
			</AppButton>
			<AppButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
				Сохранить
			</AppButton>
		</div>
	</form>
</template>

<style lang="scss" scoped>
.tx-edit-form {
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

	&__actions {
		display: flex;
		gap: var(--space-2);
		justify-content: flex-end;
	}
}
</style>
