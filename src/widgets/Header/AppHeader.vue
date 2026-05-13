<script setup lang="ts">
// [Собес: CSS → sticky positioning vs fixed]
// [Собес: a11y → семантический <header> + aria-label]

import { Menu } from 'lucide-vue-next';
import { AppButton } from '@/shared/ui';

defineEmits<{ 'toggle-sidebar': [] }>();
</script>

<template>
	<header role="banner" class="app-header">
		<div class="app-header__inner">
			<AppButton
				variant="ghost"
				size="sm"
				class="app-header__burger"
				aria-label="Открыть меню"
				aria-controls="app-sidebar"
				@click="$emit('toggle-sidebar')"
			>
				<Menu :size="24" />
			</AppButton>
			<RouterLink :to="{ name: 'Dashboard' }" class="app-header__logo">FinTrack</RouterLink>
		</div>
	</header>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.app-header {
	position: sticky;
	top: 0;
	z-index: var(--z-sticky);
	background: var(--bg-primary);
	border-bottom: 1px solid var(--border-color);

	&__inner {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);

		@include tablet-up {
			padding: var(--space-3) var(--space-6);
		}
	}

	&__burger {
		@include desktop-up {
			display: none;
		}
	}

	&__logo {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
		text-decoration: none;

		&:hover {
			color: var(--color-primary);
		}
	}
}
</style>
