# widgets — составные UI-блоки

## Роль

Большие переиспользуемые блоки UI, которые могут содержать данные и состояние. Между атомарным `shared/ui` (тупые компоненты) и страницами (`pages`).

## Что разрешено импортировать

Из `features`, `entities`, `shared`.

## Что запрещено

-   Импорт из `pages`, `app`.
-   Cross-import между widgets (`widgets/Header` → `widgets/Sidebar`). Общая логика — в `features` или `shared`.

## Конвенции именования

-   Без `App`-префикса (он только для `shared/ui`).
-   Префикс по домену: `TransactionList`, `BudgetOverview`, `DashboardGrid`.
-   Общеупотребимые контейнеры (`InfiniteScroll`, `VirtualScroll`) — без префикса.

## Что здесь будет жить (FinTrack)

-   Phase 1.2: `Header/AppHeader.vue` (sticky, бургер на mobile), `Sidebar/AppSidebar.vue` (drawer на mobile, постоянный на desktop).
-   Phase 1.4: `TransactionList/TransactionList.vue`.
-   Phase 1.6: `BalanceCard/`, `ExpenseSummary/`, `RecentTransactions/`, `DashboardGrid/`.
-   Phase 2: `BudgetOverview/`, `BudgetCard/`, `BudgetBar/`.

> Полные правила FSD — `src/docs/ТЗ_Finance_App.md` §3, `src/docs/coding-conventions.md` §5.
