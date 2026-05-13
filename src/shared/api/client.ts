// [Собес: JS → Замыкание (interceptor читает bridge из модульной переменной)]
// [Собес: JS → async/await + try/catch (обработка 401 → refresh → retry)]
// [Собес: Browser → credentials: 'include' (cookie уезжает, JS до неё не дотягивается)]

import { API_BASE_URL } from '@/shared/config/api';
import { ApiHttpError, isApiError, type ApiError } from '@/shared/types/api';
import { getAuthBridge, refreshAccessToken } from './interceptors';

export interface ApiFetchInit extends Omit<RequestInit, 'body'> {
	body?: unknown;
	skipAuth?: boolean;
	skipRefresh?: boolean;
}

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<T> {
	const response = await sendRequest(path, init);

	if (response.status === 401 && !init.skipRefresh) {
		return retryAfterRefresh<T>(path, init);
	}

	return parseOrThrow<T>(response);
}

async function sendRequest(path: string, init: ApiFetchInit): Promise<Response> {
	const headers = buildHeaders(init);
	const body = prepareBody(init.body, headers);

	return fetch(API_BASE_URL + path, {
		...init,
		headers,
		body,
		credentials: 'include',
	});
}

function buildHeaders(init: ApiFetchInit): Headers {
	const headers = new Headers(init.headers ?? undefined);
	if (!init.skipAuth) {
		const token = getAuthBridge()?.getAccessToken() ?? null;
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
	}
	return headers;
}

function prepareBody(body: unknown, headers: Headers): BodyInit | undefined {
	if (body === undefined || body === null) return undefined;
	if (typeof body === 'string') return body;
	if (body instanceof FormData || body instanceof Blob || body instanceof URLSearchParams) {
		return body;
	}
	if (!headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json');
	}
	return JSON.stringify(body);
}

async function retryAfterRefresh<T>(path: string, init: ApiFetchInit): Promise<T> {
	const bridge = getAuthBridge();
	if (!bridge) {
		throw new ApiHttpError(401, null, 'Auth bridge not installed');
	}
	try {
		await refreshAccessToken();
	} catch (refreshError) {
		bridge.onAuthFailure();
		throw refreshError;
	}
	const response = await sendRequest(path, init);
	return parseOrThrow<T>(response);
}

async function parseOrThrow<T>(response: Response): Promise<T> {
	if (response.status === 204) {
		return undefined as T;
	}

	const text = await response.text();
	let parsed: unknown = null;
	if (text) {
		try {
			parsed = JSON.parse(text);
		} catch {
			parsed = text;
		}
	}

	if (!response.ok) {
		const body: ApiError | null = isApiError(parsed) ? parsed : null;
		throw new ApiHttpError(response.status, body);
	}

	return parsed as T;
}
