<script setup lang="ts">
// [Собес: Vue → key в v-for (стабильный id ускоряет VDOM-diff и удерживает state DOM-узлов)]
// [Собес: Vue → scoped slots (родитель управляет рендером строки, получая tx через slot props)]
// [Собес: Vue → defineProps c TS-generic (без runtime-валидации)]

import type { Transaction } from '@/entities/transaction';

withDefaults(
	defineProps<{
		items: Transaction[];
		emptyText?: string;
	}>(),
	{ emptyText: 'Нет транзакций' },
);
</script>

<template>
	<ul v-if="items.length > 0" class="tx-list">
		<li v-for="tx in items" :key="tx.id" class="tx-list__item">
			<slot name="row" :tx="tx">
				<div class="tx-list__default-row">
					<span class="tx-list__date">{{ tx.date.slice(0, 10) }}</span>
					<span class="tx-list__desc">{{ tx.description || '—' }}</span>
					<span class="tx-list__amount" :class="`tx-list__amount--${tx.type}`">
						{{ tx.type === 'expense' ? '−' : '+' }}{{ tx.amount }} {{ tx.currency }}
					</span>
				</div>
			</slot>
		</li>
	</ul>
	<p v-else class="tx-list__empty">{{ emptyText }}</p>
</template>

<style lang="scss" scoped>
.tx-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: var(--space-2);

	&__item {
		padding: var(--space-3);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--bg-primary);
	}

	&__default-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--space-3);
		align-items: center;
	}

	&__date {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	&__desc {
		color: var(--color-text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__amount {
		font-weight: var(--font-weight-medium);
		font-variant-numeric: tabular-nums;

		&--income {
			color: var(--color-success);
		}

		&--expense {
			color: var(--color-danger);
		}

		&--transfer {
			color: var(--color-text-secondary);
		}
	}

	&__empty {
		margin: 0;
		padding: var(--space-4);
		text-align: center;
		color: var(--color-text-muted);
	}
}
</style>
