<script setup lang="ts">
import AppButton from '@/shared/ui/AppButton/AppButton.vue';
import AppInput from '@/shared/ui/AppInput/AppInput.vue';
import { useZodForm } from '../model/useZodForm';
import { registerSchema, type RegisterFormInput } from '../model/schemas';
import { useAuth } from '../model/useAuth';

const emit = defineEmits<{ success: [] }>();

const { register } = useAuth();
const { values, errors, isSubmitting, serverError, handleSubmit } = useZodForm<RegisterFormInput>(
	registerSchema,
	{ email: '', password: '', name: '' },
);

const submit = handleSubmit(async (input) => {
	await register(input);
	emit('success');
});
</script>

<template>
	<form class="register-form" novalidate @submit="submit">
		<p v-if="serverError" class="register-form__server-error" role="alert">
			{{ serverError }}
		</p>
		<AppInput
			v-model="values.name"
			type="text"
			label="Имя"
			autocomplete="name"
			:error="errors.name"
		/>
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
			autocomplete="new-password"
			hint="Минимум 8 символов"
			:error="errors.password"
		/>
		<AppButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
			Зарегистрироваться
		</AppButton>
	</form>
</template>

<style lang="scss" scoped>
.register-form {
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
