<script setup lang="ts">
// [Собес: Vue → defineProps c optional prop (category?: Category — режим add/edit от одного компонента)]
// [Собес: Vue → defineModel + v-model на компоненте (AppInput)]
// [Собес: Vue → defineEmits (типизированные success/cancel)]

import { AppButton, AppInput } from '@/shared/ui';
import { useZodForm } from '@/shared/composables/useZodForm';
import {
	useCategoryStore,
	categoryFormSchema,
	type Category,
	type CategoryFormInput,
} from '@/entities/category';

const props = defineProps<{ category?: Category }>();
const emit = defineEmits<{ success: []; cancel: [] }>();

const categoryStore = useCategoryStore();
const isEdit = !!props.category;

const { values, errors, isSubmitting, serverError, handleSubmit } = useZodForm<CategoryFormInput>(
	categoryFormSchema,
	{
		name: props.category?.name ?? '',
		type: props.category?.type ?? 'expense',
		icon: props.category?.icon ?? '',
		color: props.category?.color ?? '#10b981',
		parentId: props.category?.parentId ?? null,
	},
);

const submit = handleSubmit(async (input) => {
	if (props.category) {
		await categoryStore.update(props.category.id, input);
	} else {
		await categoryStore.add(input);
	}
	emit('success');
});
</script>

<template>
	<form class="cat-form" novalidate @submit="submit">
		<p v-if="serverError" class="cat-form__server-error" role="alert">
			{{ serverError }}
		</p>

		<AppInput v-model="values.name" label="Название" :error="errors.name" />

		<label class="cat-form__field">
			<span class="cat-form__label">Тип</span>
			<select v-model="values.type" class="cat-form__select">
				<option value="expense">Расход</option>
				<option value="income">Доход</option>
			</select>
		</label>

		<AppInput
			v-model="values.icon"
			label="Иконка (текст / эмодзи, до 4 символов)"
			:error="errors.icon"
		/>

		<label class="cat-form__field">
			<span class="cat-form__label">Цвет</span>
			<input v-model="values.color" type="color" class="cat-form__color" />
			<span v-if="errors.color" class="cat-form__error">{{ errors.color }}</span>
		</label>

		<div class="cat-form__actions">
			<AppButton
				type="button"
				variant="ghost"
				:disabled="isSubmitting"
				@click="emit('cancel')"
			>
				Отмена
			</AppButton>
			<AppButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
				{{ isEdit ? 'Сохранить' : 'Добавить' }}
			</AppButton>
		</div>
	</form>
</template>

<style lang="scss" scoped>
.cat-form {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);

	&__server-error {
		margin: 0;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(220, 38, 38, 0.08);
		color: var(--color-danger);
	}

	&__field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	&__label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	&__select,
	&__color {
		min-height: var(--touch-target-min);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--bg-primary);
		color: var(--color-text-primary);
	}

	&__color {
		padding: var(--space-1);
		max-width: 64px;
	}

	&__error {
		font-size: var(--font-size-sm);
		color: var(--color-danger);
	}

	&__actions {
		display: flex;
		gap: var(--space-2);
		justify-content: flex-end;
	}
}
</style>
