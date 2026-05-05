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

- `src/docs/100_вопросов_frontend_собеседований.md` — банк вопросов с frontend-собеседований.
- `src/docs/ТЗ_Finance_App.md` — большое (~3500 строк, v2) техническое задание на приложение «FinTrack». Описывает *целевую* архитектуру (FSD-структура внутри `src/`, Pinia, Vue Router 4, SCSS+BEM, Vitest, vite-plugin-pwa и т. д.) — ничего из этого в коде ещё не реализовано. ТЗ — источник истины при проектировании новых фич; не считайте, что что-то из него уже существует в коде.

Когда пользователь просит «реализовать X из ТЗ» или подобное — сначала прочитайте соответствующий раздел `ТЗ_Finance_App.md`: ТЗ уже фиксирует структуру файлов (FSD: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`), модели данных, форму сторов и роуты.

### Неочевидные особенности сборки и тулинга

- **Алиас `@` → `/src`** (настроен в `vite.config.ts` и `tsconfig.app.json`). Когда `src/` начнёт расти — импортируйте через `@/...`, а не относительными путями.
- **Dev-прокси API:** `vite.config.ts` проксирует `/api/*` на `http://81.94.156.176:5011` и срезает префикс `/api`. Фронт должен ходить на `/api/...` — префикс удаляется до отправки на upstream.
- **Project references в TypeScript:** `tsconfig.json` — solution-файл, ссылающийся на `tsconfig.app.json` (код приложения) и `tsconfig.node.json` (Vite/тулинг). В `tsconfig.app.json` в `include` указан `server.js`, но такого файла в репозитории нет — не удаляйте запись, если только не добавляете сам сервер.
- **Express/cors/uuid/nodemon в `dependencies`**, хотя Node-сервера нет. Похоже, заложены под будущий встроенный API-сервер (вероятно, тот самый `server.js`). Не удаляйте без подтверждения.
- **ESLint — flat config** (`eslint.config.js`, ESLint 9): `eslint-plugin-vue` (flat/essential) + `@vue/eslint-config-typescript` + Prettier skip-formatting. Блок `eslintConfig` в `package.json` — легаси/мёртвый, действует именно flat-config.

### Стиль кода (обеспечивается Prettier)

`.prettierrc.json`: **табы (ширина 4)**, одинарные кавычки, точки с запятой, `printWidth: 100`, `trailingComma: "all"`. Соблюдайте точь-в-точь — `npm run format` всё равно перепишет под это. Отступы в репозитории — табы, не пробелы.

## Рабочий процесс

- Текущая ветка — `docs`: в ней ведётся работа над Markdown (ТЗ и подготовка к собесам); `main` — интеграционная ветка.
- README.md пуст — не считайте отсутствие в нём содержания авторитетным источником.
