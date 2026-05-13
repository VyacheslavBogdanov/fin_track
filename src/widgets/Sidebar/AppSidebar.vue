<script setup lang="ts">
// [Собес: Vue Router → RouterLink + active classes]
// [Собес: CSS → mobile-first overlay drawer → desktop permanent slot]
// [Собес: Vue → inheritAttrs: false + v-bind="$attrs" (fragment-root компонент)]

import { LogOut, X } from 'lucide-vue-next';
import { AppButton } from '@/shared/ui';
import { useDrawer } from '@/shared/composables/useDrawer';
import { useAuth } from '@/features/auth-by-credentials';
import { navItems } from './nav-items';

defineOptions({ inheritAttrs: false });

const open = defineModel<boolean>('open', { default: false });
const { drawerRef, isDesktop } = useDrawer(open);
const { logout } = useAuth();

async function handleLogout(): Promise<void> {
	open.value = false;
	await logout();
}
</script>

<template>
	<div
		class="app-sidebar__backdrop"
		:class="{ 'app-sidebar__backdrop--visible': open }"
		@click="open = false"
	/>
	<aside
		id="app-sidebar"
		ref="drawerRef"
		v-bind="$attrs"
		class="app-sidebar"
		:class="{ 'app-sidebar--open': open }"
		:aria-modal="!isDesktop && open ? 'true' : undefined"
		:aria-hidden="!isDesktop && !open ? 'true' : undefined"
		role="navigation"
		aria-label="Основная навигация"
	>
		<div class="app-sidebar__header">
			<span class="app-sidebar__title">Меню</span>
			<AppButton
				v-show="!isDesktop"
				variant="ghost"
				size="sm"
				aria-label="Закрыть меню"
				@click="open = false"
			>
				<X :size="20" />
			</AppButton>
		</div>
		<nav class="app-sidebar__nav">
			<RouterLink
				v-for="item in navItems"
				:key="item.name"
				:to="{ name: item.name }"
				class="app-sidebar__link"
				active-class="app-sidebar__link--active"
				@click="open = false"
			>
				<component :is="item.icon" :size="20" class="app-sidebar__link-icon" />
				<span>{{ item.label }}</span>
			</RouterLink>
		</nav>
		<div class="app-sidebar__footer">
			<AppButton variant="ghost" size="md" @click="handleLogout">
				<LogOut :size="20" />
				<span>Выйти</span>
			</AppButton>
		</div>
	</aside>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.app-sidebar {
	position: fixed;
	inset: 0 auto 0 0;
	width: 280px;
	max-width: 80vw;
	background: var(--bg-primary);
	border-right: 1px solid var(--border-color);
	transform: translateX(-100%);
	transition: transform var(--transition-normal);
	z-index: var(--z-modal);
	display: flex;
	flex-direction: column;

	&--open {
		transform: translateX(0);
	}

	@include desktop-up {
		position: sticky;
		top: 0;
		height: 100vh;
		transform: none;
		z-index: auto;
		max-width: none;
	}

	&__backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--transition-normal);
		z-index: var(--z-modal-backdrop);

		&--visible {
			opacity: 1;
			pointer-events: auto;
		}

		@include desktop-up {
			display: none;
		}
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4);
		border-bottom: 1px solid var(--border-color);

		@include desktop-up {
			justify-content: flex-start;
		}
	}

	&__title {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	&__nav {
		display: flex;
		flex-direction: column;
		padding: var(--space-2);
		gap: var(--space-1);
		flex: 1;
	}

	&__footer {
		padding: var(--space-3) var(--space-2);
		border-top: 1px solid var(--border-color);
		display: flex;
	}

	&__link {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: var(--touch-target-min);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--color-text-secondary);
		font-size: var(--font-size-base);
		transition:
			background var(--transition-fast),
			color var(--transition-fast);

		&:hover {
			background: var(--bg-hover);
			color: var(--color-text-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary);
			outline-offset: -2px;
		}

		&--active {
			background: var(--bg-hover);
			color: var(--color-primary);
			font-weight: var(--font-weight-medium);
		}
	}

	&__link-icon {
		flex-shrink: 0;
	}
}
</style>
