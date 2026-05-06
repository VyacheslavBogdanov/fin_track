# shared/directives — кастомные Vue-директивы

## Роль

Реиспользуемые DOM-расширения, оформленные как Vue 3 directives. Регистрируются глобально через `app.directive(name, def)` в `app/index.ts` или локально через импорт в компоненте.

## Конвенции именования

-   Имя — `camelCase` без префикса `v-` (он добавляется при использовании в шаблоне): директива `vClickOutside` → `v-click-outside` в шаблоне.
-   Файл — один на директиву.

## Что запрещено

-   Бизнес-логика внутри директивы (директивы — про DOM, не про домен).
-   Прямой DOM-mутации без cleanup в `unmounted`-хуке (см. антипаттерн «утечка в подписках» в ТЗ §12.5).

## Что здесь будет жить (FinTrack)

-   Phase 1.7: `vClickOutside` (парный к `useClickOutside`).
-   Phase 2.4: `vLazyImg` (lazy-loading через IntersectionObserver).
-   `vFocus` — auto-focus при `mounted`, при необходимости.

> Конвенции — `src/docs/coding-conventions.md` §8.
