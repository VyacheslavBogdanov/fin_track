import type { HttpHandler } from 'msw';
import { authHandlers } from './auth.handlers';
import { transactionHandlers } from './transactions.handlers';

export const handlers: HttpHandler[] = [...authHandlers, ...transactionHandlers];
