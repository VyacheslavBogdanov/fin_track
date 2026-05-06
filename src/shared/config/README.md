# shared/config — константы и env

## Роль

Конфигурация уровня приложения: API URL, таймауты, пороги, env-переменные. Без runtime-логики, только литералы и derived-константы.

## Конвенции именования

-   Константы: `UPPER_SNAKE_CASE` (`BUDGET_WARN_THRESHOLD`, `API_TIMEOUT_MS`).
-   Env-переменные: через `import.meta.env.VITE_*` (Vite-конвенция). Wrapper для безопасной валидации через `zod`.

## Что здесь будет жить (FinTrack)

-   `api.ts` — базовые URL, таймауты, retry-стратегия.
-   `budget.ts` — `BUDGET_WARN_THRESHOLD = 80` и подобные пороги.
-   `env.ts` — типизированный wrapper над `import.meta.env` с `zod`-валидацией.

## Что запрещено

-   Магические числа в коде вне `shared/config` (см. антипаттерн в ТЗ §12.5).
-   Динамическое чтение env вне `env.ts` — должен быть единый типизированный объект.

> Конвенции — `src/docs/coding-conventions.md` §11.4 (запрет magic values).
