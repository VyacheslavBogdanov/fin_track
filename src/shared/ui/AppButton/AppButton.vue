<script setup lang="ts">
// [Собес: Vue → fallthrough attrs / $attrs / inheritAttrs]
// [Собес: Vue → defineProps с TS-generic (без runtime-валидации)]

import AppSpinner from '@/shared/ui/AppSpinner/AppSpinner.vue';

interface Props {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
	disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
	variant: 'primary',
	size: 'md',
	loading: false,
	disabled: false,
});

defineOptions({ inheritAttrs: false });
</script>

<template>
	<button
		v-bind="$attrs"
		class="app-button"
		:class="[
			`app-button--${variant}`,
			`app-button--${size}`,
			{ 'app-button--loading': loading },
		]"
		:disabled="disabled || loading"
	>
		<AppSpinner v-if="loading" size="sm" class="app-button__spinner" />
		<span class="app-button__content" :class="{ 'app-button__content--hidden': loading }">
			<slot />
		</span>
	</button>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.app-button {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-2);
	border-radius: var(--radius-md);
	font-family: inherit;
	font-weight: var(--font-weight-medium);
	cursor: pointer;
	transition:
		background var(--transition-fast),
		color var(--transition-fast),
		border-color var(--transition-fast);
	min-height: var(--touch-target-min);

	&:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	&:disabled,
	&--loading {
		cursor: not-allowed;
		opacity: 0.6;
	}

	&__content--hidden {
		visibility: hidden;
	}

	&__spinner {
		position: absolute;
	}

	&--sm {
		padding: var(--space-1) var(--space-3);
		font-size: var(--font-size-sm);

		@include desktop-up {
			min-height: 32px;
		}
	}

	&--md {
		padding: var(--space-2) var(--space-4);
		font-size: var(--font-size-base);
	}

	&--lg {
		padding: var(--space-3) var(--space-6);
		font-size: var(--font-size-lg);
	}

	&--primary {
		background: var(--color-primary);
		color: var(--color-text-inverse);
		border: 1px solid var(--color-primary);

		&:hover:not(:disabled) {
			background: var(--color-primary-hover);
			border-color: var(--color-primary-hover);
		}
	}

	&--secondary {
		background: var(--bg-secondary);
		color: var(--color-text-primary);
		border: 1px solid var(--border-color-strong);

		&:hover:not(:disabled) {
			background: var(--bg-hover);
		}
	}

	&--ghost {
		background: transparent;
		color: var(--color-text-primary);
		border: 1px solid transparent;

		&:hover:not(:disabled) {
			background: var(--bg-hover);
		}
	}

	&--danger {
		background: var(--color-danger);
		color: var(--color-text-inverse);
		border: 1px solid var(--color-danger);

		&:hover:not(:disabled) {
			filter: brightness(0.92);
		}
	}
}
</style>
