# ТЗ: Finance App — Приложение учёта личных финансов

---

## 1. Обзор проекта

**Название:** FinTrack
**Описание:** Веб-приложение для учёта доходов, расходов, планирования бюджета и аналитики финансов. Поддержка мультивалютности, оффлайн-режима и семейного бюджета.

**Цели:**

-   Дать пользователю полный контроль над финансами: отслеживание транзакций, категоризация расходов, визуализация трендов
-   Продемонстрировать все ключевые темы frontend-разработки из подготовки к собеседованиям
-   Построить production-ready PWA с оффлайн-поддержкой

**Монетизация (freemium):**

-   Бесплатный план: трекер транзакций, базовые категории, 1 валюта, дашборд с простыми графиками
-   Платная подписка: расширенная аналитика, мультивалютность, семейный бюджет (несколько участников), импорт выписок, экспорт отчётов в PDF/CSV

**Целевая аудитория:**

-   Индивидуальные пользователи, ведущие учёт расходов
-   Семьи, планирующие совместный бюджет
-   Фрилансеры с доходами в нескольких валютах

---

## 2. Стек технологий

| Слой             | Технология                                     |
| ---------------- | ---------------------------------------------- |
| Фреймворк        | Vue 3 + Composition API + `<script setup>`     |
| Сборщик          | Vite                                           |
| Язык             | TypeScript (strict mode)                       |
| Маршрутизация    | Vue Router 4                                   |
| State management | Pinia                                          |
| Стили            | SCSS + BEM                                     |
| Графики          | Chart.js (основные) + ECharts (сложные отчёты) |
| Тестирование     | Vitest + Vue Test Utils                        |
| PWA              | vite-plugin-pwa (Workbox)                      |
| Деплой           | Docker + nginx                                 |
| CI/CD            | GitHub Actions                                 |
| Линтинг          | ESLint + Prettier                              |

---

## 3. Архитектура — Feature-Sliced Design (FSD)

> **Темы собесов:** FSD, SOLID, KISS/DRY/YAGNI, паттерны проектирования, Flux-архитектура

```
src/
├── app/                        # Инициализация, провайдеры, глобальные стили, роутер, плагины
│   ├── index.ts                # createApp, монтирование
│   ├── providers/              # Pinia, Router, плагины, глобальные provide
│   ├── styles/                 # Глобальные SCSS: переменные, миксины, reset
│   └── plugins/                # Vue-плагины (toast, analytics)
│
├── pages/                      # Страницы (lazy-loaded)
│   ├── DashboardPage/
│   ├── TransactionsPage/
│   ├── BudgetPage/
│   ├── ReportsPage/
│   ├── SettingsPage/
│   ├── AuthPage/
│   └── NotFoundPage/
│
├── widgets/                    # Составные блоки UI
│   ├── Header/
│   ├── Sidebar/
│   ├── DashboardGrid/
│   ├── TransactionList/
│   └── BudgetOverview/
│
├── features/                   # Бизнес-действия (use cases)
│   ├── add-transaction/
│   ├── edit-transaction/
│   ├── set-budget/
│   ├── import-csv/
│   ├── export-report/
│   ├── currency-convert/
│   ├── auth-by-credentials/
│   └── filter-transactions/
│
├── entities/                   # Доменные модели, stores, API
│   ├── transaction/
│   ├── account/
│   ├── category/
│   ├── budget/
│   ├── currency/
│   └── user/
│
└── shared/                     # Переиспользуемое
    ├── ui/                     # UI-kit: Button, Input, Modal, Tabs, Card, Spinner
    ├── composables/            # useDebounce, useFetch, useLocalStorage, и т.д.
    ├── lib/                    # Утилиты: deepClone, groupBy, formatMoney, debounce, throttle
    ├── api/                    # HTTP-клиент, interceptors, типы запросов
    ├── config/                 # Константы, env-переменные
    ├── types/                  # Глобальные TypeScript типы
    └── directives/             # Кастомные директивы: v-lazy-img, v-click-outside, v-focus
```

**Принципы FSD в проекте:**

-   Слои имеют строгую иерархию зависимостей: `shared → entities → features → widgets → pages → app`
-   Каждый slice (например `entities/transaction`) содержит `model/`, `api/`, `ui/`, `index.ts` (public API)
-   Cross-import между слайсами одного слоя запрещён
-   Breadcrumbs → `shared/ui` (переиспользуемый UI), конфигурация breadcrumbs — через `route.meta`

---

## 4. Модули и фичи

---

### Модуль 1: Авторизация

**Что делает:**

-   Регистрация и логин по email/пароль
-   JWT-аутентификация (access + refresh tokens)
-   Access token хранится в памяти (переменная), refresh token — в cookie HttpOnly
-   Автоматический refresh при 401
-   Route guards для защиты приватных маршрутов
-   Logout с очисткой состояния

**Компоненты:**

-   `AuthPage` — страница с формой логина/регистрации
-   `LoginForm` / `RegisterForm` — формы с валидацией

**Composables:**

-   `useAuth()` — логин, логаут, проверка токена, текущий пользователь

**Store:**

-   `authStore` — user, isAuthenticated, tokens, login(), logout(), refreshToken()

**Темы собесов, которые покрываются:**

| Тема                              | Где реализована                                                          |
| --------------------------------- | ------------------------------------------------------------------------ |
| Cookie флаги, HttpOnly            | Refresh token в HttpOnly cookie                                          |
| Хранение данных на фронте         | access token в памяти, refresh в cookie, user preferences в localStorage |
| Навигационные guards              | `beforeEach` guard проверяет `authStore.isAuthenticated`                 |
| Защита роутов                     | `meta: { requiresAuth: true }`, редирект на `/login`                     |
| `router.push` vs `router.replace` | `replace` при редиректе после логина (чтобы не было `/login` в history)  |
| Async/await                       | Асинхронные запросы авторизации                                          |
| Промисы, обработка ошибок         | try/catch в auth actions, обработка 401/403                              |
| HTTPS                             | Все запросы по HTTPS, объяснение разницы HTTP/HTTPS                      |
| CORS, preflight                   | API на другом домене, настройка CORS заголовков                          |
| Замыкание                         | Interceptor хранит ссылку на token через замыкание                       |

---

### Модуль 2: Дашборд

**Что делает:**

-   Главная страница с обзором финансов
-   Графики: расходы по категориям (pie), динамика доход/расход (line), баланс по счетам (bar)
-   Виджеты: общий баланс, расход за месяц, последние транзакции, прогресс бюджетов
-   Данные загружаются параллельно с `Suspense`
-   Кеширование состояния через `KeepAlive` при навигации

**Компоненты:**

-   `DashboardPage` — страница с сеткой виджетов
-   `DashboardGrid` — widget grid layout (CSS Grid)
-   `BalanceCard`, `ExpenseChart`, `IncomeChart`, `BudgetProgress`, `RecentTransactions`
-   Асинхронные компоненты графиков через `defineAsyncComponent`

**Composables:**

-   `useDashboardData()` — агрегация данных из нескольких stores
-   `useChartData(transactions, period)` — трансформация транзакций в данные для графиков

**Темы собесов:**

| Тема                             | Где реализована                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| `computed` и кеширование         | Вычисляемые агрегаты: totalBalance, monthlyExpense, categoryBreakdown                        |
| `watch` vs `watchEffect`         | `watch` — пересчёт при смене периода; `watchEffect` — автоподписка на зависимости в графиках |
| `Suspense`                       | Обёртка страницы — показ skeleton пока все async компоненты не загружены                     |
| `defineAsyncComponent`           | Lazy-загрузка Chart.js компонентов с fallback spinner                                        |
| `KeepAlive`                      | Кеширование DashboardPage при переходе на другие страницы                                    |
| `onActivated` / `onDeactivated`  | Обновление данных при возврате на дашборд (onActivated)                                      |
| `requestAnimationFrame`          | Плавная анимация числовых счётчиков (баланс, расходы)                                        |
| CSS Grid                         | Сетка виджетов, responsive breakpoints                                                       |
| `shallowRef` / `shallowReactive` | Данные графиков в shallowRef — глубокая реактивность не нужна для Chart.js                   |
| Виртуальный DOM, diff-алгоритм   | Понимание оптимизаций при обновлении множества виджетов                                      |
| Static hoisting, patch flags     | Компилятор Vue оптимизирует статические части шаблонов виджетов                              |
| Flex/Grid layout, responsive     | Адаптивная сетка виджетов дашборда                                                           |

---

### Модуль 3: Транзакции

**Что делает:**

-   Полный CRUD: создание, просмотр, редактирование, удаление транзакций
-   Фильтрация по типу (доход/расход), категории, дате, сумме, счёту
-   Поиск по описанию с debounce
-   Сортировка по дате, сумме, категории
-   Группировка по дню/неделе/месяцу
-   Виртуальный скролл для больших списков (10 000+ записей)
-   Infinite scroll для постраничной загрузки

**Компоненты:**

-   `TransactionsPage` — страница с фильтрами и списком
-   `TransactionList` — виртуализированный список
-   `TransactionItem` — карточка транзакции
-   `TransactionForm` — форма создания/редактирования (Modal)
-   `TransactionFilters` — панель фильтров
-   `InfiniteScroll` — компонент подгрузки при скролле
-   `VirtualScroll` — виртуальный скролл

**Composables:**

