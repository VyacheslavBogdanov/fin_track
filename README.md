# FinTrack

> Веб-приложение для учёта личных финансов (PWA с оффлайн-режимом и мультивалютностью) — портфельный проект, в котором каждый блок кода одновременно решает фичевую задачу и демонстрирует тему с frontend-собеседования.

**Статус:** Phase 0 — Setup &nbsp;·&nbsp; **Стек:** Vue 3 + TypeScript + Vite &nbsp;·&nbsp; **Лицензия:** TBD

---

## О проекте

FinTrack — веб-приложение для отслеживания доходов, расходов, планирования бюджета и аналитики. Цели проекта двойные:

1. **Рабочее приложение.** Production-ready PWA с оффлайн-поддержкой, мультивалютностью, импортом банковских выписок, экспортом отчётов в PDF/CSV.
2. **Демонстрация компетенций.** Каждая фича в коде — это конкретная тема с frontend-собеседования. В коде стоят навигационные комментарии-якоря `[Собес: ...]`, которые ссылаются на банк из 100+ вопросов в [`src/docs/100_вопросов_frontend_собеседований.md`](src/docs/100_вопросов_frontend_собеседований.md). Так код одновременно делает дело и служит шпаргалкой при подготовке.

Подробнее цели, монетизация (freemium), целевая аудитория — в [`src/docs/ТЗ_Finance_App.md`](src/docs/ТЗ_Finance_App.md) §1.

**Текущая стадия:** Phase 0 (Setup). Документация проработана; каркас FSD и тулинг — в работе; реализация фич впереди по `implementation-plan.md`.

---

## Стек

| Слой             | Технология                                      |
| ---------------- | ----------------------------------------------- |
| Фреймворк        | Vue 3 + Composition API + `<script setup>`      |
| Язык             | TypeScript (strict mode)                        |
| Сборщик          | Vite                                            |
| Маршрутизация    | Vue Router 4                                    |
| State management | Pinia (setup-стиль)                             |
| Стили            | SCSS + BEM                                      |
| Графики          | Chart.js (Phase 2), ECharts (Phase 3)           |
| Тестирование     | Vitest + Vue Test Utils (подключение в Phase 0) |
| PWA              | vite-plugin-pwa / Workbox (Phase 3)             |
| Линтинг и формат | ESLint 9 (flat config) + Prettier               |

Полный список — в [`src/docs/ТЗ_Finance_App.md`](src/docs/ТЗ_Finance_App.md) §2.

---

## Структура проекта (FSD)

Архитектура — **Feature-Sliced Design** со строгой иерархией слоёв (импорты только сверху вниз):

```
src/
├── app/         # инициализация, провайдеры, глобальные стили, роутер
├── pages/       # страницы (lazy-loaded)
├── widgets/     # составные UI-блоки (Header, Sidebar, DashboardGrid)
├── features/    # бизнес-действия (add-transaction, set-budget, ...)
├── entities/    # доменные модели + Pinia stores (transaction, budget, ...)
├── shared/      # переиспользуемое: ui, lib, composables, api, config
└── docs/        # документация проекта
```

Иерархия импортов: `app → pages → widgets → features → entities → shared`. Cross-import между слайсами одного слоя запрещён; публичный API слайса — только через `index.ts`. Полный разбор FSD-каркаса — [`src/docs/ТЗ_Finance_App.md`](src/docs/ТЗ_Finance_App.md) §3.

---

## Quick start

```bash
git clone https://github.com/VyacheslavBogdanov/fin_track.git
cd fin_track
npm install
npm run dev          # http://localhost:5173
```

Доступные скрипты:

| Команда              | Что делает                                  |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Vite dev-сервер с HMR                       |
| `npm run build`      | Параллельно: type-check + production-сборка |
| `npm run preview`    | Превью собранного бандла                    |
| `npm run type-check` | `vue-tsc --build --force`                   |
| `npm run lint`       | `eslint . --fix`                            |
| `npm run format`     | `prettier --write src/`                     |

Скрипт `npm test` (Vitest) добавится в Phase 0 имплементации.

**Dev-прокси:** `vite.config.ts` проксирует `/api/*` → `http://81.94.156.176:5011` (срезая префикс `/api`). Фронт ходит на `/api/...`.

---

## Roadmap

Имплементация разбита на пять фаз. Полный чеклист (205 чекбоксов с Definition of Done на каждой фазе) — [`src/docs/implementation-plan.md`](src/docs/implementation-plan.md).

| Фаза                           | Срок          | Что появляется                                                             |
| ------------------------------ | ------------- | -------------------------------------------------------------------------- |
| **Phase 0** — Setup            | 1–3 дня       | Каркас FSD, инициализация Vite/Pinia/Router, тестовая инфра, CI baseline   |
| **Phase 1** — MVP              | 3 недели      | UI-kit (минимум), адаптивный layout, авторизация, транзакции CRUD, дашборд |
| **Phase 2** — Расширение       | +2 недели     | Бюджеты, мультивалютность, дерево категорий, графики, расширенный UI-kit   |
| **Phase 3** — Production-ready | +2 недели     | PWA + оффлайн, импорт CSV, отчёты, E2E (Playwright), CI/CD, мониторинг     |
| **Phase 4+** — After-MVP       | по мере роста | Семейный бюджет, реальный backend, native-обёртка, ML-категоризация, SSR   |

---

## Документация

Вся содержательная документация — в [`src/docs/`](src/docs/):

| Файл                                                                                        | О чём                                                                          |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`ТЗ_Finance_App.md`](src/docs/ТЗ_Finance_App.md)                                           | Главный источник истины: архитектура, модули, модели, API, тесты, антипаттерны |
| [`coding-conventions.md`](src/docs/coding-conventions.md)                                   | Короткие правила «как писать код» (FSD, TS, Vue, Pinia, CSS, адаптивность)     |
| [`implementation-plan.md`](src/docs/implementation-plan.md)                                 | Executable-чеклист имплементации по 5 фазам, 205 чекбоксов                     |
| [`100_вопросов_frontend_собеседований.md`](src/docs/100_вопросов_frontend_собеседований.md) | Банк тем для frontend-собесов (источник для якорей `[Собес: ...]` в коде)      |

---

## Ключевые конвенции

Полный список — в [`src/docs/coding-conventions.md`](src/docs/coding-conventions.md). Три самых важных правила, применяющихся всегда:

1. **Якоря `[Собес: ...]`** — каждый нетривиальный файл / блок кода имеет навигационный комментарий, связывающий его с темой из банка вопросов. Формат: `// [Собес: <раздел> → <короткая формулировка>]`. Полное руководство — [ТЗ §1.5](src/docs/ТЗ_Finance_App.md).
2. **Лимит ≤ 200 строк** на файл (`.vue` / `.ts` / `.scss`) в `src/`. При превышении — декомпозиция, а не раздувание лимита. Подробности — [conventions §3](src/docs/coding-conventions.md).
3. **Адаптивность mobile-first** — поддержка viewport от 320 px до 1920+ px. Брейкпоинты `mobile / tablet / desktop / wide`, минимальные touch-targets 44 × 44 px, `ResizeObserver` вместо `window.resize`. Подробности — [conventions §11.5](src/docs/coding-conventions.md) и [ТЗ §10 «Адаптивность»](src/docs/ТЗ_Finance_App.md).

---

## Лицензия

Не определена (личный портфельный проект). При публикации — будет добавлен `LICENSE`.
