// [Собес: JS → Что такое замыкание? (модульные bridge / pendingRefresh живут в замыкании модуля)]
// [Собес: JS → Promise — single-flight refresh (N параллельных 401 → один refresh)]
// [Собес: Browser → Cookie HttpOnly (refresh-cookie уезжает через credentials: 'include')]

export interface AuthBridge {
	getAccessToken(): string | null;
	setAccessToken(token: string | null): void;
	refresh(): Promise<string>;
	onAuthFailure(): void;
}

let bridge: AuthBridge | null = null;

let pendingRefresh: Promise<string> | null = null;

export function setAuthBridge(b: AuthBridge): void {
	bridge = b;
}

export function getAuthBridge(): AuthBridge | null {
	return bridge;
}

export function resetAuthBridge(): void {
	bridge = null;
	pendingRefresh = null;
}

export function refreshAccessToken(): Promise<string> {
	if (!bridge) {
		return Promise.reject(new Error('Auth bridge not installed'));
	}
	if (!pendingRefresh) {
		pendingRefresh = bridge.refresh().finally(() => {
			pendingRefresh = null;
		});
	}
	return pendingRefresh;
}