-   `useDebounce(value, delay)` — debounced поиск
-   `useInfiniteScroll(fetchFn, options)` — подгрузка данных при скролле
-   `useIntersectionObserver(elementRef)` — определение видимости элемента-sentinel

**Store:**

-   `transactionStore` — transactions[], addTransaction(), updateTransaction(), deleteTransaction(), getters: filteredTransactions, groupedByDate, totalIncome, totalExpense

**Утилиты (shared/lib):**

-   `debounce(fn, ms)` — задержка вызова
-   `throttle(fn, ms)` — ограничение частоты вызовов
-   `groupBy(arr, key)` — группировка массива объектов по полю
-   `flatten(arr, depth)` — выравнивание вложенных массивов
-   `findUnique(arr)` — удаление дубликатов

**Темы собесов:**

| Тема                            | Где реализована                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Debounce / Throttle             | Поиск транзакций (debounce 300ms), скролл-обработчик (throttle)                   |
| `reduce()`                      | Подсчёт totalIncome, totalExpense, суммы по категориям                            |
| Мутирующие/не мутирующие методы | `sort` мутирует — используем `toSorted()` / spread; `filter`, `map` — не мутируют |
| Сортировка, `.sort()`, TimSort  | Сортировка транзакций по дате/сумме, обсуждение алгоритма                         |
| GroupBy                         | Группировка транзакций по дням/месяцам для отображения                            |
| Flatten                         | Экспорт вложенных категорий в плоский список                                      |
| findUnique                      | Получение уникальных категорий/счетов из транзакций                               |
| IntersectionObserver            | Sentinel-элемент для InfiniteScroll                                               |
| Всплытие/погружение событий     | Делегирование событий в списке транзакций (клик на элемент списка)                |
| Делегирование событий           | Один обработчик на контейнер списка вместо обработчика на каждый элемент          |
| `key` в `v-for`                 | Уникальный `transaction.id` как key, демонстрация бага с index                    |
| `v-model` на компоненте         | Двусторонняя привязка фильтров к TransactionFilters                               |
| `attrs`, fallthrough attributes | TransactionForm пробрасывает атрибуты на input-ы                                  |
| `v-once`, `v-memo`              | `v-memo` для строк виртуального скролла, которые не менялись                      |
| Big O нотация                   | O(n) фильтрация, O(n log n) сортировка, O(1) lookup по id (Map)                   |
| Стек и очередь, FIFO/LIFO       | Undo-стек для последней удалённой транзакции                                      |
| `ref` vs `reactive`             | Обсуждение потери реактивности при перезаписи reactive-объекта                    |

---

### Модуль 4: Категории

**Что делает:**

-   Иерархическое дерево категорий (расходы → еда → рестораны)
-   CRUD категорий
-   Выбор иконки и цвета
-   Drag & drop для перемещения категорий (опционально)
-   Рекурсивный компонент дерева

**Компоненты:**

-   `CategoryTree` — рекурсивный компонент дерева
-   `CategoryItem` — элемент дерева (использует сам себя для children)
-   `CategoryForm` — форма создания/редактирования
-   `CategorySelect` — выпадающий выбор с поиском (provide/inject для передачи данных)
-   `Tabs` + `Tab` — переключение "расходы / доходы" через provide/inject

**Composables:**

-   `useCategoryTree(categories)` — построение дерева из плоского массива

**Темы собесов:**

| Тема                          | Где реализована                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| Рекурсия и её опасности       | Рекурсивный рендер дерева, обсуждение stack overflow при глубокой вложенности        |
| `provide` / `inject`          | CategorySelect: provide списка категорий на верхнем уровне, inject в дочерних        |
| Реактивность provide/inject   | Передача `ref` / `computed` через provide — дочерние получают обновления             |
| Slots: default, named, scoped | CategoryItem: default slot для контента, scoped slot для actions с данными категории |
| Tabs через provide/inject     | `Tabs` provide'ит activeTab, `Tab` inject'ит и показывает/скрывает себя              |
| Прототипное наследование      | Обсуждение цепочки прототипов при работе с категориями как объектами                 |
| `[[ ]]` внутренние слоты      | Объяснение [[Prototype]] при обсуждении прототипного наследования                    |
| Hash table, bucket, коллизии  | Хранение категорий в Map для O(1) поиска по id                                       |

---

### Модуль 5: Бюджеты и лимиты

**Что делает:**

-   Установка месячных бюджетов по категориям
-   Прогресс-бары расходов vs лимитов
-   Push/SSE-уведомления при достижении 80% и 100% бюджета
-   Оповещения в реальном времени при совместном семейном бюджете

**Компоненты:**

-   `BudgetPage` — страница управления бюджетами
-   `BudgetCard` — карточка бюджета с прогрессом
-   `BudgetForm` — установка лимита
-   `NotificationToast` — toast-уведомление (Teleport в body)

**Composables:**

-   `useBudget(categoryId)` — текущий расход, лимит, процент, isOverBudget
-   `useSSE(url)` — подключение к Server-Sent Events

**Store:**

-   `budgetStore` — budgets[], setBudget(), checkLimits(), getter: budgetStatus

**Темы собесов:**

| Тема                             | Где реализована                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| SSE vs WebSocket                 | SSE для push-уведомлений о бюджете (одностороннее, сервер → клиент)                         |
| Long-polling                     | Обсуждение альтернативы SSE для бюджетных уведомлений                                       |
| Race condition                   | Одновременное добавление транзакций несколькими членами семьи — конфликт обновления бюджета |
| Параллельность vs асинхронность  | Обработка конкурентных запросов обновления бюджета                                          |
| `Promise.all` / `allSettled`     | Параллельная загрузка бюджетов всех категорий                                               |
| `Promise.race`                   | Timeout для SSE-подключения                                                                 |
| `Teleport`                       | Toast-уведомления рендерятся в `<div id="toasts">` вне основного дерева                     |
| `Transition` / `TransitionGroup` | Анимация появления/исчезновения toast-уведомлений                                           |
| Event Loop, микро/макрозадачи    | Порядок обработки: транзакция → пересчёт бюджета → уведомление                              |
| `nextTick`                       | Обновление DOM после изменения прогресс-бара бюджета                                        |

---

### Модуль 6: Мультивалютность

**Что делает:**

-   Поддержка нескольких валют (RUB, USD, EUR, и др.)
-   Реалтайм-курсы через WebSocket
-   Конвертация сумм между валютами
-   Отображение общего баланса в основной валюте
-   Retry и AbortController при запросах курсов

**Компоненты:**

-   `CurrencySelector` — выбор валюты
-   `MoneyInput` — ввод суммы с валютой (`v-model.currency` кастомный модификатор)
-   `CurrencyRates` — виджет текущих курсов (WebSocket live update)

**Composables:**

-   `useCurrency(amount, from, to)` — конвертация с реактивными курсами
-   `useWebSocket(url)` — подключение к WebSocket, автореконнект
-   `useFetchWithRetry(url, options)` — запрос с retry-логикой и AbortController

**Store:**

-   `currencyStore` — rates (Map<string, number>), baseCurrency, convert(), subscribeToRates()

**Утилиты:**

-   `fetchWithRetry(url, retries, delay)` — fetch с повторами при ошибке

**Темы собесов:**

| Тема                                | Где реализована                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------ | --- | ------------------ |
| WebSocket                           | Реалтайм-обновление курсов валют                                                            |
| WebRTC vs WebSocket                 | Обсуждение: WebSocket для данных, WebRTC для P2P (здесь не нужен)                           |
| `Map` vs объект                     | `Map<string, number>` для хранения курсов — ключи-строки, частая итерация                   |
| `WeakMap` / `WeakSet`               | Кеш конвертаций: WeakMap для привязки к объектам транзакций (GC-friendly)                   |
| `AbortController`                   | Отмена предыдущего запроса курсов при новом запросе                                         |
| `fetchWithRetry`                    | Retry при неудаче запроса к API курсов (3 попытки с exponential backoff)                    |
| CORS, preflight, OPTIONS            | API курсов на внешнем домене — CORS headers, preflight для POST                             |
| HTTP запрос: состав                 | Метод, URL, headers, body — при запросе курсов                                              |
| `async` / `await`                   | Асинхронные запросы к API курсов                                                            |
| Каррирование                        | `createConverter(baseCurrency)(amount, targetCurrency)` — каррированная функция конвертации |
| `                                   |                                                                                             | `vs`??` | `rate ?? 1` — fallback для курса (0 — валидный курс, ` |     | ` его бы отбросил) |
| Контекст, `this`, `bind/call/apply` | Привязка контекста в callback WebSocket                                                     |
| Виды функций                        | Arrow vs function declaration в обработчиках WebSocket (различие в this)                    |

---

### Модуль 7: Импорт банковских выписок

**Что делает:**

-   Загрузка CSV/XLSX файлов с банковскими выписками
-   Парсинг в Web Worker (чтобы не блокировать UI)
-   Маппинг полей выписки на поля транзакции
-   Прогресс-бар импорта
-   Обработка больших файлов через генераторы (чтение чанками)

**Компоненты:**

-   `ImportPage` / `ImportWidget` — загрузка и маппинг
-   `FileDropZone` — drag & drop зона для файлов
-   `FieldMapper` — маппинг колонок CSV на поля Transaction
-   `ImportProgress` — прогресс-бар

**Composables:**

-   `useFileReader(file)` — чтение файла через File API
-   `useWorker(workerPath)` — коммуникация с Web Worker

**Web Worker:**

