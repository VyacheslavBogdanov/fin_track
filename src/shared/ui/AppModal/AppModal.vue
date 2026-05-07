<script setup lang="ts">
// [Собес: Vue → Teleport (выход из стэкинг-контекста)]
// [Собес: Vue → Transition / enter-leave]
// [Собес: a11y → ARIA dialog (role/aria-modal/aria-labelledby)]
// [Собес: a11y → focus trap + ESC-закрытие]

import { ref, useId, watch, onUnmounted } from 'vue';
import { useFocusTrap } from '@/shared/composables/useFocusTrap';

interface Props {
	title?: string;
}
defineProps<Props>();

const model = defineModel<boolean>({ default: false });
const dialogRef = ref<HTMLElement | null>(null);
const titleId = useId();

useFocusTrap(dialogRef, model);

const onKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && model.value) {
		model.value = false;
	}
};

watch(
	model,
	(value) => {
		if (value) {
			document.addEventListener('keydown', onKeydown);
		} else {
			document.removeEventListener('keydown', onKeydown);
		}
	},
	{ immediate: true },
);

onUnmounted(() => {
	document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
	<Teleport to="body">
		<Transition name="app-modal">
			<div v-if="model" class="app-modal__backdrop" @click.self="model = false">
				<div
					ref="dialogRef"
					class="app-modal"
					role="dialog"
					aria-modal="true"
					:aria-labelledby="title ? titleId : undefined"
				>
					<header v-if="$slots.header || title" class="app-modal__header">
						<slot name="header">
							<h2 :id="titleId" class="app-modal__title">{{ title }}</h2>
						</slot>
					</header>
					<div class="app-modal__body">
						<slot />
					</div>
					<footer v-if="$slots.footer" class="app-modal__footer">
						<slot name="footer" />
					</footer>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.app-modal {
	background: var(--bg-card);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	width: 100%;
	max-width: 500px;
	max-height: calc(100vh - var(--space-8));
	display: flex;
	flex-direction: column;
	overflow: hidden;

	&__backdrop {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
	}

	&__header,
	&__footer {
		padding: var(--space-4) var(--space-5);
	}

	&__header {
		border-bottom: 1px solid var(--border-color);
	}

	&__footer {
		border-top: 1px solid var(--border-color);
		display: flex;
		gap: var(--space-2);
		justify-content: flex-end;
	}

	&__title {
		margin: 0;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
	}

	&__body {
		padding: var(--space-5);
		overflow-y: auto;
	}
}

.app-modal-enter-active,
.app-modal-leave-active {
	transition: opacity var(--transition-normal);

	.app-modal {
		transition: transform var(--transition-normal);
	}
}

.app-modal-enter-from,
.app-modal-leave-to {
	opacity: 0;

	.app-modal {
		transform: translateY(8px);
	}
}
</style>
