// [Собес: Vue → composables vs mixins (переиспользование логики форм)]
// [Собес: TypeScript → дженерики (constraint ZodType)]
// [Собес: Vue → reactive vs ref (reactive для объекта-формы, ref для скалярных флагов)]

import { reactive, ref, type Ref } from 'vue';
import type { ZodType } from 'zod';
import { ApiHttpError } from '@/shared/api';

export interface UseZodFormReturn<I extends object> {
	values: I;
	errors: Partial<Record<keyof I & string, string>>;
	isSubmitting: Ref<boolean>;
	serverError: Ref<string | null>;
	validate(): boolean;
	handleSubmit(onValid: (values: I) => Promise<void>): (event?: Event) => Promise<void>;
	reset(): void;
	setServerError(message: string | null): void;
}

export function useZodForm<I extends object>(schema: ZodType<I>, initial: I): UseZodFormReturn<I> {
	const values = reactive({ ...initial }) as I;
	const errors = reactive({}) as Partial<Record<keyof I & string, string>>;
	const isSubmitting = ref(false);
	const serverError = ref<string | null>(null);

	function clearErrors(): void {
		for (const key of Object.keys(errors)) {
			delete (errors as Record<string, string>)[key];
		}
	}

	function validate(): boolean {
		const result = schema.safeParse(values);
		clearErrors();
		if (result.success) return true;
		for (const issue of result.error.issues) {
			const path = issue.path[0];
			if (typeof path === 'string' && !(path in errors)) {
				(errors as Record<string, string>)[path] = issue.message;
			}
		}
		return false;
	}

	function handleSubmit(onValid: (input: I) => Promise<void>) {
		return async (event?: Event) => {
			event?.preventDefault();
			serverError.value = null;
			if (!validate()) return;
			isSubmitting.value = true;
			try {
				await onValid(values);
			} catch (e) {
				serverError.value = extractMessage(e);
			} finally {
				isSubmitting.value = false;
			}
		};
	}

	function reset(): void {
		Object.assign(values, initial);
		clearErrors();
		serverError.value = null;
		isSubmitting.value = false;
	}

	function setServerError(message: string | null): void {
		serverError.value = message;
	}

	return {
		values,
		errors,
		isSubmitting,
		serverError,
		validate,
		handleSubmit,
		reset,
		setServerError,
	};
}

function extractMessage(e: unknown): string {
	if (e instanceof ApiHttpError) return e.message;
	if (e instanceof Error) return e.message;
	return 'Произошла ошибка';
}