-   `csv-parser.worker.ts` — парсинг CSV в отдельном потоке, отправка прогресса через postMessage

**Темы собесов:**

| Тема                         | Где реализована                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------- |
| Web Worker                   | Парсинг CSV в фоновом потоке, postMessage / onmessage                           |
| Service Worker vs Web Worker | Обсуждение разницы: Worker для вычислений, SW для кеширования/оффлайна          |
| Генераторы (function\*)      | Чтение большого CSV чанками: `function* readChunks(file, chunkSize)`            |
| File API                     | `FileReader`, `File`, `Blob`, drag & drop                                       |
| Сборщик мусора, GC           | Освобождение памяти после парсинга большого файла                               |
| Ссылочные типы               | Обсуждение: почему нельзя передать объект в Worker по ссылке (structured clone) |
| Клонирование объектов        | structuredClone для передачи данных между main thread и worker                  |
| Stack vs Heap                | Примитивы (числа из CSV) на стеке, объекты транзакций на куче                   |

---

### Модуль 8: PWA и оффлайн-режим

**Что делает:**

-   Установка приложения на устройство (PWA manifest)
-   Кеширование static assets через Service Worker
-   Оффлайн-работа: создание транзакций без сети
-   Background sync: отправка данных при восстановлении сети
-   Синхронизация данных через IndexedDB

**Конфигурация:**

-   `vite-plugin-pwa` — генерация SW, manifest, precaching
-   Стратегии кеширования: CacheFirst для assets, NetworkFirst для API

**Composables:**

-   `useOfflineSync()` — очередь оффлайн-операций, синхронизация при reconnect
-   `useNetworkStatus()` — отслеживание online/offline

**Темы собесов:**

| Тема                         | Где реализована                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| Service Worker               | Кеширование, перехват запросов, background sync                                            |
| PWA vs SPA                   | FinTrack — и SPA, и PWA; обсуждение отличий                                                |
| Хранение данных на фронте    | IndexedDB для оффлайн-транзакций, localStorage для настроек, sessionStorage для temp state |
| Web API                      | Service Worker API, Cache API, IndexedDB API, Navigator.onLine                             |
| Shadow DOM                   | Обсуждение: в контексте Web Components vs Vue компонентов                                  |
| `useLocalStorage` composable | Синхронизация настроек с localStorage                                                      |
| Что происходит при вводе URL | Полный цикл: DNS → TCP → HTTPS → HTML → рендер + SW перехват                               |

---

### Модуль 9: Отчёты и экспорт

**Что делает:**

-   Генерация отчётов: расходы по категориям, тренды, сравнение периодов
-   Интерактивные графики (ECharts)
-   Экспорт в PDF и CSV
-   Генерация отчётов в idle time через `requestIdleCallback`

**Компоненты:**

-   `ReportsPage` — страница отчётов
-   `PeriodSelector` — выбор периода
-   `ReportChart` — обёртка для ECharts
-   `ExportButton` — экспорт в PDF/CSV

**Composables:**

-   `useIdleTask(taskFn)` — выполнение тяжёлых вычислений в requestIdleCallback

**Утилиты:**

-   `deepClone(obj)` — глубокое клонирование (structuredClone + ручная обработка Date/Map/Set)
-   `exportToCSV(data, columns)` — генерация CSV
-   `exportToPDF(reportData)` — генерация PDF

**Темы собесов:**

| Тема                                             | Где реализована                                                                         |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `requestIdleCallback`                            | Предварительная генерация отчётов в свободное время браузера                            |
| `requestAnimationFrame` vs `requestIdleCallback` | rAF — анимации графиков, rIC — фоновые вычисления отчётов                               |
| Deep clone                                       | Клонирование данных отчёта перед мутацией для экспорта                                  |
| Способы клонирования                             | structuredClone, JSON.parse/stringify, spread (shallow), ручная рекурсия — плюсы/минусы |
| Оптимизация FCP, LCP, CLS                        | Lazy-загрузка графиков (LCP), skeleton placeholders (CLS), code splitting (FCP)         |
| Lighthouse, Performance, Network                 | Профилирование рендера графиков, анализ размера бандла                                  |
| Layout, paint, compositing                       | Обсуждение стадий рендера при отрисовке графиков                                        |
| Рендер после получения HTML                      | DOM → CSSOM → Render Tree → Layout → Paint → Composite                                  |
| Render-функция и `h()`                           | Динамическая генерация графиков через render function когда шаблон неудобен             |

---

### Модуль 10: Настройки и UI-kit

**Что делает:**

-   Настройки пользователя: основная валюта, язык, тема (светлая/тёмная)
-   UI-kit: набор переиспользуемых компонентов
-   Кастомные директивы
-   Vue-плагины

**Компоненты UI-kit:**

| Компонент            | Механика                                                                     | Тема собесов                               |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| `AppModal`           | `<Teleport to="body">` + `v-model` + slots (header/body/footer) + Transition | Teleport, v-model, slots, Transition       |
| `AppTabs` + `AppTab` | `provide(activeTab)` / `inject(activeTab)`                                   | provide/inject, slots                      |
| `InfiniteScroll`     | IntersectionObserver на sentinel                                             | IntersectionObserver, composable           |
| `VirtualScroll`      | Рендер только видимых элементов, `v-memo`                                    | v-memo, requestAnimationFrame, оптимизация |
| `InputMoney`         | `v-model.currency` — кастомный модификатор форматирует число                 | v-model модификаторы, defineModel          |
| `LazyImg`            | Директива `v-lazy-img` через IntersectionObserver                            | Кастомные директивы, IntersectionObserver  |
| `AppButton`          | Проксирование attrs, disabled state                                          | attrs, fallthrough attributes              |
| `AppInput`           | Обёртка `<input>` с проксированием всех атрибутов и событий                  | useAttrs, inheritAttrs: false              |
| `AppToast`           | Teleport + TransitionGroup                                                   | Teleport, TransitionGroup, плагин          |

**Кастомные директивы:**

-   `v-lazy-img` — ленивая загрузка изображений (IntersectionObserver)
-   `v-click-outside` — клик вне элемента (закрытие dropdown/modal)
-   `v-focus` — автофокус при монтировании
-   Хуки директив: `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`

**Vue-плагины:**

-   `toastPlugin` — `app.config.globalProperties.$toast`, provide/inject для composable
-   `analyticsPlugin` — отслеживание навигации

**Темы собесов:**

| Тема                             | Где реализована                                      |
| -------------------------------- | ---------------------------------------------------- |
| Кастомные директивы, хуки        | v-lazy-img, v-click-outside, v-focus                 |
| Vue-плагины, `app.use()`         | toastPlugin, analyticsPlugin                         |
| `v-model` с модификатором        | InputMoney: `.currency` модификатор форматирует ввод |
| `defineModel`                    | Упрощённый v-model в InputMoney и AppInput           |
| `Teleport`                       | Modal и Toast рендерятся вне основного дерева        |
| `Transition` / `TransitionGroup` | Анимации Modal, Toast, переключение табов            |
| Центрирование элементов          | Модальное окно — центрирование через flex            |
| Sticky header/footer             | AppHeader — `position: sticky; top: 0`               |
| Карточки в сетке                 | Grid layout карточек транзакций и бюджетов           |
| BEM                              | Все компоненты: `block__element--modifier`           |
| Flex/Grid, responsive            | Адаптивная верстка всех компонентов UI-kit           |
| `ResizeObserver`                 | Адаптация layout виджетов под контейнер              |

---

## 5. Модели данных (TypeScript)

> **Темы собесов:** interface vs type, generics, utility types, enum, any/unknown/never, extends, keyof/typeof

```typescript
// ====== Базовые типы ======

/** Discriminated union для типа транзакции */
type TransactionType = 'income' | 'expense' | 'transfer';

/** Enum для периодов (компилируется в объект) */
enum Period {
	Day = 'day',
	Week = 'week',
	Month = 'month',
	Year = 'year',
}

/** Enum для валют */
enum Currency {
	RUB = 'RUB',
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
	CNY = 'CNY',
}

// ====== Интерфейсы сущностей ======

interface BaseEntity {
	id: string;
	createdAt: string; // ISO 8601
	updatedAt: string;
}

interface User extends BaseEntity {
	email: string;
	name: string;
	baseCurrency: Currency;
	settings: UserSettings;
}

interface UserSettings {
	theme: 'light' | 'dark';
	locale: 'ru' | 'en';
	notifications: boolean;
}

interface Transaction extends BaseEntity {
	type: TransactionType;
	amount: number;
	currency: Currency;
	categoryId: string;
	accountId: string;
	description: string;
	date: string; // ISO 8601
	tags: string[];
	/** ID целевого счёта для type === 'transfer' */
	toAccountId?: string;
}

interface Account extends BaseEntity {
	name: string;
	type: 'cash' | 'card' | 'savings' | 'investment';
	currency: Currency;
	balance: number;
	icon: string;
	color: string;
}

interface Category extends BaseEntity {
	name: string;
	type: 'income' | 'expense';
	icon: string;
	color: string;
	parentId: string | null;
	children?: Category[]; // Для дерева
}

interface Budget extends BaseEntity {
	categoryId: string;
	amount: number;
	currency: Currency;
	period: Period;
	spent: number; // Вычисляется
}

interface CurrencyRate {
	from: Currency;
	to: Currency;
	rate: number;
	updatedAt: string;
}

// ====== Generics и Utility Types ======

/** Generic API response */
interface ApiResponse<T> {
	data: T;
	status: number;
	message?: string;
}

/** Paginated response */
interface PaginatedResponse<T> extends ApiResponse<T[]> {
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

/** Generic для создания сущности (без id и timestamps) */
type CreateDTO<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/** Generic для обновления (все поля опциональны, кроме id) */
type UpdateDTO<T extends BaseEntity> = Partial<Omit<T, 'id'>> & Pick<T, 'id'>;

/** Типизация ключей для сортировки */
type SortableKeys<T> = {
	[K in keyof T]: T[K] extends string | number | Date ? K : never;
}[keyof T];

/** Кастомный Readonly (как реализовать свой utility type) */
type DeepReadonly<T> = {
	readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/** Типизация getValueByKey с дженериками */
function getValueByKey<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key];
}

/** Discriminated union для фильтров */
type TransactionFilter =
	| { type: 'byCategory'; categoryId: string }
	| { type: 'byDateRange'; from: string; to: string }
	| { type: 'byAmount'; min: number; max: number }
	| { type: 'byAccount'; accountId: string };

// Использование `unknown` вместо `any` для безопасного API
function parseApiResponse(raw: unknown): Transaction {
	if (typeof raw !== 'object' || raw === null) {
		throw new Error('Invalid response');
	}
	// Type narrowing через проверки...
	return raw as Transaction;
}

// `never` — для exhaustive check
function assertNever(value: never): never {
	throw new Error(`Unexpected value: ${value}`);
}

function handleFilter(filter: TransactionFilter) {
	switch (filter.type) {
		case 'byCategory':
			return; /* ... */
		case 'byDateRange':
			return; /* ... */
		case 'byAmount':
			return; /* ... */
		case 'byAccount':
			return; /* ... */
		default:
			return assertNever(filter); // TS ошибка если забыли case
	}
}
```

