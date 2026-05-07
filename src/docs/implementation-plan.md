# Implementation Plan — FinTrack

Рабочий чеклист имплементации FinTrack по фазам. Каждый чекбокс — логически законченная единица работы (фича / компонент / композабл с тестами и якорями).

## Контекст

-   Источник архитектуры — `ТЗ_Finance_App.md` (особенно §3 FSD, §4 модули, §4.6 фазы, §5 модели, §6 роуты, §7 stores).
-   Источник правил для кода — `coding-conventions.md`.
-   Источник тем для якорей `[Собес: ...]` — `100_вопросов_frontend_собеседований.md`.
-   Этот файл — **executable-версия §4.6 ТЗ**: те же три фазы (MVP → расширение → production-ready) + Phase 0 (setup) и Phase 4+ (after-MVP), но развёрнутые в чекбоксы среднего размера.

## Как пользоваться

-   Двигайся фазами сверху вниз. Внутри фазы — параллельно, если зависимостей нет.
-   Чекбокс ставится **только когда выполнен полный Definition of Done для пункта**: код + якоря `[Собес: ...]` + тесты (где применимо) + адаптивность проверена + lint/type-check зелёные.
-   В конце каждой фазы — блок **Definition of Done фазы**. Не переходить к следующей фазе, пока DoD красный.
-   Раздел **Cross-cutting** в самом конце — это правила, которые применяются на каждой фазе. Они не повторяются внутри каждого пункта, но проверяются всегда.

## Глоссарий статусов чекбоксов

-   `- [ ]` — не начато.
-   `- [~]` — в работе (помечать вручную, временный статус).
-   `- [x]` — готово, прошло DoD.

---

## Phase 0 — Setup (1–3 дня)

> Цель: рабочий каркас FSD + все инструменты тулинга, на котором можно начать собирать MVP.

### 0.1. Инициализация зависимостей

