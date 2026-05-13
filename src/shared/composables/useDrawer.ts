// [Собес: Vue → composables — выделение переиспользуемой UI-логики]
// [Собес: a11y → focus trap + ESC closes overlay + breakpoint-aware behaviour]

import { computed, ref, watch, type Ref } from 'vue';
import { useBreakpoints, useEventListener } from '@vueuse/core';
import { useFocusTrap } from './useFocusTrap';

export function useDrawer(open: Ref<boolean>, desktopMin = 1025) {
	const breakpoints = useBreakpoints({ desktop: desktopMin });
	const isDesktop = breakpoints.greaterOrEqual('desktop');
	const drawerRef = ref<HTMLElement | null>(null);
	const trapActive = computed(() => !isDesktop.value && open.value);

	useFocusTrap(drawerRef, trapActive);

	useEventListener(window, 'keydown', (event: KeyboardEvent) => {
		if (event.key === 'Escape' && open.value && !isDesktop.value) {
			open.value = false;
		}
	});

	watch(isDesktop, (desktop) => {
		if (desktop) open.value = false;
	});

	return { drawerRef, isDesktop };
}