**Покрытие тем TypeScript:**

| Тема                          | Где                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `interface` vs `type`         | interface для сущностей (extends), type для unions и mapped types             |
| Enum, компиляция              | `Period`, `Currency` — компилируются в объект с reverse mapping               |
| `type`/`interface` компиляция | Стираются при компиляции, остаются только runtime-значения                    |
| `any` vs `unknown` vs `never` | `unknown` для API response, `never` для exhaustive check, `any` — антипаттерн |
| Generics                      | `ApiResponse<T>`, `CreateDTO<T>`, `PaginatedResponse<T>`                      |
| `extends`                     | `BaseEntity` наследование + constraint в generic (`T extends BaseEntity`)     |
| `keyof` / `typeof`            | `SortableKeys<T>` использует keyof, typeof для вывода типов из runtime        |
| Utility Types                 | `Omit`, `Partial`, `Pick`, `Readonly`, `Record` + кастомные                   |
| `as`                          | Только после type narrowing, не для подавления ошибок                         |
| Discriminated unions          | `TransactionFilter` — union с общим полем `type`                              |

---

## 6. Маршрутизация (Vue Router)

> **Темы собесов:** hash vs history, guards, lazy loading, params vs query, nested routes, router.push vs replace

```typescript
// app/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/entities/user/model/authStore';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/auth',
		name: 'Auth',
		component: () => import('@/pages/AuthPage/AuthPage.vue'),
		meta: { requiresGuest: true, title: 'Вход' },
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: () => import('@/pages/DashboardPage/DashboardPage.vue'),
		meta: { requiresAuth: true, title: 'Дашборд' },
	},
	{
		path: '/transactions',
		name: 'Transactions',
		component: () => import('@/pages/TransactionsPage/TransactionsPage.vue'),
		meta: { requiresAuth: true, title: 'Транзакции' },
		children: [
			{
				path: ':id',
				name: 'TransactionDetail',
				component: () => import('@/pages/TransactionsPage/TransactionDetail.vue'),
				props: true, // params как props
			},
		],
	},
	{
		path: '/budget',
		name: 'Budget',
		component: () => import('@/pages/BudgetPage/BudgetPage.vue'),
		meta: { requiresAuth: true, title: 'Бюджеты' },
	},
	{
		path: '/reports',
		name: 'Reports',
		component: () => import('@/pages/ReportsPage/ReportsPage.vue'),
		meta: { requiresAuth: true, title: 'Отчёты', requiresPremium: true },
		children: [
			{
				path: ':period', // /reports/month, /reports/year
				name: 'ReportsByPeriod',
				component: () => import('@/pages/ReportsPage/ReportsByPeriod.vue'),
				props: true,
			},
		],
	},
	{
		path: '/settings',
		name: 'Settings',
		component: () => import('@/pages/SettingsPage/SettingsPage.vue'),
		meta: { requiresAuth: true, title: 'Настройки' },
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('@/pages/NotFoundPage/NotFoundPage.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(), // history mode, не hash
	routes,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { top: 0 };
	},
});

// ====== Global Guards ======

// Guard: проверка авторизации
router.beforeEach((to, from) => {
	const authStore = useAuthStore();

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		return {
			name: 'Auth',
			query: { redirect: to.fullPath }, // query для редиректа после логина
		};
	}

	if (to.meta.requiresGuest && authStore.isAuthenticated) {
		return { name: 'Dashboard' }; // Уже залогинен — на дашборд
	}

	if (to.meta.requiresPremium && !authStore.user?.isPremium) {
		return { name: 'Settings' }; // Нет подписки — в настройки
	}
});

// Guard: обновление title
router.afterEach((to) => {
	document.title = `${to.meta.title || 'FinTrack'} — FinTrack`;
});

export default router;
```

**Breadcrumbs** через `route.matched`:

```vue
<!-- widgets/Breadcrumbs/Breadcrumbs.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const breadcrumbs = computed(() =>
	route.matched
		.filter((r) => r.meta.title)
		.map((r) => ({
			title: r.meta.title as string,
			path: r.path,
		})),
);
</script>
```

**Покрытие тем:**

| Тема                                                | Где                                                                               |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| Hash vs history mode                                | `createWebHistory()` — history mode, обсуждение hash mode                         |
| Navigation guards (global, per-route, in-component) | `beforeEach` глобальный, `beforeEnter` для premium, `onBeforeRouteLeave` в формах |
| Lazy loading роутов                                 | `() => import(...)` для всех страниц                                              |
| `params` vs `query`                                 | params: `/transactions/:id`, query: `?redirect=/dashboard`                        |
| Nested routes                                       | `/transactions/:id`, `/reports/:period`                                           |
| Авторизация и защита роутов                         | `meta.requiresAuth`, guard с редиректом                                           |
| `router.push` vs `router.replace`                   | push для навигации, replace после логина (убрать /auth из history)                |
| Breadcrumbs через route.matched                     | Компонент использует matched + meta.title                                         |

---

## 7. Pinia Stores

> **Темы собесов:** Pinia vs Vuex, state/getters/actions, storeToRefs, inter-store, плагины, тестирование, Flux

### Transaction Store (Setup Store)

```typescript
// entities/transaction/model/transactionStore.ts

import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useAccountStore } from '@/entities/account/model/accountStore';
import { useBudgetStore } from '@/entities/budget/model/budgetStore';
import type { Transaction, CreateDTO, TransactionFilter } from '@/shared/types';
import { transactionApi } from '../api';
import { groupBy } from '@/shared/lib/groupBy';

export const useTransactionStore = defineStore('transaction', () => {
	// ====== State ======
	const transactions = ref<Transaction[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const filters = ref<TransactionFilter[]>([]);

	// ====== Getters (computed) ======
	const totalIncome = computed(() =>
		transactions.value.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
	);

	const totalExpense = computed(() =>
		transactions.value
			.filter((t) => t.type === 'expense')
			.reduce((sum, t) => sum + t.amount, 0),
	);

	const groupedByDate = computed(() =>
		groupBy(
			transactions.value,
			(t) => t.date.slice(0, 10), // YYYY-MM-DD
		),
	);

	const filteredTransactions = computed(() => {
		// Применение фильтров...
		return transactions.value;
	});

	// ====== Actions ======
	async function fetchTransactions() {
		isLoading.value = true;
		error.value = null;
		try {
			const response = await transactionApi.getAll();
			transactions.value = response.data;
		} catch (e) {
			error.value = (e as Error).message;
		} finally {
			isLoading.value = false;
		}
	}

	async function addTransaction(dto: CreateDTO<Transaction>) {
		const response = await transactionApi.create(dto);
		transactions.value.push(response.data);

		// Inter-store communication: обновить баланс счёта и бюджет
		const accountStore = useAccountStore();
		accountStore.updateBalance(dto.accountId, dto.type === 'income' ? dto.amount : -dto.amount);

		const budgetStore = useBudgetStore();
		if (dto.type === 'expense') {
			budgetStore.addSpent(dto.categoryId, dto.amount);
		}
	}

	async function deleteTransaction(id: string) {
		await transactionApi.delete(id);
		const index = transactions.value.findIndex((t) => t.id === id);
		if (index !== -1) {
			transactions.value.splice(index, 1);
		}
	}

	return {
		// State
		transactions,
		isLoading,
		error,
		filters,
		// Getters
		totalIncome,
		totalExpense,
		groupedByDate,
		filteredTransactions,
		// Actions
		fetchTransactions,
		addTransaction,
		deleteTransaction,
	};
});
```

### Плагин логирования мутаций

