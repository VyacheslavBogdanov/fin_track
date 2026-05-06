# shared/api — HTTP-инфраструктура

## Роль

HTTP-клиент, interceptors, базовые типы запросов/ответов. Доменные API-методы (например, `transactionsApi.list`) живут в `entities/<entity>/api`, не здесь.

## Что здесь будет жить (FinTrack)

-   `client.ts` (Phase 1.3) — обёртка над `fetch`: добавление `Authorization` из памяти, AbortController, retry.
-   `interceptors.ts` — auto-refresh при 401, обработка сетевых ошибок.
-   `types.ts` — `ApiError`, `Paginated<T>`, общий формат ответов.

## Что запрещено

-   Импорт из `entities/*` (доменных сущностей не должно быть в shared).
-   Хардкод URL — все базовые URL и таймауты в `shared/config/`.
-   `any` для тела ответа — использовать `unknown` + `zod.parse()` (см. conventions §7.3).

> Конвенции — `src/docs/coding-conventions.md` §7 (TypeScript), §15 (безопасность). Спецификация API — `src/docs/ТЗ_Finance_App.md` §6.5.
