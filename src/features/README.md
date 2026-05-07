# features — слой бизнес-действий

## Роль

Use cases: атомарные пользовательские действия, изменяющие состояние через `entities`. Каждая фича — отдельный слайс с собственными `model/`, `ui/`, `api/`, `index.ts`.

## Что разрешено импортировать

Из `entities` и `shared`.

## Что запрещено

-   Импорт из `widgets`, `pages`, `app` (вышестоящие).
-   **Cross-import между фичами** (`features/add-transaction` → `features/edit-transaction`). Общая логика — в `entities` или `shared`.
-   Импорт во внутренности слайса извне (`features/add-transaction/model/foo.ts` извне). Только через `index.ts` (public API).

## Структура слайса

```
features/<feature>/
    model/      # composables, локальная state-логика
    ui/         # компоненты фичи
    api/        # запросы (если нужны)
    index.ts    # public API
```

## Конвенции именования

-   Папки: `kebab-case` (`add-transaction/`, `set-budget/`).
-   Composables внутри: `use<Name>`.

## Что здесь будет жить (FinTrack)

-   Phase 1.3: `auth-by-credentials/` — login/register формы + `useAuth`.
-   Phase 1.4: `add-transaction/`, `edit-transaction/`, `filter-transactions/`.
-   Phase 2: `set-budget/`, `currency-convert/`.
-   Phase 3: `import-csv/`, `export-report/`.

> Полные правила FSD — `src/docs/ТЗ_Finance_App.md` §3, `src/docs/coding-conventions.md` §5.
