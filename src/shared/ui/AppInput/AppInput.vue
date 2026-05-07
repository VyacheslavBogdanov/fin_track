<script setup lang="ts">
// [Собес: Vue → defineModel (двусторонняя связь)]
// [Собес: Vue → useId() для a11y label↔input]

import { computed, useId } from 'vue';

interface Props {
	label?: string;
	error?: string;
	hint?: string;
	type?: 'text' | 'number' | 'email' | 'password';
}

const props = withDefaults(defineProps<Props>(), { type: 'text' });
const model = defineModel<string | number>();

defineOptions({ inheritAttrs: false });

const inputId = useId();
const errorId = `${inputId}-error`;
const hintId = `${inputId}-hint`;

const describedBy = computed(() => {
	if (props.error) return errorId;
	if (props.hint) return hintId;
	return undefined;
});
</script>

<template>
	<div class="app-input" :class="{ 'app-input--error': !!error }">
		<label v-if="label" :for="inputId" class="app-input__label">{{ label }}</label>
		<input
			v-bind="$attrs"
			:id="inputId"
			v-model="model"
			:type="type"
			:aria-invalid="!!error || undefined"
			:aria-describedby="describedBy"
			class="app-input__field"
		/>
		<p v-if="error" :id="errorId" class="app-input__error">{{ error }}</p>
		<p v-else-if="hint" :id="hintId" class="app-input__hint">{{ hint }}</p>
	</div>
</template>

<style lang="scss" scoped>
.app-input {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);

	&__label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	&__field {
		min-height: var(--touch-target-min);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--bg-primary);
		color: var(--color-text-primary);
		font-size: var(--font-size-base);
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);

		&:focus-visible {
			outline: none;
			border-color: var(--color-primary);
			box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
		}

		&::placeholder {
			color: var(--color-text-muted);
		}
	}

	&--error &__field {
		border-color: var(--color-danger);
	}

	&__error {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-danger);
	}

	&__hint {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
}
</style>
