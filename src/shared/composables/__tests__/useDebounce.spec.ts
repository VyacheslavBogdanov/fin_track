import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('возвращает исходное значение синхронно', () => {
		const scope = effectScope();
		const debounced = scope.run(() => useDebounce(ref('a'), 100))!;
		expect(debounced.value).toBe('a');
		scope.stop();
	});

	it('задерживает обновление значения на delay ms', async () => {
		const source = ref('a');
		const scope = effectScope();
		const debounced = scope.run(() => useDebounce(source, 100))!;

		source.value = 'b';
		await nextTick();
		expect(debounced.value).toBe('a');

		vi.advanceTimersByTime(99);
		expect(debounced.value).toBe('a');

		vi.advanceTimersByTime(1);
		expect(debounced.value).toBe('b');
		scope.stop();
	});

	it('сбрасывает таймер при повторных изменениях (применяется только последнее значение)', async () => {
		const source = ref('a');
		const scope = effectScope();
		const debounced = scope.run(() => useDebounce(source, 100))!;

		source.value = 'b';
		await nextTick();
		vi.advanceTimersByTime(50);

		source.value = 'c';
		await nextTick();
		vi.advanceTimersByTime(50);
		expect(debounced.value).toBe('a');

		vi.advanceTimersByTime(50);
		expect(debounced.value).toBe('c');
		scope.stop();
	});
});