```typescript
// app/plugins/piniaLogger.ts

import type { PiniaPlugin } from 'pinia';

export const piniaLoggerPlugin: PiniaPlugin = ({ store }) => {
	store.$subscribe((mutation, state) => {
		console.groupCollapsed(`[Pinia] ${store.$id} — ${mutation.type}`);
		console.log('Event:', mutation.events);
		console.log('State:', JSON.parse(JSON.stringify(state)));
		console.groupEnd();
	});
};

// Подключение:
// const pinia = createPinia()
// pinia.use(piniaLoggerPlugin)
```

### Использование `storeToRefs`

```vue
<script setup lang="ts">
import { useTransactionStore } from '@/entities/transaction/model/transactionStore';
import { storeToRefs } from 'pinia';

const store = useTransactionStore();

// storeToRefs — деструктуризация ТОЛЬКО state и getters с сохранением реактивности
const { transactions, totalIncome, totalExpense, isLoading } = storeToRefs(store);
// БЕЗ storeToRefs: const { transactions } = store — теряет реактивность!

// Actions деструктурируем напрямую (они не реактивные)
const { fetchTransactions, addTransaction, deleteTransaction } = store;
</script>
```

**Покрытие тем:**

| Тема                        | Где                                                                    |
| --------------------------- | ---------------------------------------------------------------------- |
| Pinia vs Vuex               | Используем Pinia — нет mutations, лучше TS, модульность из коробки     |
| State, getters, actions     | Полная демонстрация в transactionStore                                 |
| Option store vs Setup store | transactionStore — setup store, authStore — option store для сравнения |
| `storeToRefs`               | Деструктуризация с сохранением реактивности                            |
| Inter-store communication   | addTransaction вызывает accountStore и budgetStore                     |
| Плагины Pinia               | piniaLoggerPlugin — логирование всех мутаций                           |
| Тестирование stores         | Vitest + createTestingPinia (см. раздел Тестирование)                  |
| Flux-архитектура            | Action → State mutation → Getter (computed) → View                     |

---

## 8. Composables (практические задачи с собесов)

> **Темы собесов:** composables vs mixins, Composition API, ref, reactive, watch, watchEffect, lifecycle hooks, effectScope

### `useDebounce`

```typescript
// shared/composables/useDebounce.ts

import { ref, watch, type Ref } from 'vue';

export function useDebounce<T>(value: Ref<T>, delay: number = 300): Ref<T> {
	const debouncedValue = ref(value.value) as Ref<T>;
	let timeout: ReturnType<typeof setTimeout>;

	watch(value, (newVal) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			debouncedValue.value = newVal;
		}, delay);
	});

	return debouncedValue;
}
```

### `useFetch`

```typescript
// shared/composables/useFetch.ts

import { ref, watch, toValue, type Ref, type MaybeRefOrGetter } from 'vue';

interface UseFetchReturn<T> {
	data: Ref<T | null>;
	error: Ref<string | null>;
	loading: Ref<boolean>;
	refetch: () => Promise<void>;
}

export function useFetch<T>(url: MaybeRefOrGetter<string>): UseFetchReturn<T> {
	const data = ref<T | null>(null) as Ref<T | null>;
	const error = ref<string | null>(null);
	const loading = ref(false);
	let abortController: AbortController | null = null;

	async function fetchData() {
		// Отмена предыдущего запроса
		abortController?.abort();
		abortController = new AbortController();

		loading.value = true;
		error.value = null;

		try {
			const response = await fetch(toValue(url), {
				signal: abortController.signal,
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			data.value = await response.json();
		} catch (e) {
			if ((e as Error).name !== 'AbortError') {
				error.value = (e as Error).message;
			}
		} finally {
			loading.value = false;
		}
	}

	// watchEffect — автоподписка на url
	watch(() => toValue(url), fetchData, { immediate: true });

	return { data, error, loading, refetch: fetchData };
}
```

### `useLocalStorage`

```typescript
// shared/composables/useLocalStorage.ts

import { ref, watch, type Ref } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
	const stored = localStorage.getItem(key);
	const value = ref<T>(stored ? JSON.parse(stored) : defaultValue) as Ref<T>;

	// Запись в localStorage при изменении
	watch(
		value,
		(newVal) => {
			localStorage.setItem(key, JSON.stringify(newVal));
		},
		{ deep: true },
	);

	// Синхронизация между вкладками
	window.addEventListener('storage', (event) => {
		if (event.key === key && event.newValue) {
			value.value = JSON.parse(event.newValue);
		}
	});

	return value;
}
```

### `useClickOutside`

```typescript
// shared/composables/useClickOutside.ts

import { onMounted, onBeforeUnmount, type Ref } from 'vue';

export function useClickOutside(elementRef: Ref<HTMLElement | null>, callback: () => void) {
	function handler(event: MouseEvent) {
		if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
			callback();
		}
	}

	onMounted(() => document.addEventListener('click', handler));
	onBeforeUnmount(() => document.removeEventListener('click', handler));
}
```

### `useIntersectionObserver`

```typescript
// shared/composables/useIntersectionObserver.ts

import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';

export function useIntersectionObserver(
	elementRef: Ref<HTMLElement | null>,
	options?: IntersectionObserverInit,
) {
	const isVisible = ref(false);
	let observer: IntersectionObserver | null = null;

	onMounted(() => {
		if (!elementRef.value) return;

		observer = new IntersectionObserver(([entry]) => {
			isVisible.value = entry.isIntersecting;
		}, options);

		observer.observe(elementRef.value);
	});

	onBeforeUnmount(() => observer?.disconnect());

	return { isVisible };
}
```

### `useCurrency`

```typescript
// features/currency-convert/composables/useCurrency.ts

import { computed, type Ref } from 'vue';
import { useCurrencyStore } from '@/entities/currency/model/currencyStore';
import { storeToRefs } from 'pinia';
import type { Currency } from '@/shared/types';

export function useCurrency(amount: Ref<number>, from: Ref<Currency>, to: Ref<Currency>) {
	const store = useCurrencyStore();
	const { rates } = storeToRefs(store);

	const convertedAmount = computed(() => {
		return store.convert(amount.value, from.value, to.value);
	});

	const rate = computed(() => {
		return rates.value.get(`${from.value}_${to.value}`) ?? null;
	});

	return { convertedAmount, rate };
}
```

### `useBudget`

```typescript
// features/set-budget/composables/useBudget.ts

import { computed, type Ref } from 'vue';
import { useBudgetStore } from '@/entities/budget/model/budgetStore';
import { storeToRefs } from 'pinia';

export function useBudget(categoryId: Ref<string>) {
	const store = useBudgetStore();
	const { budgets } = storeToRefs(store);

	const budget = computed(() => budgets.value.find((b) => b.categoryId === categoryId.value));

	const spent = computed(() => budget.value?.spent ?? 0);
	const limit = computed(() => budget.value?.amount ?? 0);
	const percentage = computed(() =>
		limit.value > 0 ? Math.round((spent.value / limit.value) * 100) : 0,
	);
	const isOverBudget = computed(() => percentage.value >= 100);

	return { budget, spent, limit, percentage, isOverBudget };
}
```

### `useOfflineSync`

```typescript
// features/offline-sync/composables/useOfflineSync.ts

import { ref, onMounted } from 'vue';

interface PendingAction {
	id: string;
	type: 'create' | 'update' | 'delete';
	entity: string;
	payload: unknown;
	timestamp: number;
}

export function useOfflineSync() {
	const isOnline = ref(navigator.onLine);
	const pendingActions = ref<PendingAction[]>([]);

	function addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>) {
		pendingActions.value.push({
			...action,
			id: crypto.randomUUID(),
			timestamp: Date.now(),
		});
		// Сохранить в IndexedDB
		savePendingToIDB(pendingActions.value);
	}

	async function syncPendingActions() {
		if (!isOnline.value || pendingActions.value.length === 0) return;

		for (const action of pendingActions.value) {
			try {
				await sendToServer(action);
				pendingActions.value = pendingActions.value.filter((a) => a.id !== action.id);
			} catch {
				break; // Прекращаем при ошибке
			}
		}
		await savePendingToIDB(pendingActions.value);
	}

	onMounted(() => {
		window.addEventListener('online', () => {
			isOnline.value = true;
			syncPendingActions();
		});
		window.addEventListener('offline', () => {
			isOnline.value = false;
		});
		loadPendingFromIDB().then((actions) => {
			pendingActions.value = actions;
		});
	});

	return { isOnline, pendingActions, addPendingAction, syncPendingActions };
}

// Заглушки для IndexedDB/API
async function savePendingToIDB(_actions: PendingAction[]) {
	/* IndexedDB put */
}
async function loadPendingFromIDB(): Promise<PendingAction[]> {
	return []; /* IndexedDB getAll */
}
async function sendToServer(_action: PendingAction) {
	/* API call */
}
```

**Покрытие тем composables:**

| Тема                                     | Где                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| Composables vs mixins                    | Все повторяемая логика — через composables, не mixins                     |
| `ref` vs `reactive`, потеря реактивности | Обсуждение в каждом composable                                            |
| `watch` vs `watchEffect`                 | `watch` в useDebounce/useFetch, `watchEffect` — автоподписка              |
| Lifecycle hooks                          | `onMounted`, `onBeforeUnmount` в useClickOutside, useIntersectionObserver |
| `effectScope`                            | Группировка эффектов в composables, автоматическая очистка                |
| `toRef`, `toRefs`, `toRaw`, `unref`      | Использование в composables для нормализации входных параметров           |
| `triggerRef`                             | Принудительное обновление shallowRef при мутации вложенных данных         |

