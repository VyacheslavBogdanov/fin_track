# shared/types — глобальные TypeScript-типы

## Роль

Типы, не привязанные к конкретному домену: utility-типы, дискриминированные юнионы для API/UI-состояний, базовые контракты.

## Что здесь будет жить (FinTrack)

-   `AsyncState<T>` — discriminated union `{ status: 'idle' | 'loading' | 'success' | 'error'; ... }` (см. conventions §7.4).
-   `ApiError` — общий тип ошибки API.
-   `Nullable<T>`, `DeepPartial<T>`, `ValueOf<T>` и подобные generic-утилиты.

## Что запрещено

-   Доменные типы (`Transaction`, `Budget`) — они в `entities/<entity>/model/types.ts`, не здесь.
-   Runtime-код — только типы (`type`, `interface`).

> Конвенции — `src/docs/coding-conventions.md` §7.
