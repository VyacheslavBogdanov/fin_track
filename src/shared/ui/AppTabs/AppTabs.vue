<script setup lang="ts">
// [Собес: Vue → provide/inject (registry pattern)]
// [Собес: a11y → WAI-ARIA tabs (role/aria-selected)]
// [Собес: a11y → keyboard navigation (Arrow/Home/End)]

import { provide, ref, useId, type ComponentPublicInstance } from 'vue';
import { TabsKey, type TabEntry } from './types';

const activeId = defineModel<string>();
const tablistId = useId();
const tabs = ref<TabEntry[]>([]);
const tabRefs: HTMLButtonElement[] = [];

const setTabRef = (el: Element | ComponentPublicInstance | null, index: number) => {
	if (el instanceof HTMLButtonElement) {
		tabRefs[index] = el;
	}
};

provide(TabsKey, {
	activeId,
	tablistId,
	register: (entry) => {
		if (!tabs.value.some((t) => t.id === entry.id)) {
			tabs.value.push(entry);
			if (activeId.value === undefined) activeId.value = entry.id;
		}
	},
	unregister: (id) => {
		tabs.value = tabs.value.filter((t) => t.id !== id);
	},
});

const focusTab = (index: number) => {
	const target = tabRefs[index];
	if (target) {
		target.focus();
		activeId.value = tabs.value[index].id;
	}
};

const onKeydown = (event: KeyboardEvent) => {
	const currentIndex = tabs.value.findIndex((t) => t.id === activeId.value);
	if (currentIndex === -1) return;
	const last = tabs.value.length - 1;

	switch (event.key) {
		case 'ArrowRight':
			event.preventDefault();
			focusTab(currentIndex === last ? 0 : currentIndex + 1);
			break;
		case 'ArrowLeft':
			event.preventDefault();
			focusTab(currentIndex === 0 ? last : currentIndex - 1);
			break;
		case 'Home':
			event.preventDefault();
			focusTab(0);
			break;
		case 'End':
			event.preventDefault();
			focusTab(last);
			break;
	}
};
</script>

<template>
	<div class="app-tabs">
		<div :id="tablistId" role="tablist" class="app-tabs__list" @keydown="onKeydown">
			<button
				v-for="(tab, index) in tabs"
				:ref="(el) => setTabRef(el, index)"
				:key="tab.id"
				role="tab"
				type="button"
				:id="`${tablistId}-tab-${tab.id}`"
				:aria-selected="activeId === tab.id"
				:aria-controls="`${tablistId}-panel-${tab.id}`"
				:tabindex="activeId === tab.id ? 0 : -1"
				class="app-tabs__tab"
				:class="{ 'app-tabs__tab--active': activeId === tab.id }"
				@click="activeId = tab.id"
			>
				{{ tab.label }}
			</button>
		</div>
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.app-tabs {
	&__list {
		display: flex;
		gap: var(--space-1);
		border-bottom: 1px solid var(--border-color);
	}

	&__tab {
		appearance: none;
		background: transparent;
		border: 0;
		border-bottom: 2px solid transparent;
		padding: var(--space-2) var(--space-4);
		min-height: var(--touch-target-min);
		font-family: inherit;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition:
			color var(--transition-fast),
			border-color var(--transition-fast);

		&:hover {
			color: var(--color-text-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary);
			outline-offset: -2px;
		}

		&--active {
			color: var(--color-primary);
			border-bottom-color: var(--color-primary);
		}
	}
}
</style>
