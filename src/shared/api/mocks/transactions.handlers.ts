// [Собес: HTTP → REST CRUD endpoints (list / create / update / delete)]
// [Собес: Browser → Bearer-токен в Authorization header (vs HttpOnly cookie для refresh)]
// [Собес: JS → Map для in-memory state мока (изоляция per-user)]
//
// MSW-handlers для /api/transactions. Доменный код (entities/transaction/api)
// не знает про моки и не должен из них импортировать. Авторизация — через
// общий Bearer-helper из auth.handlers (one source of truth для access-токенов).

import { http, HttpResponse, type HttpHandler } from 'msw';
import { v4 as uuid } from 'uuid';
import { getUserIdByAccessToken, readBearer } from './auth.handlers';

interface MockTransaction {
	id: string;
	type: 'income' | 'expense' | 'transfer';
	amount: number;
	currency: 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY';
	categoryId: string;
	accountId: string;
	description: string;
	date: string;
	tags: string[];
	toAccountId?: string;
	createdAt: string;
	updatedAt: string;
}

const transactionsByUser = new Map<string, MockTransaction[]>();

function nowIso(): string {
	return new Date().toISOString();
}

function err(status: number, code: string, message: string) {
	return HttpResponse.json({ code, message }, { status });
}

function authorize(headers: Headers): string | null {
	const token = readBearer(headers);
	if (!token) return null;
	return getUserIdByAccessToken(token);
}

export function resetMockTransactions(): void {
	transactionsByUser.clear();
}

export const transactionHandlers: HttpHandler[] = [
	http.get('/api/transactions', ({ request }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		const items = transactionsByUser.get(userId) ?? [];
		return HttpResponse.json({ items });
	}),

	http.post('/api/transactions', async ({ request }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		let payload: unknown;
		try {
			payload = await request.json();
		} catch {
			return err(400, 'BAD_BODY', 'Invalid JSON');
		}
		const input = payload as Omit<MockTransaction, 'id' | 'createdAt' | 'updatedAt'>;
		const now = nowIso();
		const tx: MockTransaction = {
			...input,
			id: uuid(),
			createdAt: now,
			updatedAt: now,
		};
		const list = transactionsByUser.get(userId) ?? [];
		list.push(tx);
		transactionsByUser.set(userId, list);
		return HttpResponse.json(tx, { status: 201 });
	}),

	http.patch('/api/transactions/:id', async ({ request, params }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		let payload: unknown;
		try {
			payload = await request.json();
		} catch {
			return err(400, 'BAD_BODY', 'Invalid JSON');
		}
		const list = transactionsByUser.get(userId);
		const idx = list?.findIndex((t) => t.id === params['id']) ?? -1;
		if (!list || idx === -1) return err(404, 'NOT_FOUND', 'Transaction not found');
		const patch = payload as Partial<Omit<MockTransaction, 'id' | 'createdAt' | 'updatedAt'>>;
		list[idx] = {
			...list[idx],
			...patch,
			updatedAt: nowIso(),
		};
		return HttpResponse.json(list[idx]);
	}),

	http.delete('/api/transactions/:id', ({ request, params }) => {
		const userId = authorize(request.headers);
		if (!userId) return err(401, 'UNAUTHORIZED', 'Missing or invalid access token');
		const list = transactionsByUser.get(userId);
		const idx = list?.findIndex((t) => t.id === params['id']) ?? -1;
		if (!list || idx === -1) return err(404, 'NOT_FOUND', 'Transaction not found');
		list.splice(idx, 1);
		return new HttpResponse(null, { status: 204 });
	}),
];
