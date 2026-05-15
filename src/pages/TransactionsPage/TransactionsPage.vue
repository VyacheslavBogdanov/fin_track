<script setup lang="ts">
// [Собес: Vue → onMounted (data fetch при mount)]
// [Собес: Vue → computed с getter/setter (двусторонний биндинг editTarget ↔ AppModal)]
// [Собес: Vue → scoped slots (actions передаются в TransactionList через именованный slot)]
// [Собес: Vue → :key для пересоздания формы при смене редактируемой транзакции]
// [Собес: FSD → page = композиция widgets + features + entities (низ → верх)]

import { computed, onMounted, ref } from 'vue';
import { AppButton, AppModal } from '@/shared/ui';
import { useTransactionStore, type Transaction } from '@/entities/transaction';
import { TransactionFilters, useTransactionFilters } from '@/features/filter-transactions';
import { TransactionForm } from '@/features/add-transaction';
import { TransactionEditForm } from '@/features/edit-transaction';
import { TransactionList } from '@/widgets/TransactionList';

const transactionStore = useTransactionStore();
const { filteredItems } = useTransactionFilters();

const isAddOpen = ref(false);
const editTarget = ref<Transaction | null>(null);

const isEditOpen = computed({
	get: () => editTarget.value !== null,
	set: (v) => {
		if (!v) editTarget.value = null;
	},
});

onMounted(() => {
	transactionStore.fetchAll().catch(() => {
		// Ошибка читается через transactionStore.error и показывается ниже.
	});
});
</script>

<template>
	<section class="tx-page">
		<header class="tx-page__header">
			<h1 class="tx-page__title">Транзакции</h1>
			<AppButton type="button" variant="primary" @click="isAddOpen = true">
				Добавить
			</AppButton>
		</header>

		<p v-if="transactionStore.error" class="tx-page__error" role="alert">
			{{ transactionStore.error }}
		</p>

		<div class="tx-page__layout">
			<aside class="tx-page__filters">
				<TransactionFilters />
			</aside>

			<div class="tx-page__list">
				<TransactionList :items="filteredItems">
					<template #actions="{ tx }">
						<div class="tx-page__row-actions">
							<AppButton variant="ghost" size="sm" @click="editTarget = tx">
								Изменить
							</AppButton>
							<AppButton
								variant="danger"
								size="sm"
								@click="transactionStore.remove(tx.id)"
							>
								Удалить
							</AppButton>
						</div>
					</template>
				</TransactionList>
			</div>
		</div>

		<AppModal v-model="isAddOpen" title="Новая транзакция">
			<TransactionForm @success="isAddOpen = false" />
		</AppModal>

		<AppModal v-model="isEditOpen" title="Изменить транзакцию">
			<TransactionEditForm
				v-if="editTarget"
				:key="editTarget.id"
				:transaction="editTarget"
				@success="editTarget = null"
				@cancel="editTarget = null"
			/>
		</AppModal>
	</section>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.tx-page {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	padding: var(--space-4);

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	&__title {
		margin: 0;
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
	}

	&__error {
		margin: 0;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(220, 38, 38, 0.08);
		color: var(--color-danger);
	}

	&__layout {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: 1fr;

		@include desktop-up {
			grid-template-columns: 280px 1fr;
			align-items: start;
		}
	}

	&__row-actions {
		display: flex;
		gap: var(--space-1);
	}
}
</style>
