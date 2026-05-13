// [Собес: JS → замыкание (bridge захватывает функции store в момент install)]
//
// Мост между HTTP-клиентом (shared/api) и Pinia-стором (entities/user).
// Нужен, потому что shared/api не имеет права импортировать entities/user (FSD).
// Вызывается строго после `app.use(pinia)` — иначе useUserStore() упадёт.

import { setAuthBridge } from '@/shared/api';
import { useUserStore } from '@/entities/user';

export function installAuthBridge(): void {
	const store = useUserStore();
	setAuthBridge({
		getAccessToken: () => store.accessToken,
		setAccessToken: (token) => {
			store.accessToken = token;
		},
		refresh: () => store.refreshSession(),
		onAuthFailure: () => store.clearSession(),
	});
}
