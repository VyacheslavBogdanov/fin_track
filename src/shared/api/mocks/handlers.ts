import type { HttpHandler } from 'msw';
import { authHandlers } from './auth.handlers';

export const handlers: HttpHandler[] = [...authHandlers];
