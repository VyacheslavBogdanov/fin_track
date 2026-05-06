# shared/lib — утилиты-функции

## Роль

Чистые функции (без побочных эффектов и реактивности). Возвращают значения, не Refs. Полностью покрываются unit-тестами.

## Конвенции именования

-   `camelCase`, имя — глагол-действие: `formatMoney`, `groupBy`, `deepClone`, `debounce`, `throttle`, `fetchWithRetry`.
-   Один файл = одна функция (или тесно связанное семейство).

## Что запрещено

-   Зависимости от Vue (`ref`, `reactive`, `computed`) — для реактивных оболочек есть `shared/composables`.
-   Доменные термины (`Transaction`, `Budget`) — функция должна быть generic.

## Что здесь будет жить (FinTrack)

-   Phase 1.7: `formatMoney`, `groupBy`, `deepClone` + тесты.
-   По мере появления нужд: `parseDate`, `clamp`, `pickBy`, `omit`.

> Конвенции — `src/docs/coding-conventions.md` §6.3. Coverage MVP ≥ 60% (cross-cutting C.3 в `implementation-plan.md`).
