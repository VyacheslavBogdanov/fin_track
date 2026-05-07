// [Собес: Vue → composables (переиспользуемая логика)]
// [Собес: a11y → focus trap / возврат фокуса]
// [Собес: a11y → keyboard navigation (Tab/Shift+Tab)]

import { watch, onUnmounted, type Ref } from 'vue';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap(target: Ref<HTMLElement | null>, isActive: Ref<boolean>): void {
	let previouslyFocused: HTMLElement | null = null;

	const getFocusable = (): HTMLElement[] => {
		if (!target.value) return [];
		return Array.from(target.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
	};

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Tab' || !target.value) return;
		const focusable = getFocusable();
		if (focusable.length === 0) {
			event.preventDefault();
			return;
		}
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement as HTMLElement | null;

		if (event.shiftKey && active === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	};

	const activate = () => {
		previouslyFocused = document.activeElement as HTMLElement | null;
		const focusable = getFocusable();
		if (focusable.length > 0) {
			focusable[0].focus();
		} else if (target.value) {
			target.value.tabIndex = -1;
			target.value.focus();
		}
		document.addEventListener('keydown', onKeydown);
	};

	const deactivate = () => {
		document.removeEventListener('keydown', onKeydown);
		if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
			previouslyFocused.focus();
		}
		previouslyFocused = null;
	};

	watch(
		isActive,
		(value) => {
			if (value) {
				// queueMicrotask: дождаться, пока target смонтируется в DOM
				queueMicrotask(activate);
			} else {
				deactivate();
			}
		},
		{ immediate: true },
	);

	onUnmounted(deactivate);
}
