# app — слой инициализации

## Роль

Точка входа приложения: создание Vue-инстанса, провайдеры (Pinia, Router, плагины), глобальные стили, регистрация плагинов. Самый верхний слой FSD.

## Что разрешено импортировать

Из всех нижестоящих слоёв: `pages`, `widgets`, `features`, `entities`, `shared`.

## Что запрещено

-   Бизнес-логика — только инициализация и композиция.
-   Непрямой импорт страниц минуя router (страницы подключаются через lazy-import в `providers/router.ts`).

## Что здесь будет жить (FinTrack)

-   `index.ts` — `createApp(App).use(pinia).use(router).mount('#app')` (Phase 0.5–0.6).
-   `providers/` — `pinia.ts`, `router.ts`, плагины (Phase 0.4–0.5).
-   `styles/` — `_variables.scss`, `_breakpoints.scss`, `_mixins.scss`, `_reset.scss`, `index.scss` (Phase 0.3).
-   `plugins/` — будущие Vue-плагины (toast, analytics).

> Полные правила FSD — `src/docs/ТЗ_Finance_App.md` §3, `src/docs/coding-conventions.md` §5.
