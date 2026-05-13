<script setup lang="ts">
// [Собес: Vue → provide/inject через AppTabs (children-driven регистрация табов)]
// [Собес: CSS → flex-центрирование + mobile-first карточка]
// [Собес: Vue Router → query parameter (?tab=register для прямой ссылки)]

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AppCard from '@/shared/ui/AppCard/AppCard.vue';
import AppTab from '@/shared/ui/AppTabs/AppTab.vue';
import AppTabs from '@/shared/ui/AppTabs/AppTabs.vue';
import { LoginForm, RegisterForm } from '@/features/auth-by-credentials';

const route = useRoute();
const initial = route.query.tab === 'register' ? 'register' : 'login';
const activeTab = ref<string>(initial);
</script>

<template>
	<section class="auth-page">
		<AppCard class="auth-page__card">
			<h1 class="auth-page__title">FinTrack</h1>
			<AppTabs v-model="activeTab">
				<AppTab id="login" label="Вход">
					<LoginForm />
				</AppTab>
				<AppTab id="register" label="Регистрация">
					<RegisterForm />
				</AppTab>
			</AppTabs>
		</AppCard>
	</section>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.auth-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: calc(100vh - var(--space-8));
	padding: var(--space-4);

	&__card {
		width: 100%;
		max-width: 420px;
	}

	&__title {
		margin: 0 0 var(--space-4);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-bold);
		text-align: center;
		color: var(--color-text-primary);
	}
}
</style>
