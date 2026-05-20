<script setup lang="ts">
// [Собес: Vue → onMounted (data fetch при mount)]
// [Собес: Vue → computed getter/setter (двусторонний биндинг editTarget ↔ AppModal)]
// [Собес: Vue → :key для пересоздания формы при смене редактируемой категории]
// [Собес: FSD → page-секция = композиция widgets + entities]

import { computed, onMounted, ref } from 'vue';
import { AppButton, AppModal } from '@/shared/ui';
import { useCategoryStore, type Category } from '@/entities/category';
import { CategoryList } from '@/widgets/CategoryList';
import CategoryForm from './CategoryForm.vue';

const categoryStore = useCategoryStore();

const isAddOpen = ref(false);
const editTarget = ref<Category | null>(null);

const isEditOpen = computed({
	get: () => editTarget.value !== null,
	set: (v) => {
		if (!v) editTarget.value = null;
	},
});

onMounted(() => {
	categoryStore.fetchAll().catch(() => {
		// error читается через categoryStore.error
	});
});
</script>

<template>
	<section class="cat-section">
		<header class="cat-section__header">
			<h2 class="cat-section__title">Категории</h2>
			<AppButton variant="primary" size="sm" @click="isAddOpen = true">Добавить</AppButton>
		</header>

		<p v-if="categoryStore.error" class="cat-section__error" role="alert">
			{{ categoryStore.error }}
		</p>

		<CategoryList :items="categoryStore.items">
			<template #actions="{ cat }">
				<div class="cat-section__row-actions">
					<AppButton variant="ghost" size="sm" @click="editTarget = cat">
						Изменить
					</AppButton>
					<AppButton variant="danger" size="sm" @click="categoryStore.remove(cat.id)">
						Удалить
					</AppButton>
				</div>
			</template>
		</CategoryList>

		<AppModal v-model="isAddOpen" title="Новая категория">
			<CategoryForm @success="isAddOpen = false" @cancel="isAddOpen = false" />
		</AppModal>

		<AppModal v-model="isEditOpen" title="Изменить категорию">
			<CategoryForm
				v-if="editTarget"
				:key="editTarget.id"
				:category="editTarget"
				@success="editTarget = null"
				@cancel="editTarget = null"
			/>
		</AppModal>
	</section>
</template>

<style lang="scss" scoped>
.cat-section {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&__title {
		margin: 0;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
	}

	&__error {
		margin: 0;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(220, 38, 38, 0.08);
		color: var(--color-danger);
	}

	&__row-actions {
		display: flex;
		gap: var(--space-1);
	}
}
</style>
