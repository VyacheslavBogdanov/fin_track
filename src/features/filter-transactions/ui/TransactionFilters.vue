<script setup lang="ts">
// [Собес: JS → замыкание (debounce через useDebounce внутри composable)]
// [Собес: Vue → composable как источник singleton-state фильтров]

import { AppButton, AppInput } from '@/shared/ui';
import { useTransactionFilters } from '../model/useTransactionFilters';

const { state, reset } = useTransactionFilters();
</script>

<template>
	<div class="tx-filters">
		<AppInput v-model="state.searchQuery" label="Поиск" placeholder="Описание…" />

		<label class="tx-filters__field">
			<span class="tx-filters__label">Тип</span>
			<select v-model="state.typeFilter" class="tx-filters__select">
				<option value="all">Все</option>
				<option value="income">Доход</option>
				<option value="expense">Расход</option>
				<option value="transfer">Перевод</option>
			</select>
		</label>

		<AppInput v-model="state.categoryFilter" label="Категория (id)" />

		<label class="tx-filters__field">
			<span class="tx-filters__label">С даты</span>
			<input v-model="state.dateFrom" type="date" class="tx-filters__date" />
		</label>

		<label class="tx-filters__field">
			<span class="tx-filters__label">По дату</span>
			<input v-model="state.dateTo" type="date" class="tx-filters__date" />
		</label>

		<AppButton type="button" variant="ghost" size="sm" @click="reset">Сбросить</AppButton>
	</div>
</template>

<style lang="scss" scoped>
.tx-filters {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);

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
}
</style>