-   [x] Добавить runtime-зависимости: `vue-router@4`, `pinia`, `@vueuse/core`, `zod`.
-   [x] Добавить dev-зависимости: `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `msw`.
-   [x] Добавить PWA: `vite-plugin-pwa`, `workbox-window`.
-   [x] Добавить SCSS: `sass` (если нет).
-   [x] Добавить husky + lint-staged: `pre-commit` гоняет `lint-staged` (eslint --fix + prettier --write на изменённых файлах).
-   [x] Скрипт `npm test` в `package.json` → `vitest run`; `npm run test:watch` → `vitest`.

### 0.2. FSD-каркас

-   [x] Создать структуру: `src/{app,pages,widgets,features,entities,shared}` (по §3 ТЗ).
-   [x] В `shared/`: подкаталоги `ui/`, `composables/`, `lib/`, `api/`, `config/`, `types/`, `directives/`.
-   [x] ESLint-правило (или хотя бы README в каждом слое) о запрете cross-import между слайсами одного слоя.

### 0.3. Глобальные стили

-   [x] `app/styles/_reset.scss` — modern CSS reset.
-   [x] `app/styles/_variables.scss` — палитра, типографика, spacing-scale.
-   [x] `app/styles/_breakpoints.scss` — миксины `mobile` / `tablet` / `desktop` / `wide` (см. conventions §11.5).
-   [x] `app/styles/_mixins.scss` — общие миксины (focus-ring, truncate, scrollbar).
-   [x] `app/styles/index.scss` — собирает всё через `@use`.
-   [x] Подключить `index.scss` в `app/index.ts`.

### 0.4. Базовый Router

-   [x] `app/providers/router.ts` — `createRouter` + `createWebHistory`.
-   [x] Роут-плейсхолдеры для всех будущих страниц (lazy-импорт): `/`, `/transactions`, `/budget`, `/reports`, `/settings`, `/auth`, `/:pathMatch(.*)*`.
-   [x] Глобальный `beforeEach` (пока пустой; auth-guard добавим в 1.3).

### 0.5. Базовая Pinia

-   [x] `app/providers/pinia.ts` — `createPinia()`.
-   [x] Подключение в `app/index.ts`: `app.use(pinia).use(router).mount('#app')`.

### 0.6. Базовый App-каркас

-   [x] `App.vue` — `<RouterView />` + базовый layout-плейсхолдер.
-   [x] `index.html` — viewport meta `width=device-width, initial-scale=1, viewport-fit=cover`.
-   [x] `index.html` — `<title>FinTrack</title>`, `<meta name="theme-color">`, OG-теги-заглушки.

### 0.7. CI baseline

-   [x] `.github/workflows/ci.yml` — на pull_request: `npm ci → lint → type-check → test → build`.
-   [ ] Branch protection на `main`: require CI green, require 1 review. _(заблокировано: классическая branch protection требует GitHub Pro для private-репо; настроить через UI после публикации репо или через Rulesets вручную)_

### 0.8. DoD Phase 0

-   [x] `npm run dev` поднимается; `App.vue` рендерится.
-   [x] `npm run lint && npm run format && npm run type-check && npm run build && npm test` — всё зелёное.
-   [x] FSD-папки на месте, `_breakpoints.scss` подключён.
-   [x] CI на тестовом PR — зелёный.

---

## Phase 1 — MVP (3 недели)

> Цель: рабочее приложение с CRUD транзакций, авторизацией, плоскими категориями, простым дашбордом. Полностью адаптивно.

### 1.1. Shared UI-kit (минимум)

-   [ ] `AppButton` (variants `primary`/`secondary`/`ghost`/`danger`, sizes `sm`/`md`/`lg`, `loading`, `disabled`, fallthrough attrs) + якорь `Vue → fallthrough attrs / $attrs` + unit-тесты.
-   [ ] `AppInput` (`defineModel`, label, error, hint, типы text/number/email/password) + якорь `Vue → defineModel + кастомный модификатор` + тесты.
-   [ ] `AppModal` (`Teleport to=body`, focus trap, ESC-закрытие, click-outside-to-close, ARIA `role=dialog`, `aria-modal`) + якорь `Vue → Teleport`, `a11y → focus trap` + тесты.
-   [ ] `AppTabs` + `AppTab` (`provide`/`inject` для активной вкладки, ARIA WAI-tabs, клавиатурная навигация Arrow/Home/End) + якорь `Vue → provide/inject`, `a11y → keyboard nav` + тесты.
-   [ ] `AppCard`, `AppSpinner` — простые презентационные.
-   [ ] Все компоненты адаптивны (см. cross-cutting C.2).

### 1.2. Адаптивный layout

-   [ ] `widgets/Header/AppHeader.vue` — sticky, бургер-меню на mobile, full-nav на desktop.
-   [ ] `widgets/Sidebar/AppSidebar.vue` — drawer с overlay на mobile/tablet, постоянный на desktop.
-   [ ] `app/layouts/DefaultLayout.vue` — CSS Grid `header / aside / main / footer`, перестроение на mobile.
-   [ ] Проверка: 320 / 375 / 768 / 1024 / 1440 / 1920 px без горизонтального скролла, бургер работает на touch.

### 1.3. Авторизация (упрощённая)

-   [ ] `entities/user/model` — тип `User`, `useUserStore` (текущий пользователь).
-   [ ] `entities/user/api` — `login`, `register`, `refresh`, `logout` (mock через MSW).
-   [ ] `features/auth-by-credentials/ui/LoginForm.vue` — форма + валидация (zod).
-   [ ] `features/auth-by-credentials/ui/RegisterForm.vue`.
-   [ ] `features/auth-by-credentials/model/useAuth.ts` — composable: `login`, `logout`, `isAuthenticated`.
-   [ ] `pages/AuthPage/AuthPage.vue` — табы login/register, адаптивна.
-   [ ] Router: `meta.requiresAuth`, `beforeEach` guard, `replace` после логина.
-   [ ] Interceptor для axios/fetch: `Authorization: Bearer ...` из памяти; auto-refresh при 401.
-   [ ] Якоря: `JS → замыкание (interceptor)`, `Vue Router → guards`, `Vue Router → push vs replace`, `Browser → cookie HttpOnly`.
-   [ ] Тесты: `useAuth.login` (успех/401), guard блокирует приватный роут.

### 1.4. Транзакции — CRUD

-   [ ] `entities/transaction/model/types.ts` — `Transaction`, `TransactionType`.
-   [ ] `entities/transaction/model/store.ts` — `useTransactionStore` (setup-стиль): `items`, `totalIncome`, `totalExpense`, `add`, `update`, `remove`.
-   [ ] `entities/transaction/api` — `list`, `create`, `update`, `delete` (MSW).
-   [ ] `features/add-transaction` — форма + валидация.
-   [ ] `features/edit-transaction`.
-   [ ] `features/filter-transactions` — поиск с `useDebounce`, фильтр по типу/категории/дате.
-   [ ] `widgets/TransactionList/TransactionList.vue` — список с `key=tx.id`, scoped slot для строки.
-   [ ] `pages/TransactionsPage/TransactionsPage.vue` — фильтры + список + кнопка добавить.
-   [ ] Якоря: `JS → reduce`, `JS → замыкание (debounce)`, `Vue → key в v-for`, `Vue → computed`, `Vue → scoped slots`.
-   [ ] Тесты: store `add/totalIncome` math, форма валидация, фильтр.

### 1.5. Категории (плоский список)

-   [ ] `entities/category/model/types.ts`, `store.ts` (`useCategoryStore`).
-   [ ] `entities/category/api`.
-   [ ] `widgets/CategoryList/CategoryList.vue` — плоский список (дерево — в Phase 2).
-   [ ] `pages/SettingsPage/CategoriesSection.vue` — CRUD категорий внутри настроек.
-   [ ] Якоря: `Vue → slots`, `JS → массивы (filter/map)`.

### 1.6. Дашборд (без графиков)

-   [ ] `entities/transaction` → `computed` агрегаты (общий баланс, расходы за месяц, ТОП-5 категорий).
-   [ ] `widgets/BalanceCard`, `widgets/ExpenseSummary`, `widgets/RecentTransactions`.
-   [ ] `pages/DashboardPage/DashboardPage.vue` — CSS Grid `auto-fit minmax(280px, 1fr)`.
-   [ ] `KeepAlive` для дашборда при переходе на другие страницы.
-   [ ] Якоря: `Vue → Suspense`, `Vue → KeepAlive`, `Vue → shallowRef (если будут тяжёлые объекты)`.
-   [ ] Адаптивность: на mobile карточки в одну колонку, скрытые второстепенные виджеты.

### 1.7. Composables-ядро

-   [ ] `shared/composables/useDebounce.ts` + якоря + тесты.
-   [ ] `shared/composables/useFetch.ts` (`AbortController`, retry, типизация через generic) + якоря + тесты.
-   [ ] `shared/composables/useLocalStorage.ts` (реактивная синхронизация с localStorage, обработка `storage` event) + якоря + тесты.
-   [ ] `shared/composables/useClickOutside.ts` (+ директива `v-click-outside`).
-   [ ] `shared/composables/useIntersectionObserver.ts`.
-   [ ] `shared/lib/formatMoney.ts`, `shared/lib/groupBy.ts`, `shared/lib/deepClone.ts` + тесты.

### 1.8. Тестовая инфраструктура MVP

-   [ ] `vitest.config.ts` (jsdom, alias `@`).
-   [ ] `tests/setup.ts` (auto-import утилит, MSW server start).
-   [ ] MSW handlers под `entities/*/api`.
-   [ ] Coverage report в CI; порог ≥ 60% на `shared/lib` и `shared/composables`.
-   [ ] Один integration-тест: «логин → создать транзакцию → она появилась в дашборде».

### 1.9. Definition of Done MVP

-   [ ] У каждого созданного в MVP слайса (`entities/*`, `features/*`) есть `index.ts` с public API; импорты во внутренности слайса извне отсутствуют.
-   [ ] Lighthouse desktop: Performance ≥ 80, A11y ≥ 90, Best Practices ≥ 90, SEO ≥ 90.
-   [ ] Lighthouse mobile: Performance ≥ 70, A11y ≥ 90.
-   [ ] Bundle initial < 200 KB gzip.
-   [ ] Работает в Chrome / Firefox / Safari (последние 2 версии).
-   [ ] Все страницы адаптивны: проверка на 320 / 375 / 768 / 1024 / 1440 / 1920 px.
-   [ ] У всех нетривиальных файлов есть хедер-якоря; в нетривиальных блоках — локальные якоря.
-   [ ] CI зелёный (lint + type-check + test + build).
-   [ ] Coverage ≥ 60% на `shared/lib` и `shared/composables`.

---

## Phase 2 — Расширение (+2 недели)

> Цель: бюджеты, мультивалютность, дерево категорий, графики, расширенный UI-kit.

### 2.1. Бюджеты и лимиты

-   [ ] `entities/budget/model/types.ts`, `store.ts` (`useBudgetStore`).
-   [ ] `entities/budget/api`.
-   [ ] `features/set-budget` — форма установки лимита на категорию/период.
-   [ ] `widgets/BudgetOverview`, `widgets/BudgetCard`, `widgets/BudgetBar`.
-   [ ] `pages/BudgetPage/BudgetPage.vue` — карточки бюджетов в адаптивной сетке.
-   [ ] SSE-подписка на превышение лимита (`EventSource`); fallback на polling.
-   [ ] Якоря: `JS → Promise.all/race`, `Vue → reactive computed`, `Browser → SSE`.
-   [ ] Тесты: расчёт прогресса, edge-cases (превышение, нулевой лимит).

### 2.2. Мультивалютность

-   [ ] `entities/currency/model/types.ts` (`Currency`, `Rate`), `store.ts`.
-   [ ] `entities/currency/api` — REST для базовых курсов, WebSocket для real-time (mock в dev).
-   [ ] `shared/composables/useCurrency.ts` — конвертация, форматирование с локалью.
-   [ ] `features/currency-convert` — UI селектор + конвертер.
-   [ ] `Promise.any` по нескольким источникам курсов с `finally` для очистки.
-   [ ] WeakMap-кеш конвертаций (по паре валют).
-   [ ] Якоря: `JS → Promise.any/finally`, `JS → || vs ??`, `JS → WeakMap`, `Browser → WebSocket`, `JS → каррирование (createConverter)`.

### 2.3. Категории — дерево

-   [ ] Рефакторинг `entities/category` под рекурсивную структуру (`parentId`, `children`).
-   [ ] `widgets/CategoryTree/CategoryNode.vue` — рекурсивный компонент (`<CategoryNode v-for=...>`).
-   [ ] Drag & drop через native HTML5 DnD API.
-   [ ] Якоря: `JS → рекурсия`, `Vue → рекурсивный компонент`, `Browser → HTML5 DnD`.
-   [ ] Тесты: операции на дереве (move, reparent, delete с детьми).

### 2.4. UI-kit — расширение

-   [ ] `AppToast` (`TransitionGroup`, `aria-live=polite`, очередь, авто-dismiss) + якорь `Vue → TransitionGroup`, `a11y → aria-live` + тесты.
-   [ ] `InfiniteScroll` (`IntersectionObserver`, sentinel) + тесты.
-   [ ] `VirtualScroll` (с `v-memo` для строк) + якорь `Vue → v-memo`, `Browser → IntersectionObserver` + тесты.
-   [ ] `InputMoney` (custom v-model modifier, маска ввода) + якорь `Vue → defineModel + кастомный модификатор`.
-   [ ] Директива `v-lazy-img` (`IntersectionObserver`).

### 2.5. Графики на дашборде

-   [ ] Установить `chart.js` + `vue-chartjs`.
-   [ ] `widgets/ChartBalance`, `widgets/ChartExpenseByCategory` — обёртки.
-   [ ] `defineAsyncComponent` для графиков (отдельный chunk).
-   [ ] `shallowRef` для данных графика (Chart.js сам управляет внутренним DOM).
-   [ ] `ResizeObserver` на контейнер графика для пересчёта (не `window.resize`).
-   [ ] Якоря: `Vue → defineAsyncComponent`, `Vue → shallowRef`, `Browser → ResizeObserver`.

### 2.6. Адаптивность Phase 2

-   [ ] Графики корректно ресайзятся на mobile (Container Query или ResizeObserver).
-   [ ] Дерево категорий читаемо и кликабельно на mobile (touch targets ≥ 44 px).
-   [ ] BudgetCard перестраивается на mobile (вертикально, прогресс-бар на всю ширину).

### 2.7. Definition of Done Phase 2

-   [ ] Coverage ≥ 70%.
-   [ ] Lighthouse не упал относительно MVP.
-   [ ] Bundle initial < 250 KB gzip (с учётом разнесения Chart.js в lazy chunk — основной не должен расти).
-   [ ] Все новые виджеты адаптивны на 320 / 768 / 1440.

---

## Phase 3 — Production-ready (+2 недели)

> Цель: PWA-режим, оффлайн-очередь, импорт/экспорт, расширенные тесты, CI/CD-деплой, мониторинг и безопасность.

### 3.1. PWA + оффлайн

-   [ ] `vite-plugin-pwa` конфиг (`registerType: 'autoUpdate'`).
-   [ ] Service Worker стратегии: `cache-first` для статики, `network-first` для API.
-   [ ] IndexedDB-очередь для оффлайн-транзакций (`idb` или wrapper).
-   [ ] Background Sync для отправки очереди.
-   [ ] UI: индикатор оффлайна, badge с количеством pending-операций.
-   [ ] Якоря: `Browser → Service Worker`, `Browser → IndexedDB`, `Browser → SPA vs PWA`, `JS → AbortController (для отмены sync)`.

### 3.2. Импорт CSV / XLSX

-   [ ] `features/import-csv` — UI с drag & drop файла.
-   [ ] Парсинг в main thread для файлов < 1 MB.
-   [ ] Web Worker для файлов ≥ 1 MB (`new Worker(new URL('./parser.worker.ts', import.meta.url))`).
-   [ ] Генератор для чтения/обработки чанками.
-   [ ] Превью разпарсенных строк, маппинг колонок.
-   [ ] Санитайзинг через DOMPurify перед сохранением.
-   [ ] Якоря: `JS → генераторы`, `Browser → Web Worker`, `JS → Garbage Collection (освобождение после парсинга)`, `Безопасность → XSS при импорте`.

### 3.3. Отчёты и экспорт

-   [ ] `pages/ReportsPage/ReportsPage.vue` — конфигуратор отчёта.
-   [ ] `widgets/ReportChart` — ECharts (асинхронный импорт).
-   [ ] Экспорт в PDF (`jspdf` + `jspdf-autotable`).
-   [ ] Экспорт в CSV (без зависимостей).
-   [ ] `requestIdleCallback` для фоновой генерации больших отчётов.
-   [ ] Якоря: `Browser → requestIdleCallback`, `JS → deepClone (для экспорта)`.

### 3.4. Расширенное тестирование

-   [ ] MSW handlers покрывают все API-эндпоинты.
-   [ ] Integration-тесты: Pinia store + MSW (полный happy path для каждого модуля).
-   [ ] E2E (Playwright): логин → создать транзакцию → установить бюджет → увидеть в дашборде → экспортировать PDF.
-   [ ] Visual regression на ключевых экранах (Playwright `toHaveScreenshot()`).
-   [ ] Coverage ≥ 80% на entities + features.

### 3.5. CI/CD pipeline

-   [ ] Multi-stage `Dockerfile` (build + nginx).
-   [ ] `nginx.conf`: gzip/brotli, cache headers, fallback на `index.html` для SPA, `proxy_buffering off` для SSE.
-   [ ] GitHub Actions: на push в `main` — build образа → push в registry → deploy на staging.
-   [ ] Smoke test после деплоя (E2E на staging).

### 3.6. Мониторинг

-   [ ] Sentry SDK (`@sentry/vue`) + sourcemaps в CI.
-   [ ] `web-vitals` → отправка в analytics endpoint (или Sentry).
-   [ ] Lighthouse CI: порог `performance ≥ 90`, A11y ≥ 95; PR блокируется при regression.

### 3.7. Безопасность

-   [ ] Content-Security-Policy на nginx (только свои origin + nonce для inline-script если нужно).
-   [ ] Refresh token rotation (новый refresh при каждом обновлении access).
-   [ ] CSRF-токен в заголовке для не-GET запросов.
-   [ ] Rate limiting на nginx (см. ТЗ §10.6).
-   [ ] Запуск чек-листа безопасности из ТЗ §10.6 → все пункты зелёные.

### 3.8. Definition of Done Phase 3

-   [ ] Lighthouse Perf ≥ 90 (desktop), ≥ 80 (mobile); A11y ≥ 95.
-   [ ] Bundle initial < 250 KB gzip; ECharts/Chart.js — в отдельных lazy chunks.
-   [ ] Все требования безопасности из ТЗ §10.6 выполнены.
-   [ ] E2E зелёный на staging.
-   [ ] Адаптивность подтверждена E2E (snapshot на 375 + 1440).
-   [ ] PWA устанавливается, оффлайн-режим работает.

---

## Phase 4+ — Масштабирование и новые фичи (after-MVP)

> Идеи и направления роста после релиза production-ready версии. Чекбоксы тут — крупные эпики; разворачиваются в свои планы при старте.

### 4.1. Семейный бюджет с ролями

-   [ ] Роли `admin` / `member` / `viewer`, инвайты в общий бюджет.
-   [ ] Real-time синхронизация изменений (WebSocket / CRDT).
-   [ ] Per-user permissions на уровне категорий.

### 4.2. Реальный backend (миграция с моков)

-   [ ] Node.js + Express (express + cors + uuid + nodemon уже в `dependencies`).
-   [ ] PostgreSQL + миграции (`prisma` или `kysely`).
-   [ ] JWT + refresh rotation, bcrypt для паролей.
-   [ ] OpenAPI-документация эндпоинтов.
-   [ ] Постепенная замена MSW-handlers на реальный API.

### 4.3. Native-обёртка

-   [ ] Capacitor для iOS/Android (доступ к биометрии, push-уведомления).
-   [ ] или Tauri для desktop (если нужен native-окружение).

### 4.4. ML-категоризация транзакций

-   [ ] Простая модель «название → категория» на основе истории пользователя.
-   [ ] Server-side: TensorFlow.js или внешнее API.
-   [ ] UI: предложение категории при добавлении транзакции, обучение по подтверждениям.

### 4.5. SSR / SSG для маркетинговых страниц

-   [ ] Nuxt (или standalone Vite SSR) для `/landing`, `/pricing`, `/blog`.
-   [ ] SEO meta + Open Graph + JSON-LD.
-   [ ] ISR для виджета курсов (`/widget/rates`) — обновление раз в 5 минут.
-   [ ] Якорь: `Vue → SSR/SSG/ISR/PPR` (см. ТЗ §4.5).

### 4.6. Темизация (white-label)

-   [ ] Все цвета через CSS custom properties (без хардкода).
-   [ ] Темы: light / dark / system / custom (пользовательская).
-   [ ] Кастомные CSS-переменные хранятся в user settings.

### 4.7. Интернационализация — расширение

-   [ ] `vue-i18n` интеграция.
-   [ ] Локали: ru, en, es; задел под другие.
-   [ ] RTL-поддержка (для арабского/иврита) — `dir="rtl"` + logical CSS properties.
-   [ ] Локализованные форматы дат/чисел через `Intl`.

### 4.8. Производительность 2.0

-   [ ] Web Workers для тяжёлых вычислений (массовые отчёты, аналитика трендов).
-   [ ] Virtual lists для всех больших таблиц (транзакции > 10k).
-   [ ] Service Worker streaming (стриминг ответов из кеша при длинных запросах).
-   [ ] HTTP/2 push (или HTTP/3) на nginx.

### 4.9. Расширенный экспорт / импорт

-   [ ] XLSX (`xlsx-populate` или `exceljs`).
-   [ ] JSON-экспорт с миграциями схем (обратная совместимость).
-   [ ] OFX/QFX-импорт (стандарт банковских выписок).
-   [ ] Прямая интеграция с банками через open banking API (по странам).

### 4.10. Аналитика и UX-исследования

-   [ ] Product analytics (Posthog / Amplitude) — опционально, с consent banner (GDPR).
-   [ ] Heatmaps / session recording — только в dev/staging, не в проде без consent.
-   [ ] A/B-тестирование через feature flags (LaunchDarkly или self-hosted).

---

## Cross-cutting (применяется на всех фазах)

> Эти проверки делаются непрерывно — не привязаны к конкретному пункту, но красная любая из них блокирует merge.

### C.1. Якоря `[Собес: ...]`

-   У каждого нового нетривиального файла — хедер-якорь со списком тем (см. conventions §4 и ТЗ §1.5).
-   У каждого блока, демонстрирующего тему, — локальный якорь `// [Собес: ...]`.
-   `grep -rn "\[Собес:" src/` после фичи — список новых мест синхронизирован с ТЗ §13 (матрица покрытия).

### C.2. Адаптивность

-   Каждый новый UI-компонент / страница: проверка на **320 / 375 / 768 / 1024 / 1440 / 1920 px** (Chrome DevTools Responsive).
-   Touch-targets ≥ 44 × 44 px на mobile.
-   Нет mobile detection через `userAgent` — только CSS media queries / Container Queries.
-   Графики и таблицы пересчитываются по `ResizeObserver`, а не по `window.resize`.

### C.3. Тесты

-   Coverage не падает: MVP ≥ 60%, Phase 2 ≥ 70%, Phase 3 ≥ 80%.
-   Любой багфикс — сначала regression-тест, потом фикс.

### C.4. Bundle budget

-   Initial bundle: MVP < 200 KB gzip, Phase 2 < 250 KB, Phase 3 < 250 KB (за счёт lazy chunks).
-   Bundle analyzer в PR-комментариях; рост > +10 KB initial — обоснование в описании PR.

### C.5. Lighthouse / Web Vitals

-   Ежефазный замер; regress > -5 пунктов в любой категории — блокирует merge до объяснения.
-   Web Vitals: LCP < 2.5 s, FID < 100 ms, CLS < 0.1 (на staging-деплое).

### C.6. Размер файлов

-   `wc -l` на любой `.vue` / `.ts` / `.scss` ≤ 200 строк (см. conventions §3).
-   При превышении — декомпозиция (см. conventions §3.3 и ТЗ §12.5 «God Component»).

### C.7. Безопасность

-   Никаких секретов в коде / репо (использовать `.env` + `.env.example`, секреты в CI).
-   Любой `v-html` — только на санитизированный контент.
-   Любой новый API-эндпоинт — `zod`-схема для валидации ответа.

### C.8. Синхронизация с ТЗ

-   После реализации модуля — обновить «Матрицу покрытия тем» (ТЗ §13): отметить, какие темы реально раскрыты.
-   Если в процессе разработки выявлено отклонение от ТЗ — сначала правка ТЗ, потом код.
