// [Собес: TypeScript → unknown + zod.parse на границе API (рантайм-валидация)]

import { z } from 'zod';

const CurrencySchema = z.enum(['RUB', 'USD', 'EUR', 'GBP', 'CNY']);

const UserSettingsSchema = z.object({
	theme: z.enum(['light', 'dark']),
	locale: z.enum(['ru', 'en']),
	notifications: z.boolean(),
});

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string(),
	baseCurrency: CurrencySchema,
	settings: UserSettingsSchema,
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const AuthResponseSchema = z.object({
	user: UserSchema,
	accessToken: z.string(),
});

export const RefreshResponseSchema = z.object({
	accessToken: z.string(),
});

export const MeResponseSchema = z.object({
	user: UserSchema,
});
