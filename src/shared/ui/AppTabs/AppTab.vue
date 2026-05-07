<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted } from 'vue';
import { TabsKey } from './types';

interface Props {
	id: string;
	label: string;
}

const props = defineProps<Props>();

const ctx = inject(TabsKey);
if (!ctx) {
	throw new Error('AppTab должен быть использован внутри <AppTabs>');
}

onMounted(() => ctx.register({ id: props.id, label: props.label }));
onUnmounted(() => ctx.unregister(props.id));

const isActive = computed(() => ctx.activeId.value === props.id);
</script>

<template>
	<div
		v-if="isActive"
		role="tabpanel"
		:id="`${ctx.tablistId}-panel-${id}`"
		:aria-labelledby="`${ctx.tablistId}-tab-${id}`"
		class="app-tab"
	>
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.app-tab {
	padding: var(--space-4) 0;
}
</style>
