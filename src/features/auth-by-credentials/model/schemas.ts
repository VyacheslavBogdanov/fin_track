import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().min(1, 'Введите email').email('Некорректный email'),
	password: z.string().min(8, 'Минимум 8 символов'),
});

export const registerSchema = loginSchema.extend({
	name: z.string().min(2, 'Минимум 2 символа').max(60, 'Максимум 60 символов'),
});

export type LoginFormInput = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.infer<typeof registerSchema>;
