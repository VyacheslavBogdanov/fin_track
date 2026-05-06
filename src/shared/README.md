# shared — базовый слой

## Роль

Переиспользуемая инфраструктура без бизнес-знаний: UI-kit, composables, утилиты, HTTP-клиент, конфиги, глобальные типы, директивы. Самый нижний слой FSD.

## Что разрешено импортировать

**Ничего из вышестоящих слоёв.** Внутри `shared` подкаталоги могут импортировать друг друга при необходимости (например, `shared/ui` может использовать `shared/composables`).

## Что запрещено

-   Любой импорт из `entities`, `features`, `widgets`, `pages`, `app`.
-   Бизнес-логика, доменные термины (`Transaction`, `Budget`) — это в `entities`. В `shared` — только generic-сущности (`ApiError`, `AsyncState<T>`, `Paginated<T>`).

## Подкаталоги

| Папка          | Что                                     |
| -------------- | --------------------------------------- |
| `ui/`          | UI-kit с префиксом `App` (атомарные)    |
| `composables/` | `use<Name>` — generic Vue 3 composables |
| `lib/`         | Чистые утилиты-функции                  |
| `api/`         | HTTP-клиент, interceptors, базовые типы |
| `config/`      | Константы, env-переменные               |
| `types/`       | Глобальные TS-типы                      |
| `directives/`  | Кастомные Vue-директивы                 |

> Полные правила FSD — `src/docs/ТЗ_Finance_App.md` §3, `src/docs/coding-conventions.md` §5.
