# entities — слой доменных моделей

## Роль

Доменные сущности: TypeScript-типы, Pinia stores, API-методы (запросы и парсинг ответов), презентационные компоненты сущности. Сердце бизнес-домена FinTrack.

## Что разрешено импортировать

Только из `shared`.

## Что запрещено

-   Импорт из любых вышестоящих слоёв (`features`, `widgets`, `pages`, `app`).
-   **Cross-import между entity** (`entities/transaction` → `entities/budget`). Если связь нужна — через общий `shared/types/` или композицию в feature/widget.
-   Импорт во внутренности слайса извне. Только через `index.ts`.

## Структура слайса

```
entities/<entity>/
    model/      # types, store
    api/        # запросы, парсинг
    ui/         # презентация (опционально)
    index.ts    # public API
```

## Конвенции именования

-   Stores: `use<Entity>Store` (`useTransactionStore`, `useBudgetStore`).
-   Папки слайсов: `kebab-case` (`transaction/`, `budget/`).

## Что здесь будет жить (FinTrack)

-   Phase 1.3: `user/` (тип `User`, `useUserStore`).
-   Phase 1.4: `transaction/` (тип `Transaction`, `useTransactionStore`, агрегаты `totalIncome`/`totalExpense`).
-   Phase 1.5: `category/` (плоский список).
-   Phase 2: `budget/`, `currency/`.
-   По плану ТЗ: `account/`.

> Полные правила FSD — `src/docs/ТЗ_Finance_App.md` §3, `src/docs/coding-conventions.md` §5.
