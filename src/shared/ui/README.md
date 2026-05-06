# shared/ui — UI-kit

## Роль

Атомарные презентационные компоненты без бизнес-знаний. Принимают данные через `props`, отдают события через `emits`, не знают о Pinia stores.

## Конвенции именования

-   Все компоненты с префиксом `App`: `AppButton`, `AppInput`, `AppModal`, `AppTabs`, `AppCard`, `AppSpinner`, `AppToast`.
-   Исключение — общеупотребимые контейнеры без префикса: `InfiniteScroll`, `VirtualScroll`.
-   Папки: `<ComponentName>/`, главный файл — `<ComponentName>.vue`.

## Что запрещено

-   Импорт Pinia stores или доменных сущностей (`entities/*`) — это утечка домена в shared.
-   Бизнес-валидация (например, «сумма транзакции должна быть > 0»). Только generic-валидация (required, format).

## Что здесь будет жить (FinTrack)

-   Phase 1.1: `AppButton`, `AppInput`, `AppModal`, `AppTabs` (+ `AppTab`), `AppCard`, `AppSpinner`.
-   Phase 2.4: `AppToast` (TransitionGroup), `InfiniteScroll`, `VirtualScroll`, `InputMoney`.

> Примеры реализации — `src/docs/ТЗ_Finance_App.md` §9. Конвенции — `src/docs/coding-conventions.md` §6.3.
