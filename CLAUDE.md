# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды

```bash
npm run dev          # Запуск Vite dev-сервера
npm run build        # Параллельно: type-check + vite build (через npm-run-all2)
npm run build-only   # Сборка Vite без type-check (используется внутри build)
npm run type-check   # vue-tsc --build --force
npm run lint         # eslint . --fix
npm run format       # prettier --write src/
npm run preview      # Превью собранного бандла
```

Тест-раннер не подключён (нет конфига Vitest/Jest, нет скрипта `test`).

## Архитектура

Этот репозиторий — **стартовый шаблон Vue 3 + Vite + TypeScript**, который сейчас используется как рабочее пространство для материалов по подготовке к собеседованиям. Runtime-приложение намеренно минимальное (`src/main.ts` монтирует `src/App.vue`, который рендерит заглушку); основная содержательная часть репозитория лежит в `src/docs/` в виде объёмных Markdown-документов:

-   `src/docs/ТЗ_Finance_App.md` — большое (~3700 строк, v2) техническое задание на приложение «FinTrack». Описывает _целевую_ архитектуру (FSD-структура внутри `src/`, Pinia, Vue Router 4, SCSS+BEM, Vitest, vite-plugin-pwa и т. д.) — ничего из этого в коде ещё не реализовано. ТЗ — источник истины при проектировании новых фич; не считайте, что что-то из него уже существует в коде.
-   `src/docs/coding-conventions.md` — короткие правила «как писать код» (FSD, лимит ≤ 200 строк, якоря `[Собес: ...]`, адаптивность mobile-first, TS/Vue/Pinia/CSS/тесты). Ссылается на ТЗ для подробностей; конкретные числа форматирования живут в `.prettierrc.json`.
-   `src/docs/implementation-plan.md` — executable-чеклист имплементации (205 чекбоксов, 5 фаз: `Phase 0` Setup → `Phase 1` MVP → `Phase 2` Расширение → `Phase 3` Production-ready → `Phase 4+` after-MVP). Используйте его как «что делать дальше».
-   `src/docs/100_вопросов_frontend_собеседований.md` — банк тем для frontend-собесов. Источник тем для якорей `[Собес: ...]` в коде (см. ТЗ §1.5).

Когда пользователь просит «реализовать X из ТЗ» или подобное — сначала прочитайте соответствующий раздел `ТЗ_Finance_App.md`: ТЗ уже фиксирует структуру файлов (FSD: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`), модели данных, форму сторов и роуты. Затем сверьтесь с `implementation-plan.md` — на какой фазе мы и что именно из этой фичи входит в текущий пункт.

### Базовые правила, применяемые всегда

Эти правила не нужно явно цитировать в каждом задании — они держатся по умолчанию:

-   **Якоря `[Собес: ...]`** в нетривиальных файлах и блоках. Формат `// [Собес: <раздел> → <короткая формулировка>]`. Источник тем — `100_вопросов_…md`. Полное руководство — ТЗ §1.5 и conventions §4.
-   **Лимит ≤ 200 строк** на файл `.vue` / `.ts` / `.scss` в `src/`. При превышении — декомпозиция (см. conventions §3.3 и ТЗ §12.5 «God Component»). Документация (`*.md`) под лимит не подпадает.
-   **Адаптивность mobile-first** 320–1920+ px; брейкпоинты `mobile (≤ 480)` / `tablet (481–1024)` / `desktop (≥ 1025)` / `wide (≥ 1440)`; минимальные touch-targets 44 × 44 px; `ResizeObserver` вместо `window.resize`. Подробности — conventions §11.5, ТЗ §10 «Адаптивность».
-   **Никакого `any`** — `unknown` + type guard / `zod` на границе API (conventions §7.3).
-   **FSD-границы**: импорты только из нижестоящих слоёв; cross-import между слайсами одного слоя запрещён; публичный API слайса — только через `index.ts` (ТЗ §3, conventions §5).

### Неочевидные особенности сборки и тулинга

-   **Алиас `@` → `/src`** (настроен в `vite.config.ts` и `tsconfig.app.json`). Когда `src/` начнёт расти — импортируйте через `@/...`, а не относительными путями.
-   **Dev-прокси API:** `vite.config.ts` проксирует `/api/*` на `http://81.94.156.176:5011` и срезает префикс `/api`. Фронт должен ходить на `/api/...` — префикс удаляется до отправки на upstream.
-   **Project references в TypeScript:** `tsconfig.json` — solution-файл, ссылающийся на `tsconfig.app.json` (код приложения) и `tsconfig.node.json` (Vite/тулинг). В `tsconfig.app.json` в `include` указан `server.js`, но такого файла в репозитории нет — не удаляйте запись, если только не добавляете сам сервер.
-   **Express/cors/uuid/nodemon в `dependencies`**, хотя Node-сервера нет. Похоже, заложены под будущий встроенный API-сервер (вероятно, тот самый `server.js`). Не удаляйте без подтверждения.
-   **ESLint — flat config** (`eslint.config.js`, ESLint 9): `eslint-plugin-vue` (flat/essential) + `@vue/eslint-config-typescript` + Prettier skip-formatting. Блок `eslintConfig` в `package.json` — легаси/мёртвый, действует именно flat-config.

### Стиль кода (обеспечивается Prettier)

`.prettierrc.json`: **табы (ширина 4)**, одинарные кавычки, точки с запятой, `printWidth: 100`, `trailingComma: "all"`. Соблюдайте точь-в-точь — `npm run format` всё равно перепишет под это. Отступы в репозитории — табы, не пробелы.

## Рабочий процесс

-   **Default-ветка — `main`.** Ветка `docs` существует как историческая (в ней велась первоначальная работа над документацией до синхронизации с `main`); новая работа — feature-ветками от `main`.
-   **Точка входа для пользователя репо** — `README.md` в корне (полный портфельный обзор + ссылки на доки в `src/docs/`). Если правите крупное в `src/docs/*` или меняете структуру проекта — синхронизируйте `README.md`.
-   **Markdown-файлы форматируются** `npx prettier --write` так же, как код; перед коммитом — `npx prettier --check`.
-   **Имя в `package.json`** — `component-library-vite` (наследие исходного шаблона); фактическое имя проекта — FinTrack. Не переименовывайте без явной просьбы.
