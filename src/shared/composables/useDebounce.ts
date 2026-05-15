// [Собес: JS → замыкание (timeoutId захвачен в замыкание watcher'а)]
// [Собес: JS → setTimeout / clearTimeout (отмена pending-вызова при новом значении)]
// [Собес: Vue → watch + ref (реактивная синхронизация source → debounced)]
// [Собес: Vue → onScopeDispose (очистка таймера при unmount)]

import { onScopeDispose, ref, watch, type Ref } from 'vue';

export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
	const debounced = ref(source.value) as Ref<T>;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	watch(source, (newValue) => {
		if (timeoutId !== null) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			debounced.value = newValue;
			timeoutId = null;
		}, delay);
	});

	onScopeDispose(() => {
		if (timeoutId !== null) clearTimeout(timeoutId);
	});

	return debounced;
}
