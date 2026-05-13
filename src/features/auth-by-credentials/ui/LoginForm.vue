<script setup lang="ts">
// [Собес: Vue → defineModel / v-model на компоненте (AppInput)]
// [Собес: Vue → defineEmits (типизированный emit)]

import AppButton from '@/shared/ui/AppButton/AppButton.vue';
import AppInput from '@/shared/ui/AppInput/AppInput.vue';
import { useZodForm } from '../model/useZodForm';
import { loginSchema, type LoginFormInput } from '../model/schemas';
import { useAuth } from '../model/useAuth';

const emit = defineEmits<{ success: [] }>();

const { login } = useAuth();
const { values, errors, isSubmitting, serverError, handleSubmit } = useZodForm<LoginFormInput>(
	loginSchema,
	{ email: '', password: '' },
);

const submit = handleSubmit(async (input) => {
	await login(input);
	emit('success');
});
</script>

<template>
	<form class="login-form" novalidate @submit="submit">
		<p v-if="serverError" class="login-form__server-error" role="alert">
			{{ serverError }}
		</p>
		<AppInput
			v-model="values.email"
			type="email"
			label="Email"
			autocomplete="email"
			:error="errors.email"
		/>
		<AppInput
			v-model="values.password"
			type="password"
			label="Пароль"
			autocomplete="current-password"
			:error="errors.password"
		/>
		<AppButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
			Войти
		</AppButton>
	</form>
</template>

<style lang="scss" scoped>
.login-form {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);

	&__server-error {
		margin: 0;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(220, 38, 38, 0.08);
		color: var(--color-danger);
		font-size: var(--font-size-sm);
	}
}
</style>