---

## 9. UI-компоненты (практические задачи с собесов)

### `AppModal`

```vue
<!-- shared/ui/Modal/AppModal.vue -->
<script setup lang="ts">
defineProps<{
	title?: string;
}>();

const modelValue = defineModel<boolean>({ required: true });

function close() {
	modelValue.value = false;
}
</script>

<template>
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="modelValue" class="modal-overlay" @click.self="close">
				<div class="modal" role="dialog" aria-modal="true">
					<header class="modal__header">
						<slot name="header">
							<h2>{{ title }}</h2>
						</slot>
						<button class="modal__close" @click="close">&times;</button>
					</header>
					<div class="modal__body">
						<slot />
					</div>
					<footer v-if="$slots.footer" class="modal__footer">
						<slot name="footer" />
					</footer>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
	position: fixed;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
}

.modal {
	background: var(--bg-primary);
	border-radius: 12px;
	max-width: 500px;
	width: 90%;
	max-height: 90vh;
	overflow-y: auto;

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 24px;
		border-bottom: 1px solid var(--border-color);
	}

	&__body {
		padding: 24px;
	}

	&__footer {
		padding: 16px 24px;
		border-top: 1px solid var(--border-color);
		display: flex;
		justify-content: flex-end;
		gap: 8px;
	}

	&__close {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
	}
}

.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}
</style>
```

### `AppTabs` + `AppTab`

```vue
<!-- shared/ui/Tabs/AppTabs.vue -->
<script setup lang="ts">
import { provide, ref, type InjectionKey, type Ref } from 'vue';

export const ActiveTabKey: InjectionKey<Ref<string>> = Symbol('activeTab');

const props = defineProps<{
	tabs: { id: string; label: string }[];
	defaultTab?: string;
}>();

const activeTab = ref(props.defaultTab ?? props.tabs[0]?.id ?? '');

provide(ActiveTabKey, activeTab);
</script>

<template>
	<div class="tabs">
		<div class="tabs__header">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				:class="['tabs__btn', { 'tabs__btn--active': activeTab === tab.id }]"
				@click="activeTab = tab.id"
			>
				{{ tab.label }}
			</button>
		</div>
		<div class="tabs__content">
			<slot />
		</div>
	</div>
</template>
```

```vue
<!-- shared/ui/Tabs/AppTab.vue -->
<script setup lang="ts">
import { inject } from 'vue';
import { ActiveTabKey } from './AppTabs.vue';

const props = defineProps<{
	id: string;
}>();

const activeTab = inject(ActiveTabKey);
</script>

<template>
	<div v-if="activeTab === id" class="tab">
		<slot />
	</div>
</template>
```

### `InfiniteScroll`

```vue
<!-- shared/ui/InfiniteScroll/InfiniteScroll.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useIntersectionObserver } from '@/shared/composables/useIntersectionObserver';

const props = defineProps<{
	loading: boolean;
	hasMore: boolean;
}>();

const emit = defineEmits<{
	loadMore: [];
}>();

const sentinel = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(sentinel, {
	rootMargin: '200px',
});

watch(isVisible, (visible) => {
	if (visible && !props.loading && props.hasMore) {
		emit('loadMore');
	}
});
</script>

<template>
	<div class="infinite-scroll">
		<slot />
		<div ref="sentinel" class="infinite-scroll__sentinel" />
		<div v-if="loading" class="infinite-scroll__loader">
			<slot name="loader">Загрузка...</slot>
		</div>
	</div>
</template>
```

### `InputMoney` (v-model с кастомным модификатором)

```vue
<!-- shared/ui/InputMoney/InputMoney.vue -->
<script setup lang="ts">
import type { Currency } from '@/shared/types';

const props = defineProps<{
	currency?: Currency;
}>();

const [model, modifiers] = defineModel<number>({
	set(value) {
		// Кастомный модификатор .currency — форматирование числа
		if (modifiers.currency && typeof value === 'number') {
			return Math.round(value * 100) / 100; // 2 знака после запятой
		}
		return value;
	},
});

function onInput(event: Event) {
	const raw = (event.target as HTMLInputElement).value.replace(/[^\d.,]/g, '');
	const num = parseFloat(raw.replace(',', '.'));
	if (!isNaN(num)) {
		model.value = num;
	}
}
</script>

<template>
	<div class="input-money">
		<input
			type="text"
			:value="model?.toLocaleString('ru-RU', { minimumFractionDigits: 2 })"
			@input="onInput"
			class="input-money__field"
			inputmode="decimal"
		/>
		<span v-if="currency" class="input-money__currency">{{ currency }}</span>
	</div>
</template>
```

### Директива `v-lazy-img`

```typescript
// shared/directives/vLazyImg.ts

import type { Directive } from 'vue';

export const vLazyImg: Directive<HTMLImageElement, string> = {
	mounted(el, binding) {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					el.src = binding.value;
					el.onload = () => el.classList.add('lazy-img--loaded');
					observer.unobserve(el);
				}
			},
			{ rootMargin: '100px' },
		);

		observer.observe(el);

		// Сохраняем observer для очистки
		(el as any).__lazyObserver = observer;
	},

	updated(el, binding) {
		if (binding.value !== binding.oldValue) {
			el.src = binding.value;
		}
	},

	unmounted(el) {
		(el as any).__lazyObserver?.disconnect();
	},
};

// Использование: <img v-lazy-img="imageUrl" />
```

---

## 10. CSS / Верстка

> **Темы собесов:** BEM, Flex/Grid, responsive, sticky, центрирование, порядок селекторов

### BEM-нейминг

Все компоненты следуют BEM-методологии:

```scss
// Блок
.transaction-card { ... }

// Элемент
.transaction-card__amount { ... }
.transaction-card__category { ... }
.transaction-card__date { ... }

// Модификатор
.transaction-card--income { ... }
.transaction-card--expense { ... }
.transaction-card--selected { ... }
```

### Сетка дашборда (CSS Grid + responsive)

```scss
.dashboard-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 16px;
	padding: 24px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		padding: 16px;
	}
}
```

### Sticky header

```scss
.app-header {
	position: sticky;
	top: 0;
	z-index: 100;
	background: var(--bg-primary);
	border-bottom: 1px solid var(--border-color);
	backdrop-filter: blur(8px);
}
```

### Центрирование модального окна

```scss
.modal-overlay {
	display: flex;
	align-items: center;
	justify-content: center;
	// Альтернативы для обсуждения:
	// 1. position: absolute + transform
	// 2. grid + place-items: center
	// 3. margin: auto в flex/grid
}
```

### Карточки в сетке

```scss
.budget-cards {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 16px;
}

.budget-card {
	display: flex;
	flex-direction: column;
	padding: 16px;
	border-radius: 8px;
	background: var(--bg-card);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Порядок (специфичность) селекторов

```
Inline style (1000) > ID (100) > Class/Pseudo-class/Attribute (10) > Element/Pseudo-element (1)

!important > inline > #id > .class > tag
```

---

## 11. Тестирование

> **Темы собесов:** unit, integration, e2e тесты

### Unit-тесты (Vitest)

**Утилиты:**

```typescript
// shared/lib/__tests__/groupBy.test.ts
import { describe, it, expect } from 'vitest';
import { groupBy } from '../groupBy';

describe('groupBy', () => {
	it('groups array by key', () => {
		const items = [
			{ type: 'income', amount: 100 },
			{ type: 'expense', amount: 50 },
			{ type: 'income', amount: 200 },
		];

		const result = groupBy(items, (item) => item.type);

		expect(result.get('income')).toHaveLength(2);
		expect(result.get('expense')).toHaveLength(1);
	});

	it('returns empty map for empty array', () => {
		expect(groupBy([], () => '')).toEqual(new Map());
	});
});
```

**Composables:**

```typescript
// shared/composables/__tests__/useDebounce.test.ts
import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
	it('debounces value updates', async () => {
		vi.useFakeTimers();

		const source = ref('initial');
		const debounced = useDebounce(source, 300);

		expect(debounced.value).toBe('initial');

		source.value = 'updated';
		await nextTick();
		expect(debounced.value).toBe('initial'); // Ещё не обновилось

		vi.advanceTimersByTime(300);
		await nextTick();
		expect(debounced.value).toBe('updated'); // Теперь обновилось

		vi.useRealTimers();
	});
});
```

**Stores (с createTestingPinia):**

```typescript
// entities/transaction/__tests__/transactionStore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '../model/transactionStore';

describe('transactionStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('calculates totalIncome correctly', () => {
		const store = useTransactionStore();
		store.transactions = [
			{ id: '1', type: 'income', amount: 1000 },
			{ id: '2', type: 'expense', amount: 500 },
			{ id: '3', type: 'income', amount: 2000 },
		] as any;

		expect(store.totalIncome).toBe(3000);
	});

	it('calculates totalExpense correctly', () => {
		const store = useTransactionStore();
		store.transactions = [
			{ id: '1', type: 'expense', amount: 500 },
			{ id: '2', type: 'expense', amount: 300 },
		] as any;

		expect(store.totalExpense).toBe(800);
	});
});
```

### Integration-тесты

```typescript
// features/add-transaction/__tests__/integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '@/entities/transaction/model/transactionStore';
import { useBudgetStore } from '@/entities/budget/model/budgetStore';

