// [Собес: TypeScript → interface vs type alias]
// [Собес: TypeScript → literal union types (theme, locale)]

import type { BaseEntity } from '@/shared/types/entity';
import type { Currency } from '@/shared/types/currency';

export interface UserSettings {
	theme: 'light' | 'dark';
	locale: 'ru' | 'en';
	notifications: boolean;
}

export interface User extends BaseEntity {
	email: string;
	name: string;
	baseCurrency: Currency;
	settings: UserSettings;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface RegisterInput {
	email: string;
	password: string;
	name: string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
}

export interface RefreshResponse {
	accessToken: string;
}
