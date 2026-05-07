# pages — слой страниц

## Роль

Страницы приложения: контейнеры, которые композят `widgets` и `features`, привязаны к роутам Vue Router. Lazy-loaded через `() => import('@/pages/...')` для code splitting.

## Что разрешено импортировать

Из `widgets`, `features`, `entities`, `shared`.

## Что запрещено

-   Импорт из `app` (вышестоящий слой).
-   Cross-import между страницами (`pages/Foo` → `pages/Bar`). Общие части — выносить в `widgets/` или `shared/`.

## Конвенции именования

-   Папки: `<DomainName>Page/` (`DashboardPage/`, `TransactionsPage/`).
-   Главный файл компонента: `<DomainName>Page.vue`.

## Что здесь будет жить (FinTrack)

-   Phase 1.3: `AuthPage/` — табы login/register.
-   Phase 1.4: `TransactionsPage/` — список + фильтры.
-   Phase 1.6: `DashboardPage/` — обзор финансов.
-   Phase 2: `BudgetPage/`, `ReportsPage/`, `SettingsPage/`, `NotFoundPage/`.

> Полные правила FSD — `src/docs/ТЗ_Finance_App.md` §3, `src/docs/coding-conventions.md` §5.