// Store + Store + API integration
describe('add-transaction integration', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('updates budget when expense is added', async () => {
		const transactionStore = useTransactionStore();
		const budgetStore = useBudgetStore();

		// Setup budget
		budgetStore.budgets = [{ categoryId: 'food', amount: 10000, spent: 0 }] as any;

		// Mock API
		vi.spyOn(transactionStore, 'addTransaction').mockImplementation(async (dto) => {
			budgetStore.addSpent(dto.categoryId, dto.amount);
		});

		await transactionStore.addTransaction({
			type: 'expense',
			amount: 500,
			categoryId: 'food',
			accountId: 'main',
		} as any);

		expect(budgetStore.budgets[0].spent).toBe(500);
	});
});
```

### E2E-тесты (сценарии)

```
1. Флоу авторизации:
   - Открыть /dashboard → редирект на /auth
   - Заполнить форму → логин → редирект на /dashboard
   - Refresh → остаёмся на /dashboard (token refresh)
   - Logout → редирект на /auth

2. CRUD транзакции:
   - Создать транзакцию → появляется в списке
   - Отредактировать → данные обновились
   - Удалить → исчезает из списка
   - Баланс счёта обновляется корректно

3. Бюджет:
   - Установить лимит 10000₽ на еду
   - Добавить расход 8000₽ → прогресс 80%, уведомление
   - Добавить расход 3000₽ → прогресс 110%, уведомление "превышен"
```

---

## 12. DevOps

> **Темы собесов:** Docker, nginx, CI/CD, Git Flow

### Dockerfile

```dockerfile
# Сборка
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback — все роуты на index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кеширование статики
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

jobs:
    lint-and-test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: npm
            - run: npm ci
            - run: npm run lint
            - run: npm run type-check
            - run: npm run test -- --coverage

    build:
        needs: lint-and-test
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: npm
            - run: npm ci
            - run: npm run build

    deploy:
        if: github.ref == 'refs/heads/main'
        needs: build
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - name: Build & push Docker image
              run: |
                  docker build -t fintrack:latest .
                  # docker push ...
```

### Git Flow

```
main            ← production, стабильная ветка
  └── develop   ← основная ветка разработки
       ├── feature/add-transaction   ← фича
       ├── feature/budget-alerts     ← фича
       └── fix/currency-rounding     ← баг-фикс

