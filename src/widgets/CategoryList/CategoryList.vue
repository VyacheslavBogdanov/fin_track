<script setup lang="ts">
// [Собес: Vue → key в v-for (стабильный id ускоряет VDOM-diff и удерживает state DOM-узлов)]
// [Собес: Vue → scoped slots (родитель управляет рендером строки или actions через slot props)]
// [Собес: Vue → defineProps с TS-generic (без runtime-валидации)]

import type { Category } from '@/entities/category';

withDefaults(
	defineProps<{
		items: Category[];
		emptyText?: string;
	}>(),
	{ emptyText: 'Нет категорий' },
);
</script>

<template>
	<ul v-if="items.length > 0" class="cat-list">
		<li v-for="cat in items" :key="cat.id" class="cat-list__item">
			<slot name="row" :cat="cat">
				<div class="cat-list__default-row">
					<span class="cat-list__icon" :style="{ backgroundColor: cat.color }">
						{{ cat.icon }}
					</span>
					<span class="cat-list__name">{{ cat.name }}</span>
					<span class="cat-list__type" :class="`cat-list__type--${cat.type}`">
						{{ cat.type === 'income' ? 'доход' : 'расход' }}
					</span>
					<slot name="actions" :cat="cat" />
				</div>
			</slot>
		</li>
	</ul>
	<p v-else class="cat-list__empty">{{ emptyText }}</p>
</template>

<style lang="scss" scoped>
.cat-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: var(--space-2);

	&__item {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--bg-primary);
	}

	&__default-row {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		gap: var(--space-3);
		align-items: center;
	}

	&__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-md);
		color: var(--color-text-inverse);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
	}

	&__name {
		color: var(--color-text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__type {
		font-size: var(--font-size-sm);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);

		&--income {
			color: var(--color-success);
			background: rgba(16, 185, 129, 0.1);
		}

		&--expense {
			color: var(--color-danger);
			background: rgba(239, 68, 68, 0.1);
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
