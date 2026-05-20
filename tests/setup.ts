import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/shared/api/mocks/server';
import { resetMockState, resetMockTransactions, resetMockCategories } from '@/shared/api/mocks';
import { resetAuthBridge } from '@/shared/api';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
	server.resetHandlers();
	resetMockState();
	resetMockTransactions();
	resetMockCategories();
	resetAuthBridge();
});

afterAll(() => server.close());
