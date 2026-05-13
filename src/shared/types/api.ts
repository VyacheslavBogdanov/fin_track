// [Собес: TypeScript → unknown vs any (граница API)]
// [Собес: TypeScript → классы как тип + значение (instanceof guard)]

export interface ApiError {
	code: string;
	message: string;
	fields?: Record<string, string>;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export class ApiHttpError extends Error {
	readonly status: number;
	readonly body: ApiError | null;

	constructor(status: number, body: ApiError | null, message?: string) {
		super(message ?? body?.message ?? `HTTP ${status}`);
		this.name = 'ApiHttpError';
		this.status = status;
		this.body = body;
	}
}

export function isApiError(value: unknown): value is ApiError {
	return (
		typeof value === 'object' &&
		value !== null &&
		'message' in value &&
		typeof (value as { message: unknown }).message === 'string'
	);
}
