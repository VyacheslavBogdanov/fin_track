import '@/app/styles/index.scss';
import { createApp } from 'vue';
import App from '@/App.vue';
import { pinia } from '@/app/providers/pinia';
import { router } from '@/app/providers/router';
import { installAuthBridge } from '@/app/providers/authBridge';
import { useUserStore } from '@/entities/user';

async function bootstrap(): Promise<void> {
	if (import.meta.env.DEV) {
		const { worker } = await import('@/shared/api/mocks/browser');
		await worker.start({ onUnhandledRequest: 'bypass' });
	}

	const app = createApp(App);
	app.use(pinia);
	installAuthBridge();

	// Блокирующий restore выполняется ДО app.use(router) — иначе initial navigation
	// запускается прямо в момент use(router) и authGuard стреляет на пустом store
	// (isAuthenticated=false → редирект на /auth, который уже не пересчитается
	// при последующем наполнении state).
	await useUserStore().initSession();

	app.use(router);
	// router.isReady() резолвится после первой навигации с учётом всех guard'ов.
	// Без этого ожидания mount происходит до resolve, и DefaultLayout кратко
	// рендерится с пустым route.meta (видна шапка/сайдбар, как на /dashboard)
	// до того, как guard завершит переход на /auth.
	await router.isReady();
	app.mount('#app');
}

void bootstrap();
