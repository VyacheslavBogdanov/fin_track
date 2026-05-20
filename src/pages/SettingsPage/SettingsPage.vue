<script setup lang="ts">
import CategoriesSection from './CategoriesSection.vue';
</script>

<template>
	<section class="settings-page">
		<h1 class="settings-page__title">Настройки</h1>
		<CategoriesSection />
	</section>
</template>

<style lang="scss" scoped>
.settings-page {
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
	padding: var(--space-4);

	&__title {
		margin: 0;
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
	}
}
</style>
