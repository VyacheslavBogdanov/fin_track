# shared/composables — generic composables

## Роль

Vue 3 composables, не привязанные к домену FinTrack. Возвращают объект с `Ref`-полями (например, `{ data, error, loading, refetch }`), а не голый ref.

## Конвенции именования

-   Имя начинается с `use`: `useDebounce`, `useFetch`, `useLocalStorage`.
-   Файл — один composable, имя файла = имя функции (`useDebounce.ts`).

## Что запрещено

-   Импорт `entities/*` или доменных типов — это делает composable несовместимым с переиспользованием.
-   Mixins (запрещены в проекте — см. conventions §8.10).

## Что здесь будет жить (FinTrack)

-   Phase 1.7: `useDebounce`, `useFetch` (с AbortController + retry), `useLocalStorage`, `useClickOutside`, `useIntersectionObserver`.
-   Доменные composables (`useAuth`, `useCurrency`, `useBudget`) — в соответствующих `entities/*/model` или `features/*/model`, не здесь.

> Конвенции — `src/docs/coding-conventions.md` §6.3, §8.10. Примеры — `src/docs/ТЗ_Finance_App.md` §8.
