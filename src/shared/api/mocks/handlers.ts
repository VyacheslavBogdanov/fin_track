import type { HttpHandler } from 'msw';
import { authHandlers } from './auth.handlers';
import { transactionHandlers } from './transactions.handlers';
import { categoryHandlers } from './categories.handlers';

export const handlers: HttpHandler[] = [
	...authHandlers,
	...transactionHandlers,
	...categoryHandlers,
];