Процесс:
1. git checkout -b feature/xxx develop
2. Разработка → коммиты
3. PR в develop → code review → merge
4. Release: develop → main (tag v1.x.x)
```

**Покрытие тем:**

| Тема                        | Где                                                         |
| --------------------------- | ----------------------------------------------------------- |
| Docker                      | Multi-stage build: node для сборки, nginx для раздачи       |
| nginx                       | SPA fallback, gzip, кеширование, security headers           |
| CI/CD                       | GitHub Actions: lint → test → build → deploy                |
| Git Flow                    | main/develop/feature/fix ветки                              |
| `git fetch` vs `git pull`   | fetch — скачать, pull — fetch + merge                       |
| `git rebase` vs `git merge` | rebase для feature-веток, merge для develop→main            |
| `git stash`                 | Сохранение незакоммиченных изменений при переключении веток |
| `git blame`                 | Поиск автора строки кода                                    |
| Дебаг                       | DevTools, breakpoints, Network tab, Vue DevTools            |

---

## 13. Матрица покрытия тем

### JavaScript

| Тема                                            | Модуль                                                    |
| ----------------------------------------------- | --------------------------------------------------------- |
| Мутирующие/не мутирующие методы массива         | Транзакции (sort vs toSorted, filter, map)                |
| Прототипное наследование                        | Категории (обсуждение)                                    |
| `[[ ]]` (внутренние слоты)                      | Категории (обсуждение [[Prototype]])                      |
| Promise vs async/await                          | Авторизация, Мультивалютность                             |
| Контекст, `this`                                | Мультивалютность (WebSocket callbacks)                    |
| `bind`, `call`, `apply`                         | Мультивалютность (привязка контекста)                     |
| Замыкание                                       | Авторизация (interceptor), Транзакции (debounce/throttle) |
| Виды функций                                    | Мультивалютность (arrow vs function в WS)                 |
| Сборщик мусора                                  | Импорт (освобождение после парсинга)                      |
| Рекурсия                                        | Категории (рекурсивное дерево)                            |
| Всплытие/погружение, делегирование              | Транзакции (делегирование в списке)                       |
| Клонирование объектов                           | Отчёты (deepClone для экспорта)                           |
| `\|\|` vs `??`                                  | Мультивалютность (`rate ?? 1`)                            |
| Promise                                         | Авторизация, Мультивалютность                             |
| Методы Promise (all, race, allSettled)          | Бюджеты (Promise.all для загрузки, race для timeout)      |
| Обработка ошибок через then                     | Авторизация (обсуждение)                                  |
| Async/await                                     | Авторизация, Мультивалютность, Транзакции                 |
| Генераторы                                      | Импорт (чтение CSV чанками)                               |
| AbortController                                 | Мультивалютность (отмена запросов), useFetch              |
| `reduce()`                                      | Транзакции (totalIncome, totalExpense)                    |
| Map vs объект                                   | Мультивалютность (Map для курсов)                         |
| WeakMap / WeakSet                               | Мультивалютность (кеш конвертаций)                        |
| Event Loop, микро/макрозадачи                   | Бюджеты (порядок обработки)                               |
| `requestAnimationFrame` / `requestIdleCallback` | Дашборд (rAF анимации), Отчёты (rIC фоновые вычисления)   |
| IntersectionObserver / ResizeObserver           | Транзакции (InfiniteScroll), Настройки (ResizeObserver)   |
| Каррирование                                    | Мультивалютность (createConverter)                        |

### Браузер и сети

| Тема                        | Модуль                                        |
| --------------------------- | --------------------------------------------- |
| Ввод URL в адресную строку  | PWA (полный цикл + SW)                        |
| Garbage Collection          | Импорт (освобождение памяти)                  |
| HTTP запрос, состав         | Мультивалютность (запросы курсов)             |
| Cookie, HttpOnly            | Авторизация (refresh token)                   |
| Хранение данных на фронте   | PWA (IndexedDB, localStorage, sessionStorage) |
| Web API                     | PWA (SW API, Cache API, IndexedDB)            |
| Оптимизация (FCP, LCP, CLS) | Отчёты (lazy loading, skeletons)              |
| Инструменты анализа         | Отчёты (Lighthouse, Performance)              |
| WebRTC, WebSocket           | Мультивалютность (WebSocket курсы)            |
| Shadow DOM                  | PWA (обсуждение Web Components)               |
| Рендер HTML                 | Отчёты (DOM → CSSOM → Render Tree)            |
| HTTP vs HTTPS               | Авторизация (обсуждение)                      |
| CORS, preflight, OPTIONS    | Мультивалютность (внешний API курсов)         |
| Layout, paint, compositing  | Отчёты (обсуждение стадий)                    |
| Web Worker, Service Worker  | Импорт (Worker), PWA (SW)                     |
| SPA и PWA                   | PWA (FinTrack — и SPA, и PWA)                 |

### Vue.js — Реактивность

| Тема                                         | Модуль                                            |
| -------------------------------------------- | ------------------------------------------------- |
| Реактивность Vue 3, Proxy vs defineProperty  | Все модули (реактивные данные)                    |
| `ref` vs `reactive`                          | Composables (обсуждение), Транзакции              |
| `shallowRef` / `shallowReactive`             | Дашборд (данные графиков)                         |
| `computed` vs `watch` vs `watchEffect`       | Дашборд (computed), useFetch (watch), composables |
| `toRef`, `toRefs`, `toRaw`, `unref`, `isRef` | Composables                                       |
| `nextTick`                                   | Бюджеты (обновление прогресс-бара)                |
| `.value` у ref                               | Все composables                                   |
| Effect, track/trigger                        | Дашборд (обсуждение)                              |
| `triggerRef`                                 | Дашборд (shallowRef + triggerRef)                 |
| `effectScope`                                | Composables (обсуждение)                          |

### Vue.js — Компоненты и Composition API

| Тема                                         | Модуль                                                          |
| -------------------------------------------- | --------------------------------------------------------------- |
| Жизненный цикл                               | Composables (onMounted, onBeforeUnmount), Дашборд (onActivated) |
| Options API vs Composition API               | Все модули — Composition API                                    |
| Composables vs mixins                        | Все composables                                                 |
| `<script setup>`                             | Все компоненты                                                  |
| defineProps/Emits/Expose/Model/Options/Slots | UI-kit (Modal, Tabs, InputMoney)                                |
| `provide` / `inject`                         | Категории (CategorySelect), UI-kit (Tabs)                       |
| Передача данных между компонентами           | Props, emit, provide/inject, store, slots                       |
| `v-model` на компоненте                      | UI-kit (Modal, InputMoney)                                      |
| `key` в `v-for`                              | Транзакции (transaction.id как key)                             |
| `Teleport`                                   | Настройки (Modal, Toast)                                        |
| `Suspense`                                   | Дашборд (async компоненты)                                      |
| `defineAsyncComponent`                       | Дашборд (Chart.js компоненты)                                   |
| Slots (default, named, scoped)               | Категории (CategoryItem), UI-kit (Modal)                        |
| `KeepAlive`                                  | Дашборд (кеширование страницы)                                  |
| `Transition` / `TransitionGroup`             | Бюджеты (Toast), UI-kit (Modal)                                 |
| `attrs`, fallthrough                         | UI-kit (AppButton, AppInput)                                    |
| Render-функция, `h()`                        | Отчёты (динамические графики)                                   |

### Vue.js — Виртуальный DOM

| Тема                                     | Модуль                                |
| ---------------------------------------- | ------------------------------------- |
| Виртуальный DOM, зачем нужен             | Дашборд (обсуждение)                  |
| Алгоритм патчинга (diff)                 | Транзакции (key для оптимизации diff) |
| Компиляция шаблонов                      | Все компоненты (обсуждение)           |
| Static hoisting, patch flags, block tree | Дашборд (оптимизации компилятора)     |
| Vue vs React vs Svelte                   | Обсуждение подходов                   |

### Vue Router

| Тема                 | Модуль                             |
| -------------------- | ---------------------------------- |
| Hash vs history mode | Маршрутизация (createWebHistory)   |
| Navigation guards    | Авторизация (beforeEach)           |
| Lazy loading роутов  | Маршрутизация (dynamic import)     |
| Params vs query      | Маршрутизация (:id, ?redirect=)    |
| Nested routes        | Маршрутизация (/transactions/:id)  |
| Защита роутов        | Авторизация (meta.requiresAuth)    |
| push vs replace      | Авторизация (replace после логина) |

### Pinia

| Тема                      | Модуль                                       |
| ------------------------- | -------------------------------------------- |
| Pinia vs Vuex             | Stores (обсуждение)                          |
| State, getters, actions   | transactionStore                             |
| Option vs Setup stores    | authStore (option), transactionStore (setup) |
| `storeToRefs`             | Все компоненты, использующие stores          |
| Inter-store communication | transactionStore → budgetStore, accountStore |
| Плагины Pinia             | piniaLoggerPlugin                            |
| Тестирование stores       | transactionStore tests                       |
| Flux-архитектура          | Pinia stores (обсуждение)                    |

### Vue.js — Оптимизация

| Тема                         | Модуль                                                   |
| ---------------------------- | -------------------------------------------------------- |
| Профилирование               | Отчёты (Vue DevTools, Performance)                       |
| `v-once`, `v-memo`           | Транзакции (VirtualScroll)                               |
| Избежание лишних ре-рендеров | Транзакции, Дашборд                                      |
| Кастомные директивы          | Настройки (v-lazy-img, v-click-outside, v-focus)         |
| Vue-плагины                  | Настройки (toastPlugin)                                  |
| SSR (Nuxt)                   | Обсуждение: FinTrack как SPA, но SSR возможен через Nuxt |
| Hydration                    | Обсуждение (в контексте SSR)                             |

### TypeScript

| Тема                          | Модуль                                          |
| ----------------------------- | ----------------------------------------------- |
| `interface` vs `type`         | Модели данных                                   |
| Enum                          | Модели данных (Period, Currency)                |
| `any` vs `unknown` vs `never` | Модели данных (API response, exhaustive check)  |
| Generics                      | Модели данных (ApiResponse<T>, CreateDTO<T>)    |
| `extends`                     | Модели данных (BaseEntity, generic constraints) |
| `keyof` / `typeof`            | Модели данных (SortableKeys)                    |
| Utility Types                 | Модели данных (Omit, Partial, Pick + кастомные) |
| `as`                          | Модели данных (после type narrowing)            |

### Методологии и подходы

| Тема                      | Модуль                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| SOLID                     | Архитектура FSD (SRP в слоях, OCP в composables, DIP через inject)                                                  |
| KISS, DRY, YAGNI          | Все модули (обсуждение принципов)                                                                                   |
| BEM                       | Настройки / CSS (все компоненты)                                                                                    |
| Паттерны проектирования   | Observer (реактивность), Strategy (фильтры), Facade (composables), Singleton (stores)                               |
| 3 группы паттернов        | Creational (factory для создания транзакций), Structural (Facade — composables), Behavioral (Observer — reactivity) |
| Антипаттерны              | God component, prop drilling, mixins                                                                                |
| FSD                       | Архитектура (полная структура проекта)                                                                              |
| Flux                      | Pinia stores (action → state → getter → view)                                                                       |
| MVC                       | Обсуждение: Vue ближе к MVVM, Pinia — не чистый MVC                                                                 |
| Микрофронты               | Обсуждение: когда FinTrack стоит разбить на микрофронты                                                             |
| WebWorker / ServiceWorker | Импорт (Worker), PWA (SW)                                                                                           |
| SSE vs WebSocket          | Бюджеты (SSE), Мультивалютность (WebSocket)                                                                         |
| Long-polling              | Бюджеты (обсуждение альтернативы SSE)                                                                               |
| Grafana / Sentry          | Обсуждение: мониторинг FinTrack в production                                                                        |

### Computer Science

| Тема                            | Модуль                                                     |
| ------------------------------- | ---------------------------------------------------------- |
| Big O                           | Транзакции (O(n) filter, O(n log n) sort, O(1) Map lookup) |
| Стек, очередь, FIFO/LIFO        | Транзакции (undo-стек)                                     |
| Hash table, bucket, коллизии    | Категории (Map для поиска по id)                           |
| Рекурсия, опасности             | Категории (рекурсивное дерево, stack overflow)             |
| Stack vs Heap                   | Импорт (обсуждение памяти)                                 |
| Garbage Collector               | Импорт (очистка после парсинга)                            |
| Ссылочные типы                  | Импорт (structured clone в Worker)                         |
| Параллельность vs асинхронность | Бюджеты (обсуждение race conditions)                       |
| Race condition                  | Бюджеты (конкурентное обновление семейного бюджета)        |
| Алгоритм .sort (TimSort)        | Транзакции (обсуждение)                                    |
| OSI модель                      | Обсуждение (7 уровней)                                     |
| HTTPS                           | Авторизация (обсуждение)                                   |
| TCP vs UDP                      | Обсуждение (TCP для HTTP/WebSocket, UDP для WebRTC)        |

### Процессы разработки

| Тема                           | Модуль                               |
| ------------------------------ | ------------------------------------ |
| git fetch vs pull              | DevOps (Git Flow)                    |
| git blame                      | DevOps                               |
| git rebase vs merge            | DevOps (Git Flow)                    |
| Git Flow, Trunk Based          | DevOps (Git Flow)                    |
| git stash                      | DevOps                               |
| Linux, деплой, CI/CD           | DevOps (GitHub Actions, Docker)      |
| Docker                         | DevOps (multi-stage Dockerfile)      |
| nginx                          | DevOps (SPA fallback, gzip, caching) |
| Unit / Integration / E2E тесты | Тестирование                         |
| Дебаг                          | DevOps (обсуждение инструментов)     |

### CSS / Верстка

| Тема                               | Модуль                               |
| ---------------------------------- | ------------------------------------ |
| Порядок (специфичность) селекторов | CSS (inline > id > class > tag)      |
| Flex / Grid, responsive            | Дашборд (grid), все компоненты       |
| Sticky header / footer             | Настройки (AppHeader)                |
| Центрирование                      | Настройки (Modal — flex center)      |
| Карточки в сетке                   | Бюджеты, Транзакции (grid auto-fill) |

### Практические задачи

| Задача                             | Модуль                               |
| ---------------------------------- | ------------------------------------ |
| Debounce / Throttle                | Транзакции (поиск, скролл)           |
| DeepClone                          | Отчёты (structuredClone + ручной)    |
| Flatten                            | Категории (плоский список из дерева) |
| findUnique                         | Транзакции (уникальные категории)    |
| GroupBy                            | Транзакции (группировка по дате)     |
| Promise.all / allSettled / race    | Бюджеты, Дашборд                     |
| fetchWithRetry                     | Мультивалютность                     |
| useDebounce                        | Composables                          |
| useFetch                           | Composables                          |
| useLocalStorage                    | Composables                          |
| useClickOutside                    | Composables                          |
| useIntersectionObserver            | Composables                          |
| Modal (Teleport + v-model + slots) | UI-kit                               |
| Tabs (provide/inject)              | UI-kit                               |
| InfiniteScroll                     | UI-kit                               |
| VirtualScroll                      | UI-kit                               |
| v-model с модификатором            | UI-kit (InputMoney)                  |
| Input-обёртка (proxy attrs)        | UI-kit (AppInput)                    |
| key — баг с index                  | Транзакции                           |
| KeepAlive — кеш формы              | Дашборд                              |
| beforeEach guard                   | Авторизация                          |
| Breadcrumbs (route.matched)        | Маршрутизация                        |
| Lazy loading с loading/error       | Маршрутизация, Дашборд               |
| Store корзины (add/remove/clear)   | Транзакции (аналогичный паттерн)     |
| storeToRefs — потеря реактивности  | Stores (все компоненты)              |
| Плагин логирования Pinia           | Stores (piniaLoggerPlugin)           |
| Профилирование 10000 элементов     | Транзакции (VirtualScroll + v-memo)  |
| defineAsyncComponent + fallback    | Дашборд (графики)                    |
| v-lazy-img директива               | UI-kit                               |
| getValueByKey (generics)           | Модели данных                        |
| Свой Readonly/Partial              | Модели данных (DeepReadonly)         |
| BEM                                | CSS (все компоненты)                 |
| Sticky header                      | CSS (AppHeader)                      |
| Центрирование                      | CSS (Modal)                          |
| Карточки в сетке                   | CSS (BudgetCards, TransactionCards)  |

---

**Итого: все 100+ тем из файла собеседований покрыты конкретными модулями и фичами проекта FinTrack.**
