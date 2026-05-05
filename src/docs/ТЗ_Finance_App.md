# ТЗ: Finance App — Приложение учёта личных финансов

> Версия 2 (обновлена на Opus 4.7). Изменения относительно v1: исправлены баги (markdown-таблица, defineModel, SortableKeys, импорт watch), добавлены разделы про SSR/SSG/ISR/PPR, MVP-этапы, API Specification, Accessibility, Безопасность, i18n, Метрики успеха, Антипаттерны, Computer Science (углубление), Чек-лист по 100 вопросам.

## Содержание

1. [Обзор проекта](#1-обзор-проекта)
    - 1.5. [Комментарии в коде: связь с темами собесов](#15-комментарии-в-коде-связь-с-темами-собесов)
2. [Стек технологий](#2-стек-технологий)
3. [Архитектура — Feature-Sliced Design (FSD)](#3-архитектура--feature-sliced-design-fsd)
4. [Модули и фичи](#4-модули-и-фичи)
    - 4.5. [Архитектурные альтернативы: SSR / SSG / ISR / PPR](#45-архитектурные-альтернативы-ssr--ssg--isr--ppr)
    - 4.6. [Этапы разработки и MVP](#46-этапы-разработки-и-mvp)
5. [Модели данных (TypeScript)](#5-модели-данных-typescript)
6. [Маршрутизация (Vue Router)](#6-маршрутизация-vue-router)
    - 6.5. [API Specification](#65-api-specification)
7. [Pinia Stores](#7-pinia-stores)
8. [Composables (практические задачи)](#8-composables-практические-задачи-с-собесов)
9. [UI-компоненты](#9-ui-компоненты-практические-задачи-с-собесов)
10. [CSS / Верстка](#10-css--верстка)
    - 10.5. [Accessibility (a11y)](#105-accessibility-a11y)
    - 10.6. [Безопасность](#106-безопасность)
    - 10.7. [i18n (Интернационализация)](#107-i18n-интернационализация)
11. [Тестирование](#11-тестирование)
    - 11.5. [Метрики успеха и Performance Budget](#115-метрики-успеха-и-performance-budget)
12. [DevOps](#12-devops)
    - 12.5. [Антипаттерны](#125-антипаттерны-и-как-они-избегаются-в-fintrack)
    - 12.6. [Computer Science: углубление](#126-computer-science-углубление)
13. [Матрица покрытия тем](#13-матрица-покрытия-тем)
14. [Чек-лист готовности к собесу](#14-чек-лист-готовности-к-собесу)

---

## 1. Обзор проекта

**Название:** FinTrack
**Описание:** Веб-приложение для учёта доходов, расходов, планирования бюджета и аналитики финансов. Поддержка мультивалютности, оффлайн-режима и семейного бюджета.

**Цели:**

-   Дать пользователю полный контроль над финансами: отслеживание транзакций, категоризация расходов, визуализация трендов
-   Продемонстрировать все ключевые темы frontend-разработки из подготовки к собеседованиям
-   Построить production-ready PWA с оффлайн-поддержкой

**Монетизация (freemium):**

-   Бесплатный план: трекер транзакций, базовые категории, 1 валюта рубли, дашборд с простыми графиками
-   Платная подписка: расширенная аналитика, мультивалютность, семейный бюджет (несколько участников), импорт выписок, экспорт отчётов в PDF/CSV

**Целевая аудитория:**

-   Индивидуальные пользователи, ведущие учёт расходов
-   Семьи, планирующие совместный бюджет
-   Фрилансеры с доходами в нескольких валютах

---

## 1.5. Комментарии в коде: связь с темами собесов

> **Зачем правило существует.** Источник истины по темам — `src/docs/100_вопросов_frontend_собеседований.md`. Каждый блок кода в этом проекте написан не только ради фичи, но и ради демонстрации конкретной темы с собеседования. Чтобы при перечитывании кода (своего же — через месяц, или интервьюером — на скрин-шеринге) сразу было видно, какую тему здесь раскрывают, в коде **обязательны навигационные комментарии-якоря на темы из `100_вопросов_…md`**. Это базовая конвенция проекта — она важнее, чем именование переменных, и применяется к любому коду, который пишется в `src/`.

### Правила

1. **Хедер файла / компонента / композабла / стора / утилиты.** В начале каждого нетривиального файла — блочный комментарий со списком тем из `100_вопросов_frontend_собеседований.md`, которые в этом файле раскрываются. Указывать раздел («1) JavaScript», «3) Vue.js → Реактивность» и т. п.) и формулировку вопроса (можно сокращённо).
2. **Локальные якоря у блоков кода.** Если конкретная функция / хук / условие / строка демонстрирует приём из конкретного вопроса — над этим местом ставится короткий комментарий-якорь с темой. Цель — любой нетривиальный кусок кода должен «прокликиваться» к вопросу, который он раскрывает.
3. **Формат якоря.** `// [Собес: <раздел> → <короткая формулировка>]`. Раздел — название из заголовка `100_вопросов_…md` («JavaScript», «Браузер и сети», «Vue.js → Реактивность», «Vue.js → Компоненты», «TypeScript», «CSS / Верстка» и т. п.). Если раскрывается несколько тем — перечисляем через `;`. Префикс `[Собес:` обязателен — по нему гриппают при ревью и при подготовке к собесу (`grep -rn "\[Собес:" src/`).
4. **Не пересказывать ответ.** Якорь не пересказывает теорию из самого вопроса (ответ — это код, и его собес услышит вслух). Допустима короткая связка «здесь это работает потому что…», но не «вот определение замыкания». Развёрнутые шпаргалки — отдельные карточки, не комментарии в коде.
5. **Когда писать.** При создании нового файла; при добавлении блока, который сознательно демонстрирует тему; при изменении блока, если изменилась раскрываемая тема. Якорь — часть definition of done для коммита, как и тип, и тест.
6. **Когда не писать.** Тривиальный код (геттеры, простые маппинги, перевод вёрстки 1-в-1, типовая обвязка, бойлерплейт `import`-ов) комментировать не нужно — иначе шум перевешивает сигнал. Правило большого пальца: если код не попал бы в раздел 13 «Матрица покрытия тем» — якорь не нужен.
7. **Поддержание актуальности.** При рефакторинге — обновлять и хедер, и локальные якоря. Якорь, висящий над кодом, который темы больше не раскрывает, хуже его отсутствия: он вводит в заблуждение и при перечитывании, и на собесе.
8. **Поддерживаемые форматы комментариев.** В `.ts`/`.js` — `//` или `/* */`. В `.vue` `<template>` — `<!-- -->`. В SCSS — `//` или `/* */`. В `.md`-документации — `<!-- -->`. Внутри JSX-подобных конструкций — `{/* */}` (если когда-либо появится).

### Примеры

**Хедер композабла:**

```typescript
// src/shared/composables/useDebounce.ts
//
// Раскрывает темы из 100_вопросов_frontend_собеседований.md:
//   - 1) JavaScript → Что такое замыкание?
//   - 1) JavaScript → Виды функций (debounce vs throttle)
//   - 3) Vue.js → Composition API → Что такое composables?
//   - 3) Vue.js → Реактивность → onScopeDispose / effectScope
```

**Локальный якорь над блоком:**

```typescript
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
	let timer: ReturnType<typeof setTimeout> | null = null;

	// [Собес: JavaScript → Что такое замыкание?]
	// `timer` и `fn` захватываются внутренней функцией — debounce помнит таймер
	// между вызовами без глобального состояния.
	return (...args: Parameters<T>) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}
```

**Несколько тем в одном якоре:**

```typescript
// [Собес: JavaScript → Promise (all/race/any/allSettled); Vue.js → Composition API → composables]
const [user, settings] = await Promise.all([fetchUser(), fetchSettings()]);
```

**Хедер Vue-компонента:**

```vue
<!--
  src/widgets/TransactionList/TransactionList.vue
  Раскрывает темы из 100_вопросов_frontend_собеседований.md:
    - 3) Vue.js → Компоненты → key в v-for
    - 3) Vue.js → Оптимизация → виртуальный скролл
    - 3) Vue.js → Слоты → scoped и named slots
    - 10) CSS → BEM-нейминг
-->
<script setup lang="ts">
// ...
</script>
```

**Якорь в `<template>`:**

```vue
<template>
	<!-- [Собес: Vue.js → Компоненты → key в v-for] стабильный id, не index — иначе при сортировке Vue переиспользует не те DOM-ноды. -->
	<TransactionRow v-for="tx in transactions" :key="tx.id" :tx="tx" />
</template>
```

**Якорь в SCSS:**

```scss
// [Собес: CSS → BEM-нейминг] — модификатор `--active` на блоке, не на элементе:
// блок отвечает за состояние, элемент — за структуру.
.tab {
	&--active {
		color: var(--color-accent);
	}
}
```

### Связь с разделом «13. Матрица покрытия тем»

Раздел 13 этого ТЗ — **обратный индекс**: «тема → где в коде она раскрывается». Якоря в коде — **прямой индекс**: «файл → какие темы он раскрывает». Они должны сходиться: если в матрице сказано, что «замыкание раскрывается в `useDebounce`», то в `useDebounce.ts` обязан быть якорь на «1) JavaScript → Что такое замыкание?». Расхождение — повод обновить либо матрицу, либо комментарий. На code review проверяется и то, и другое.

### Чек-лист перед коммитом

-   [ ] У всех новых/изменённых файлов есть хедер с темами (если файл нетривиальный).
-   [ ] У всех новых блоков, демонстрирующих тему, есть локальный якорь с префиксом `[Собес:`.
-   [ ] Якоря не пересказывают ответ — только маркируют место.
-   [ ] При удалении/изменении раскрываемой темы соответствующий якорь обновлён или удалён.
-   [ ] `grep -rn "\[Собес:" src/` находит новые места; раздел 13 синхронизирован с этими местами.

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
    ├── ui/                     # UI-kit с префиксом App: AppButton, AppInput, AppModal, AppTabs, AppCard, AppSpinner
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

**Конвенции именования:**

-   Компоненты `shared/ui/*` — префикс `App` (`AppModal`, `AppTabs`, `AppButton`).
-   Компоненты `entities/*/ui/*`, `features/*/ui/*`, `widgets/*` — префикс по домену (`TransactionList`, `BudgetCard`, `DashboardGrid`).
-   `InfiniteScroll`, `VirtualScroll` — общеупотребимые, без префикса (как в большинстве UI-китов).
-   Composables — `use<Name>` (`useDebounce`, `useFetch`).
-   Stores — `use<Entity>Store` (`useTransactionStore`, `useBudgetStore`).
-   Утилиты `shared/lib/*` — camelCase, действие-глагол (`groupBy`, `formatMoney`, `fetchWithRetry`).
-   Композаблы возвращают объект с `Ref`, а не сам ref (`{ data, error, loading }` вместо `data`).

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
-   `getRateFromAnySource(symbol)` — `Promise.any` по нескольким источникам курсов

**Пример: гонка источников курсов через `Promise.any`:**

```typescript
// features/currency-convert/lib/getRateFromAnySource.ts

export async function getRateFromAnySource(symbol: string): Promise<number> {
	const cbApi = fetch(`/api/cb/rates/${symbol}`).then((r) => r.json());
	const fallbackApi = fetch(`/api/openex/rates/${symbol}`).then((r) => r.json());
	const cache = readFromIndexedDB(symbol); // Promise<number | null>

	try {
		// Promise.any резолвится первым успешным; rejects только если ВСЕ провалились
		return await Promise.any([cbApi, fallbackApi, cache]);
	} catch (e) {
		// e — AggregateError: e.errors содержит все причины отказов
		throw new Error(`Все источники курса ${symbol} недоступны`, { cause: e });
	} finally {
		// finally выполняется и при успехе, и при ошибке — гарантированно скрываем спиннер
		hideLoader();
	}
}
```

**Темы собесов:**

| Тема                                | Где реализована                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| WebSocket                           | Реалтайм-обновление курсов валют                                                                           |
| WebRTC vs WebSocket                 | Обсуждение: WebSocket для данных, WebRTC для P2P (здесь не нужен)                                          |
| `Map` vs объект                     | `Map<string, number>` для хранения курсов — ключи-строки, частая итерация                                  |
| `WeakMap` / `WeakSet`               | Кеш конвертаций: WeakMap для привязки к объектам транзакций (GC-friendly)                                  |
| `AbortController`                   | Отмена предыдущего запроса курсов при новом запросе                                                        |
| `fetchWithRetry`                    | Retry при неудаче запроса к API курсов (3 попытки с exponential backoff)                                   |
| CORS, preflight, OPTIONS            | API курсов на внешнем домене — CORS headers, preflight для POST                                            |
| HTTP запрос: состав                 | Метод, URL, headers, body — при запросе курсов                                                             |
| `async` / `await`                   | Асинхронные запросы к API курсов                                                                           |
| Каррирование                        | `createConverter(baseCurrency)(amount, targetCurrency)` — каррированная функция конвертации                |
| `&#124;&#124;` vs `??`              | `rate ?? 1` — fallback для курса (0 — валидный курс, `&#124;&#124;` отбросил бы его как falsy)             |
| `Promise.any` / `Promise.finally`   | `Promise.any([cb, fallbackApi, cache])` — гонка источников курсов; `finally` — гарантированный hide loader |
| Контекст, `this`, `bind/call/apply` | Привязка контекста в callback WebSocket                                                                    |
| Виды функций                        | Arrow vs function declaration в обработчиках WebSocket (различие в this)                                   |

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

**Render-функция и `h()`:**

```typescript
// features/export-report/ui/DynamicChart.tsx
import { h, defineComponent, type PropType } from 'vue';
import type { ChartType } from '@/shared/types';

/** Программная генерация графика: тип чарта приходит из API/конфига,
 *  а не известен на этапе шаблона. Шаблон с цепочкой v-if был бы громоздок. */
export const DynamicChart = defineComponent({
	props: {
		type: { type: String as PropType<ChartType>, required: true },
		data: { type: Array, required: true },
	},
	setup(props) {
		return () =>
			h('div', { class: ['chart', `chart--${props.type}`], role: 'img' }, [
				h('h3', { class: 'chart__title' }, `Отчёт: ${props.type}`),
				...props.data.map((point, i) =>
					h('span', { key: i, class: 'chart__point' }, String(point)),
				),
			]);
	},
});
```

**Когда оправдан `h()`:**

-   Тип/тег рендерится динамически (`h(props.tag, ...)`).
-   Программная генерация большого количества узлов из данных.
-   Библиотечный код, где шаблон-компилятор не подключён.

**Когда `<template>` лучше:**

-   Большая часть UI-разработки — статические шаблоны компилируются эффективнее (static hoisting, patch flags).
-   Читаемость и доступ дизайнеров/верстальщиков к разметке.

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
-   `errorPlugin` — глобальный error handler + Sentry-интеграция

**Глобальная обработка ошибок:**

```typescript
// app/plugins/errorPlugin.ts
import type { App } from 'vue';
import * as Sentry from '@sentry/vue';

export const errorPlugin = {
	install(app: App, options: { dsn: string; env: string }) {
		// 1. Глобальный handler — ловит все ошибки в шаблонах, watchers, lifecycle hooks
		app.config.errorHandler = (err, instance, info) => {
			console.error(`[Vue error] ${info}:`, err);
			Sentry.captureException(err, {
				extra: { componentName: instance?.$options.name, hookInfo: info },
			});
		};

		// 2. Warning handler (только в dev) — поможет ловить mismatched props/missing keys
		if (import.meta.env.DEV) {
			app.config.warnHandler = (msg, _instance, trace) => {
				console.warn(`[Vue warn] ${msg}\n${trace}`);
			};
		}

		// 3. Sentry с трассировкой роутов
		Sentry.init({
			app,
			dsn: options.dsn,
			environment: options.env,
			integrations: [Sentry.browserTracingIntegration()],
			tracesSampleRate: 0.1,
		});
	},
};
```

**Локальные boundary через `onErrorCaptured`:**

```vue
<!-- widgets/SafeBoundary/SafeBoundary.vue -->
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const fallbackError = ref<Error | null>(null);

// Возврат false ОСТАНАВЛИВАЕТ всплытие ошибки выше — родитель её не получит.
onErrorCaptured((err) => {
	fallbackError.value = err;
	return false;
});
</script>

<template>
	<div v-if="fallbackError" class="error-boundary">
		<p>Раздел временно недоступен</p>
		<button @click="fallbackError = null">Попробовать снова</button>
	</div>
	<slot v-else />
</template>
```

**Где применяется в FinTrack:**

-   Каждый widget (`DashboardGrid`, `TransactionList`, `BudgetOverview`) обёрнут в `<SafeBoundary>` — падение одного виджета не уносит всю страницу.
-   `Sentry.captureException` ловит unhandled rejection в actions stores и в composables.

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

## 4.5. Архитектурные альтернативы: SSR / SSG / ISR / PPR

> **Темы собесов:** SSR, SSG, ISR, PPR, hydration, hydration mismatch, `<ClientOnly>`, как под капотом работают Vue 2/3.

FinTrack стартует как **SPA + PWA**, но в плане роста есть варианты, которые стоит знать на собесе:

### Сценарии и применимость в FinTrack

| Подход                                    | Что это                                                     | Применение в FinTrack                                                                     | Минусы                                  |
| ----------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------- |
| **SSR** (Nuxt 3)                          | Рендер HTML на сервере при каждом запросе                   | Лендинг `/` и страница `/pricing` — для SEO и быстрого FCP неавторизованным пользователям | Нагрузка на сервер, кеш-инвалидации     |
| **SSG** (Static Site Generation)          | Pre-render во время билда, отдача статики                   | Страницы блога/документации, маркетинговые лендинги                                       | Не подходит для часто меняющихся данных |
| **ISR** (Incremental Static Regeneration) | Статика + автоматический rebuild по таймеру/тегу            | Публичный виджет курсов валют (`/widget/rates`) — обновление каждые 5 минут               | Stale данные между ревалидациями        |
| **PPR** (Partial Pre-Rendering)           | Гибрид: статический shell + стриминг динамических островков | Дашборд: статичный layout + стриминг данных через `<Suspense>`                            | Сложность инфраструктуры, новизна       |

### Hydration: как Vue превращает серверный HTML в живое приложение

```
Сервер: render() → строка HTML с data-server-rendered="true"
Клиент: createSSRApp(...).mount('#app') → Vue не пересоздаёт DOM,
        а "оживляет" существующий: подвешивает реактивность и обработчики.
```

### Hydration mismatch — типовые причины

-   `Date.now()` / `Math.random()` в шаблоне — на сервере и клиенте разные значения.
-   `window` / `localStorage` без проверки — на сервере объекты отсутствуют.
-   Условный рендер на основе `navigator.userAgent` (mobile detection).
-   Расхождение часовых поясов между сервером и клиентом.

**Симптомы в DevTools:** warning `Hydration node mismatch` + перерисовка узла на клиенте.

### `<ClientOnly>` — escape hatch

```vue
<ClientOnly>
	<!-- Виджет, использующий window/localStorage/IndexedDB -->
	<OfflineQueue />
	<template #placeholder>
		<Skeleton />
	</template>
</ClientOnly>
```

Содержимое не рендерится на сервере, плейсхолдер показывается до гидратации.

### Vue 2 vs Vue 3 под капотом

| Аспект       | Vue 2                                                     | Vue 3                                                                 |
| ------------ | --------------------------------------------------------- | --------------------------------------------------------------------- |
| Реактивность | `Object.defineProperty` (геттеры/сеттеры на каждом ключе) | `Proxy` (оборачивает весь объект, ловит `get/set/has/deleteProperty`) |
| Новые ключи  | Нужен `Vue.set`                                           | Работают из коробки (Proxy ловит присваивание)                        |
| Массивы      | Перехват методов через прототипный override               | Proxy перехватывает индексацию + length                               |
| Bundle       | Реактивность зашита в core                                | Tree-shakeable: импортируешь только `ref`/`reactive`                  |
| TypeScript   | Декораторы, ограниченная inference                        | Полный DX, `<script setup>`, generics в компонентах                   |

**Покрытие тем:**

| Тема                       | Где                                          |
| -------------------------- | -------------------------------------------- |
| SSR (Nuxt)                 | Этот раздел (применимость в FinTrack)        |
| SSG / ISR / PPR            | Этот раздел (таблица сценариев)              |
| Hydration                  | Этот раздел (mismatch + причины)             |
| `<ClientOnly>`             | Этот раздел (виджеты с window-зависимостями) |
| Vue 2 vs Vue 3 под капотом | Этот раздел (Proxy vs defineProperty)        |

---

## 4.6. Этапы разработки и MVP

> Расставленные приоритеты модулей. Цель — собрать показательный портфельный проект за 6-7 недель, где каждая фаза уже даёт работающее приложение.

### Фаза 1 — MVP (3 недели)

**Цель:** запустить рабочее приложение с базовым CRUD транзакций, на котором можно показать ключевые темы Vue 3 и TS на собесе.

| Модуль                   | Что делаем                                                  | Темы собеса покрыты                                     |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------- |
| Авторизация (упрощённая) | Логин по email/password, JWT в памяти, mock refresh         | guards, replace vs push, замыкания                      |
| Транзакции (CRUD)        | Создание/редактирование/удаление, фильтры, поиск с debounce | Composition API, computed, watch, debounce, key в v-for |
| Дашборд (простой)        | Виджеты баланса и расходов, без графиков                    | Suspense, KeepAlive, computed, shallowRef               |
| Категории                | Плоский список + CRUD (без дерева)                          | provide/inject, slots                                   |
| UI-kit (минимум)         | `AppButton`, `AppInput`, `AppModal`, `AppTabs`              | Teleport, defineModel, fallthrough attrs                |
| Архитектура              | Полная структура FSD, TypeScript strict                     | FSD, SOLID, TS generics                                 |

**Definition of Done MVP:**

-   Проходит unit-тесты на `shared/lib` и composables (≥ 60% coverage).
-   Lighthouse Performance ≥ 80, Accessibility ≥ 90 на дашборде.
-   Bundle initial < 200 KB gzip.
-   Работает в Chrome, Firefox, Safari (последние 2 версии).

### Фаза 2 — расширение (+ 2 недели)

| Модуль              | Что добавляется                                                            |
| ------------------- | -------------------------------------------------------------------------- |
| Бюджеты и лимиты    | Прогресс-бары, SSE-уведомления, инкрементальный пересчёт                   |
| Мультивалютность    | WebSocket-курсы, `Promise.any` по нескольким источникам, `useCurrency`     |
| Категории — дерево  | Рекурсивный компонент, drag&drop                                           |
| UI-kit (расширение) | `AppToast` (TransitionGroup), `InfiniteScroll`, `VirtualScroll` с `v-memo` |
| Графики на дашборде | Chart.js через `defineAsyncComponent`, lazy chunks                         |

### Фаза 3 — production-ready (+ 2 недели)

| Модуль          | Что добавляется                                                         |
| --------------- | ----------------------------------------------------------------------- |
| PWA + оффлайн   | Service Worker, IndexedDB queue, background sync                        |
| Импорт CSV/XLSX | Web Worker, генераторы для чанков, drag&drop                            |
| Отчёты          | ECharts, экспорт в PDF/CSV, `requestIdleCallback` для фоновой генерации |
| Тестирование    | Integration-тесты (Pinia + API mock), e2e (Playwright/Cypress)          |
| CI/CD           | GitHub Actions, Docker multi-stage, nginx-deploy                        |
| Мониторинг      | Sentry, web-vitals → analytics endpoint, Lighthouse CI                  |
| Безопасность    | CSP, CSRF tokens, XSS-санитайзинг при импорте                           |

### Что вне scope (out of MVP)

-   Семейный бюджет с ролями (admin/member) — оставляем как идею для собеса, не реализуем.
-   Native-приложение (Capacitor/Tauri) — PWA достаточно.
-   ML-категоризация транзакций — out of scope.

### Риски и митигации

| Риск                                                                                           | Митигация                                                     |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Web Worker не нужен для маленьких CSV → выглядит overengineering                               | Делаем порог: < 1 MB парсим в main thread, ≥ 1 MB — в Worker  |
| WebSocket для курсов недоступен в проде (нет бэкенда)                                          | Mock-сервер на `ws` пакете в dev; в проде fallback на polling |
| SSE-нотификации требуют long-lived соединения, проблематично за nginx без правильной настройки | `proxy_buffering off` + `proxy_read_timeout` в nginx.conf     |
| Bundle растёт из-за Chart.js + ECharts                                                         | Динамические импорты, code splitting per route, tree-shaking  |

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

/** Типизация ключей для сортировки.
 *  Даты в моделях хранятся как ISO-строки, поэтому Date в union не включаем.
 *  Сортировка по дате: transactions.sort((a, b) => +new Date(a.date) - +new Date(b.date)) */
type SortableKeys<T> = {
	[K in keyof T]: T[K] extends string | number ? K : never;
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

## 6.5. API Specification

> Контракты с бэкендом. Полезно для собеса: показывает, что умеешь проектировать API, понимаешь REST/SSE/WS.

### Базовые соглашения

-   **Base URL:** `https://api.fintrack.app/v1`
-   **Auth:** `Authorization: Bearer <accessToken>`; refresh token — в HttpOnly + Secure + SameSite=Strict cookie.
-   **Content-Type:** `application/json` для тела, `multipart/form-data` для импорта файлов.
-   **Формат ошибки:**
    ```json
    {
    	"error": {
    		"code": "VALIDATION_FAILED",
    		"message": "amount must be positive",
    		"fields": { "amount": "min" }
    	}
    }
    ```
-   **Status codes:** `200` OK, `201` Created, `204` No Content, `400` Validation, `401` Unauthorized, `403` Forbidden, `404` Not Found, `409` Conflict, `422` Unprocessable, `429` Rate Limit, `500` Server Error.
-   **Идемпотентность:** для оффлайн-sync клиент отправляет `Idempotency-Key: <uuid>` — сервер дедуплицирует по нему.
-   **Pagination:** `?page=1&pageSize=50`; ответ — `{ data, total, page, pageSize, hasMore }`.

### Auth

| Метод | Эндпоинт         | Запрос                      | Ответ                                              |
| ----- | ---------------- | --------------------------- | -------------------------------------------------- |
| POST  | `/auth/register` | `{ email, password, name }` | `{ user, accessToken }` (Set-Cookie: refreshToken) |
| POST  | `/auth/login`    | `{ email, password }`       | `{ user, accessToken }` (Set-Cookie: refreshToken) |
| POST  | `/auth/refresh`  | _cookie: refreshToken_      | `{ accessToken }` (rotated refreshToken)           |
| POST  | `/auth/logout`   | —                           | `204` (Clear-Cookie: refreshToken)                 |
| GET   | `/auth/me`       | —                           | `{ user }`                                         |

### Transactions

| Метод  | Эндпоинт                                           | Запрос                                        | Ответ                                        |
| ------ | -------------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| GET    | `/transactions?from=&to=&category=&account=&page=` | —                                             | `PaginatedResponse<Transaction>`             |
| POST   | `/transactions`                                    | `CreateDTO<Transaction>` + `Idempotency-Key`  | `Transaction` (201)                          |
| PATCH  | `/transactions/:id`                                | `UpdateDTO<Transaction>` + `If-Match: <etag>` | `Transaction`                                |
| DELETE | `/transactions/:id`                                | `If-Match: <etag>`                            | `204`                                        |
| POST   | `/transactions/import`                             | `multipart: file`                             | `{ imported: number, errors: ParseError[] }` |

### Categories / Accounts / Budgets

| Метод  | Эндпоинт               | Описание                                                       |
| ------ | ---------------------- | -------------------------------------------------------------- |
| GET    | `/categories`          | Дерево категорий (плоский список с `parentId`)                 |
| POST   | `/categories`          | Создание                                                       |
| PATCH  | `/categories/:id`      | Обновление (имя, цвет, parent)                                 |
| DELETE | `/categories/:id`      | Удаление (409 если есть транзакции — нужен `?reassignTo=<id>`) |
| GET    | `/accounts`            | Список счетов                                                  |
| GET    | `/budgets`             | Бюджеты текущего пользователя                                  |
| PUT    | `/budgets/:categoryId` | `{ amount, currency, period }` — upsert                        |

### Real-time

| Транспорт     | Эндпоинт                                            | Назначение                                       |
| ------------- | --------------------------------------------------- | ------------------------------------------------ |
| **SSE**       | `GET /budgets/alerts` (`Accept: text/event-stream`) | Поток событий: `BudgetWarning`, `BudgetExceeded` |
| **WebSocket** | `wss://api.fintrack.app/v1/currencies/stream`       | Live-курсы валют                                 |

**SSE формат события:**

```
event: budget.exceeded
id: 17284939
data: { "categoryId": "food", "spent": 11250, "limit": 10000 }
```

**WebSocket протокол:**

```
→ { "type": "subscribe", "symbols": ["USD_RUB", "EUR_RUB"] }
← { "type": "rate", "symbol": "USD_RUB", "rate": 92.45, "ts": 1736789012 }
← { "type": "ping" }   ← каждые 30s
→ { "type": "pong" }
```

### Currencies

| Метод | Эндпоинт                                       | Описание                        |
| ----- | ---------------------------------------------- | ------------------------------- |
| GET   | `/currencies/rates?base=RUB`                   | Снапшот курсов                  |
| GET   | `/currencies/history?symbol=USD_RUB&from=&to=` | Исторические данные для графика |

### Reports

| Метод | Эндпоинт                     | Описание                                       |
| ----- | ---------------------------- | ---------------------------------------------- |
| GET   | `/reports/summary?from=&to=` | Агрегированные данные по периоду               |
| GET   | `/reports/export?format=pdf` | Бинарный PDF (`Content-Type: application/pdf`) |
| GET   | `/reports/export?format=csv` | CSV (`Content-Type: text/csv`)                 |

### Rate limiting

-   `/auth/login` — 5 req/min/IP (защита от brute-force).
-   `/auth/refresh` — 30 req/min/user.
-   Остальные — 100 req/min/user.
-   Превышение → 429 + `Retry-After: <seconds>`.

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

### Свой стейт-менеджер на 15 строк

> **Тема собеса:** "Как бы ты реализовал свой стейт-менеджер?"

```typescript
// shared/lib/createStore.ts
import { reactive, effectScope, type EffectScope } from 'vue';

export interface MiniStore<S extends object> {
	state: S;
	patch: (partial: Partial<S>) => void;
	dispose: () => void;
	scope: EffectScope;
}

export function createStore<S extends object>(initial: S): MiniStore<S> {
	const scope = effectScope(true); // detached — store живёт вне компонента
	const state = scope.run(() => reactive(initial))!;

	return {
		state: state as S,
		patch: (partial) => Object.assign(state, partial),
		dispose: () => scope.stop(), // остановить все effects при размонтировании
	};
}

// Использование:
const counter = createStore({ count: 0 });
counter.state.count++; // реактивно — Proxy через `reactive`
counter.dispose(); // GC-friendly cleanup
```

**Что демонстрирует:**

-   `reactive` — push-based reactivity через `Proxy` (как у Pinia/Vuex 5).
-   `effectScope` — изоляция и единая точка очистки всех `watch`/`computed`, созданных в сторе.
-   Ручной `patch` вместо mutations — Pinia пошла дальше, разрешив прямую мутацию `state.count++`.
-   Pinia добавляет: SSR-сериализацию, devtools, плагины, типизацию getters/actions, HMR.

### Реактивность изнутри: `effect / track / trigger`

> **Тема собеса:** "Как Vue 3 отслеживает зависимости?" / "Что такое effect, track, trigger?"

```typescript
// shared/lib/__edu__/reactivity-mini.ts
// Учебная реализация реактивности на ~30 строк (упрощённая модель Vue 3).

let activeEffect: (() => void) | null = null;
const targetMap = new WeakMap<object, Map<string | symbol, Set<() => void>>>();

/** track — вызывается при ЧТЕНИИ свойства: запоминает, какой effect зависит от него. */
function track(target: object, key: string | symbol) {
	if (!activeEffect) return;
	let depsMap = targetMap.get(target);
	if (!depsMap) targetMap.set(target, (depsMap = new Map()));
	let dep = depsMap.get(key);
	if (!dep) depsMap.set(key, (dep = new Set()));
	dep.add(activeEffect);
}

/** trigger — вызывается при ЗАПИСИ: уведомляет все effects, зависящие от ключа. */
function trigger(target: object, key: string | symbol) {
	const dep = targetMap.get(target)?.get(key);
	dep?.forEach((eff) => eff());
}

export function reactive<T extends object>(obj: T): T {
	return new Proxy(obj, {
		get(t, k, r) {
			track(t, k);
			return Reflect.get(t, k, r);
		},
		set(t, k, v, r) {
			const ok = Reflect.set(t, k, v, r);
			trigger(t, k);
			return ok;
		},
	});
}

export function effect(fn: () => void) {
	activeEffect = fn;
	fn(); // первый запуск — собираем зависимости через track
	activeEffect = null;
}
```

**Как это связано с Vue API:**

-   `ref(x)` — обёртка `{ value: x }`, у которой `get value()` вызывает track, `set value()` — trigger.
-   `computed(fn)` — `effect`, кеширующий результат и пересчитывающий только при trigger зависимости.
-   `watchEffect(fn)` — `effect`, который автоматически перезапускается при trigger любой подписанной зависимости.
-   `watch(source, cb)` — `effect` поверх getter'а source с явным callback'ом.
-   `effectScope()` — контейнер, хранящий список созданных effects, чтобы `scope.stop()` мог отменить всех разом.

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
import { ref, watch } from 'vue';
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

// Vue 3.4+: destructuring [model, modifiers] возвращается без аргументов.
// Логика модификатора применяется в обработчике onInput, а не в setter, —
// так пример совместим со стабильным API и не зависит от перегрузок defineModel.
const [model, modifiers] = defineModel<number>();

function onInput(event: Event) {
	const raw = (event.target as HTMLInputElement).value.replace(/[^\d.,]/g, '');
	const num = parseFloat(raw.replace(',', '.'));
	if (Number.isNaN(num)) return;

	// Кастомный модификатор .currency — округление до 2 знаков
	model.value = modifiers.currency ? Math.round(num * 100) / 100 : num;
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

## 10.5. Accessibility (a11y)

> Стандарт WCAG 2.1 уровня AA. Это не "галочка" — оставшийся слой UX, который проверяется на собесах в зрелых компаниях.

### `AppModal` — focus trap и ARIA

```vue
<!-- shared/ui/Modal/AppModal.vue (фрагмент) -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';

const dialog = ref<HTMLElement | null>(null);
let lastFocused: HTMLElement | null = null;

function trapFocus(e: KeyboardEvent) {
	if (e.key !== 'Tab' || !dialog.value) return;
	const focusables = dialog.value.querySelectorAll<HTMLElement>(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
	);
	const first = focusables[0];
	const last = focusables[focusables.length - 1];
	if (e.shiftKey && document.activeElement === first) {
		last.focus();
		e.preventDefault();
	} else if (!e.shiftKey && document.activeElement === last) {
		first.focus();
		e.preventDefault();
	}
}

watch(
	() => modelValue.value,
	(open) => {
		if (open) {
			lastFocused = document.activeElement as HTMLElement;
			document.addEventListener('keydown', trapFocus);
			// Закрытие по Escape
			document.addEventListener('keydown', escListener);
		} else {
			document.removeEventListener('keydown', trapFocus);
			document.removeEventListener('keydown', escListener);
			lastFocused?.focus(); // Возврат фокуса туда, откуда модалка была открыта
		}
	},
);

function escListener(e: KeyboardEvent) {
	if (e.key === 'Escape') close();
}
</script>

<template>
	<Teleport to="body">
		<div
			v-if="modelValue"
			ref="dialog"
			class="modal"
			role="dialog"
			aria-modal="true"
			:aria-labelledby="titleId"
		>
			<h2 :id="titleId">{{ title }}</h2>
			<slot />
		</div>
	</Teleport>
</template>
```

### `AppTabs` — клавиатурная навигация по WAI-ARIA

```typescript
// shared/ui/Tabs/keyboardNav.ts
function onTabKeydown(
	e: KeyboardEvent,
	tabs: string[],
	current: string,
	setActive: (id: string) => void,
) {
	const idx = tabs.indexOf(current);
	switch (e.key) {
		case 'ArrowRight':
			setActive(tabs[(idx + 1) % tabs.length]);
			break;
		case 'ArrowLeft':
			setActive(tabs[(idx - 1 + tabs.length) % tabs.length]);
			break;
		case 'Home':
			setActive(tabs[0]);
			break;
		case 'End':
			setActive(tabs[tabs.length - 1]);
			break;
		default:
			return;
	}
	e.preventDefault();
}

// В шаблоне: role="tablist", role="tab", aria-selected, aria-controls, role="tabpanel"
```

### `AppToast` — `aria-live`

```vue
<template>
	<div class="toast" role="status" aria-live="polite" aria-atomic="true">
		{{ message }}
	</div>
</template>
```

`aria-live="polite"` — скринридер озвучит, когда пользователь закончит текущее действие. Для критичных ошибок — `aria-live="assertive"`.

### Контраст и тема

-   WCAG AA: контраст текста ≥ 4.5:1, крупного текста ≥ 3:1.
-   Тёмная тема через CSS-переменные, не через hardcoded цвета.
-   Проверка: `axe DevTools`, `Lighthouse Accessibility`.

### `prefers-reduced-motion`

```scss
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
```

### Семантика и скип-ссылки

```html
<a href="#main" class="skip-link">Перейти к основному содержимому</a>
<header>...</header>
<nav>...</nav>
<main id="main">...</main>
```

`.skip-link` визуально скрыта, но видна при фокусе через Tab — критична для скринридеров и клавиатурных пользователей.

---

## 10.6. Безопасность

### XSS (Cross-Site Scripting)

| Угроза                                         | Защита в FinTrack                                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Внедрение `<script>` через имя транзакции      | По умолчанию Vue экранирует `{{ value }}`; `v-html` запрещён ESLint-правилом `vue/no-v-html` |
| HTML в импорте CSV (`<img src=x onerror=...>`) | Sanitize через DOMPurify перед сохранением; типизированный парсер CSV                        |
| HTML в полях user-generated (description)      | DOMPurify на бэке + frontend escaping                                                        |

**CSP-заголовок в nginx (расширение `security_headers`):**

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss://api.fintrack.app https://api.fintrack.app; frame-ancestors 'none';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
```

### CSRF (Cross-Site Request Forgery)

-   Refresh-token cookie: `HttpOnly; Secure; SameSite=Strict` — браузер не отправит с cross-origin запросом.
-   POST/PATCH/DELETE-эндпоинты дополнительно требуют `X-CSRF-Token` (double-submit cookie pattern).
-   Access-token в памяти приложения (не в localStorage) — защита от XSS-кражи.

### Refresh token rotation

```
1. Клиент: POST /auth/refresh с refresh-cookie.
2. Сервер: проверяет валидность, инвалидирует старый refresh, выдаёт новый.
3. Если приходит запрос со СТАРЫМ refresh — возможна компрометация → инвалидируем все токены пользователя.
```

### Хранение

| Данные                        | Хранилище            | Почему                               |
| ----------------------------- | -------------------- | ------------------------------------ |
| Access token                  | Память (Pinia store) | XSS не достанет через `localStorage` |
| Refresh token                 | HttpOnly cookie      | JS не имеет доступа                  |
| User settings (theme, locale) | localStorage         | Не критично, нужно между сессиями    |
| Оффлайн-очередь транзакций    | IndexedDB            | Большие данные, асинхронный доступ   |
| Курсы валют (кеш)             | IndexedDB            | TTL 5 минут, persist между сессиями  |

### Rate limiting (на nginx)

```nginx
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

location /auth/login {
	limit_req zone=auth burst=2 nodelay;
	proxy_pass http://backend;
}
```

### Чек-лист безопасности перед релизом

-   [ ] `npm audit` — нет high/critical уязвимостей.
-   [ ] CSP без `unsafe-inline` для `script-src`.
-   [ ] HTTPS обязателен (HSTS preload).
-   [ ] Cookie: `HttpOnly + Secure + SameSite`.
-   [ ] Логи не содержат токены/PII (фильтруем в Sentry через `beforeSend`).
-   [ ] Зависимости в Docker pinned by digest.

---

## 10.7. i18n (Интернационализация)

```typescript
// app/i18n/index.ts
import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
	legacy: false, // Composition API mode
	locale: 'ru',
	fallbackLocale: 'en',
	messages: {}, // подгружаем lazy
});

// Lazy-загрузка локалей — не тащим en при загрузке для ru-пользователя
export async function setLocale(locale: 'ru' | 'en') {
	if (!i18n.global.availableLocales.includes(locale)) {
		const messages = await import(`./locales/${locale}.json`);
		i18n.global.setLocaleMessage(locale, messages.default);
	}
	i18n.global.locale.value = locale;
}
```

```json
// app/i18n/locales/ru.json
{
	"transactions": {
		"empty": "Нет транзакций за период",
		"count": "Нет транзакций | {n} транзакция | {n} транзакции | {n} транзакций"
	}
}
```

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t, n, d } = useI18n();
</script>

<template>
	<p>{{ t('transactions.count', count) }}</p>
	<p>{{ n(amount, 'currency') }}</p>
	<!-- 1 234,56 ₽ -->
	<p>{{ d(date, 'long') }}</p>
	<!-- 1 мая 2026 г. -->
</template>
```

**Что покрываем:**

-   **Плюрализация:** "1 транзакция / 2 транзакции / 5 транзакций" — через `nplurals=4` для русского.
-   **Форматирование чисел/дат:** через `Intl.NumberFormat` / `Intl.DateTimeFormat` (под капотом vue-i18n).
-   **Lazy-локали:** chunk per язык, не тянем все локали в initial bundle.
-   **RTL-задел:** в layout используем CSS-логические свойства (`margin-inline-start` вместо `margin-left`) — переключение `dir="rtl"` "просто работает".

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

**Стек тестирования:**

-   **Unit / Component:** Vitest + Vue Test Utils + `@testing-library/vue` (работаем с DOM, а не с internals).
-   **Stores:** Vitest + `createTestingPinia` для изоляции.
-   **E2E:** Playwright (приоритет) или Cypress. Playwright выбираем за нативный TS, параллельный запуск, network mocking из коробки.
-   **Mocking API:** MSW (Mock Service Worker) — единый mock-слой для unit + e2e + dev.
-   **Visual regression:** Playwright + `expect(page).toHaveScreenshot()` для критических страниц (дашборд, отчёты).

---

## 11.5. Метрики успеха и Performance Budget

> Что измеряем у production-сборки. Эти числа закрепляем в CI и в Lighthouse-отчётах.

### Web Vitals (целевые значения)

| Метрика                             | Что меряет                              | Цель    | Как улучшить                                             |
| ----------------------------------- | --------------------------------------- | ------- | -------------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | Скорость отрисовки крупного контента    | < 2.5s  | Lazy-загрузка графиков, preload critical fonts, CDN      |
| **CLS** (Cumulative Layout Shift)   | Сдвиг layout при загрузке               | < 0.1   | Skeleton-плейсхолдеры, фиксированные размеры изображений |
| **INP** (Interaction to Next Paint) | Отклик на клик/тап (заменил FID в 2024) | < 200ms | Web Worker для тяжёлых задач, virtualization, debounce   |
| **FCP** (First Contentful Paint)    | Первая отрисовка                        | < 1.8s  | Code splitting, сжатие, HTTP/2                           |
| **TTFB** (Time to First Byte)       | Скорость ответа сервера                 | < 600ms | CDN, edge caching, SSR где оправдано                     |

### Bundle budget

| Bundle                             | Лимит                | Контроль                                       |
| ---------------------------------- | -------------------- | ---------------------------------------------- |
| Initial JS (на route `/dashboard`) | ≤ 200 KB gzip        | `rollup-plugin-visualizer` + Lighthouse CI     |
| Per-route chunks                   | ≤ 100 KB gzip каждый | Vite `build.rollupOptions.output.manualChunks` |
| Total JS на странице               | ≤ 500 KB gzip        | `npm run analyze` после билда                  |
| CSS initial                        | ≤ 50 KB gzip         | PurgeCSS / scoped стили                        |

### Test coverage targets

| Слой                      | Цель             |
| ------------------------- | ---------------- |
| `shared/lib` (утилиты)    | ≥ 90% statements |
| `shared/composables`      | ≥ 80%            |
| `entities/*/model/*Store` | ≥ 70%            |
| `features/*`              | ≥ 60%            |
| Общий статус CI           | ≥ 70%            |

### Lighthouse CI порог

```yaml
# .lighthouserc.json
{
    'ci':
        {
            'assert':
                {
                    'assertions':
                        {
                            'categories:performance': ['error', { 'minScore': 0.9 }],
                            'categories:accessibility': ['error', { 'minScore': 0.95 }],
                            'categories:best-practices': ['error', { 'minScore': 0.9 }],
                            'categories:seo': ['error', { 'minScore': 0.85 }],
                        },
                },
        },
}
```

### Real User Monitoring (RUM)

```typescript
// app/plugins/webVitalsPlugin.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

export const webVitalsPlugin = {
	install() {
		const send = (metric: { name: string; value: number; id: string }) => {
			navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
		};
		onCLS(send);
		onINP(send);
		onLCP(send);
		onFCP(send);
		onTTFB(send);
	},
};
```

`sendBeacon` вместо `fetch`: гарантирует доставку даже при закрытии вкладки.

### Error rate (Sentry)

| Метрика               | Цель          |
| --------------------- | ------------- |
| Crash-free sessions   | ≥ 99.9%       |
| Error rate (uncaught) | ≤ 0.1% сессий |
| Resolved time для P1  | ≤ 24h         |

### Что измеряем в DevOps-пайплайне

-   **Bundle analyzer** в PR — комментарий с дельтой размера.
-   **Lighthouse CI** прогоняется на каждом PR — блокирует мерж при регрессии > 5%.
-   **Vitest coverage** — отчёт публикуется как GitHub PR check.
-   **Sentry releases** — каждый деплой ассоциируется с git SHA, можно отслеживать рост ошибок по релизам.

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

## 12.5. Антипаттерны и как они избегаются в FinTrack

> **Тема собеса:** "Какие антипаттерны знаешь?"

| Антипаттерн                                                    | Где мог бы появиться в FinTrack                                                                    | Решение в проекте                                                                                                              |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **God Component**                                              | `DashboardPage.vue` со всей логикой графиков, фильтрами, экспортом — 1500+ строк                   | Декомпозиция на widgets (`BalanceCard`, `ExpenseChart`, `BudgetProgress`); каждая widget'а ≤ 200 строк, единая ответственность |
| **Prop Drilling**                                              | Передача `currentUser` через 5 уровней: `App → Layout → Sidebar → UserMenu → Avatar`               | `provide('currentUser')` в `AuthProvider`, `inject` в любом потомке; для глобального — Pinia                                   |
| **Mixins**                                                     | Общая логика "форматирование суммы" в mixin'е, подмешиваемом в каждый компонент                    | Composable `useFormatMoney()` — явные импорты, типизация, нет коллизий имён                                                    |
| **Неконтролируемый watch**                                     | `watch(state, () => fetch(...))` без `AbortController` — гонка запросов при быстрой смене фильтров | `useFetch` отменяет предыдущий запрос через `AbortController`                                                                  |
| **Direct DOM manipulation**                                    | `document.querySelector('.modal').style.display = 'none'` в обход реактивности                     | Управление через `v-if` / `v-show` + `defineModel` в `AppModal`                                                                |
| **Магические числа**                                           | `if (percentage > 80)` без объяснения, что 80 — порог уведомления                                  | Константы в `shared/config/budget.ts`: `BUDGET_WARN_THRESHOLD = 80`                                                            |
| **Утечка памяти в подписках**                                  | `addEventListener` без `removeEventListener`, незакрытые WebSocket'ы                               | `useEventListener`, `useWebSocket` композаблы — авто-cleanup в `onBeforeUnmount`                                               |
| **Mutation внутри `computed`**                                 | `computed(() => transactions.value.sort(...))` — мутирует исходный массив                          | `computed(() => [...transactions.value].sort(...))` или `toSorted()`                                                           |
| **`any` для подавления TS-ошибок**                             | `(data as any).field.nested` — теряем безопасность типов                                           | `unknown` + type guards / `zod.parse(data)` на границе API                                                                     |
| **Глобальный singleton state в `app.config.globalProperties`** | `app.config.globalProperties.$user = userObj` — невозможно тестировать, нет реактивности           | Pinia store + composable `useAuth()`                                                                                           |
| **Неконтролируемые ре-рендеры**                                | Глубокая структура с `reactive`, перерисовывающая весь дерево при любом изменении                  | `shallowRef` для данных графиков (Chart.js сам управляет внутренним DOM) + `v-memo` для строк виртуального скролла             |
| **Inline-стили вместо классов**                                | `:style="{ background: budget.color }"` для каждой строки                                          | CSS-переменные: `style="--budget-color: ${color}"` + класс с `background: var(--budget-color)`                                 |

**Принципы, которые помогают этого избегать:**

-   **SRP (Single Responsibility):** компонент/композабл/функция — одна ответственность.
-   **Composition over Inheritance:** composables вместо mixins, провайдеры вместо наследования.
-   **Explicit dependencies:** все зависимости видны через импорты и `inject`-ключи, нет неявного "магического" контекста.
-   **Boundary validation:** валидируем данные на границах системы (API, formData, localStorage), внутри — доверяем типам.

---

## 12.6. Computer Science: углубление

> **Темы собесов:** Hash table (bucket, коллизии), TimSort, OSI, TCP vs UDP, race condition.

### Hash table — как `Map` устроен изнутри

```
Внутри Map:
┌────────────┐
│ bucket[0]  │ → [{key: "A", val: 1}]
│ bucket[1]  │ → [{key: "B", val: 2}, {key: "Z", val: 9}]   ← коллизия!
│ bucket[2]  │ → []
│ bucket[3]  │ → [{key: "C", val: 3}]
└────────────┘
        ↑
   index = hash(key) % bucketCount
```

**Ключевые понятия:**

-   **Bucket** — слот хранения. Bucket'ов фиксированное число; индекс вычисляется как `hash(key) % buckets.length`.
-   **Коллизия** — два разных ключа дают одинаковый bucket-индекс.
-   **Load factor** — `size / bucketCount`. При превышении (~0.75) запускается **rehash**: создаётся массив большего размера, все ключи перевычисляются.

**Способы разрешения коллизий:**

| Метод                                   | Идея                                                                          | Где применяется              |
| --------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| **Separate chaining**                   | В bucket лежит связный список / массив; коллизирующие пары добавляются в него | V8 `Map`, Java `HashMap`     |
| **Open addressing (linear probing)**    | При коллизии ищется следующий свободный bucket линейно                        | Python `dict`                |
| **Open addressing (quadratic probing)** | Шаг растёт квадратично: +1, +4, +9                                            | Реже, помогает кластеризации |
| **Cuckoo hashing**                      | 2 хеш-функции, при коллизии "выселяют" старого жильца                         | Специфика, БД                |

**Big O:**

-   Среднее: `get/set/has` — O(1).
-   Худшее (все ключи в один bucket): O(n) — поэтому в JS `Map` использует случайно сидируемый хеш для защиты от hash-flooding-атак.

**Где в FinTrack:** `currencyStore.rates: Map<string, number>` для O(1) lookup курса по ключу `"USD_RUB"`. `categoryStore.byId: Map<string, Category>` для O(1) поиска при рендере дерева.

### TimSort — алгоритм `Array.prototype.sort`

Со спецификации **ECMAScript 2019**, метод `.sort()` обязан быть **стабильным**. V8 (Chrome/Node.js) и SpiderMonkey (Firefox) реализуют его через **TimSort** — гибрид merge sort + insertion sort:

| Свойство         | TimSort                                                          |
| ---------------- | ---------------------------------------------------------------- |
| **Стабильность** | Да (равные элементы сохраняют исходный порядок)                  |
| **Худшее**       | O(n log n)                                                       |
| **Среднее**      | O(n log n)                                                       |
| **Лучшее**       | **O(n)** на уже отсортированных или почти отсортированных данных |
| **Память**       | O(n) (нужен буфер для merge)                                     |

**Идея алгоритма:**

1.  Массив разбивается на «runs» — последовательности уже отсортированных элементов (естественные или искусственно достроенные через insertion sort).
2.  Runs сливаются попарно (как в merge sort), но с оптимизациями: galloping mode при сильно различающихся длинах.
3.  На малых runs (<32 элементов) используется insertion sort — он быстрее на маленьких массивах за счёт меньшего overhead'а.

**Где в FinTrack:** сортировка транзакций по дате/сумме. На уже отсортированном списке (после API-ответа) повторный `.sort()` отрабатывает за O(n).

**Подводный камень:** до ES2019 движки могли использовать quicksort (нестабильный). Если поддерживаете старый Safari — стабильность не гарантируется.

### Другие теоретические темы

-   **OSI 7 уровней:** Physical → Data Link → Network → Transport → Session → Presentation → Application. HTTP — Application, TCP — Transport, IP — Network. Полезно знать, что HTTPS добавляет TLS между Transport и Application (часто относят к Presentation).
-   **TCP vs UDP:** TCP — connection-oriented, гарантирует доставку и порядок (HTTP, WebSocket). UDP — connectionless, без гарантий, но быстрее (WebRTC media, DNS).
-   **Race condition в FinTrack:** одновременное добавление транзакций несколькими членами семьи в общий бюджет — без серверной транзакции/optimistic locking два клиента могут перетереть `budget.spent`. Решение: `If-Match: <etag>` или server-side increment вместо replace.

---

## 13. Матрица покрытия тем

### JavaScript

| Тема                                                 | Модуль                                                     |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| Мутирующие/не мутирующие методы массива              | Транзакции (sort vs toSorted, filter, map)                 |
| Прототипное наследование                             | Категории (обсуждение)                                     |
| `[[ ]]` (внутренние слоты)                           | Категории (обсуждение [[Prototype]])                       |
| Promise vs async/await                               | Авторизация, Мультивалютность                              |
| Контекст, `this`                                     | Мультивалютность (WebSocket callbacks)                     |
| `bind`, `call`, `apply`                              | Мультивалютность (привязка контекста)                      |
| Замыкание                                            | Авторизация (interceptor), Транзакции (debounce/throttle)  |
| Виды функций                                         | Мультивалютность (arrow vs function в WS)                  |
| Сборщик мусора                                       | Импорт (освобождение после парсинга)                       |
| Рекурсия                                             | Категории (рекурсивное дерево)                             |
| Всплытие/погружение, делегирование                   | Транзакции (делегирование в списке)                        |
| Клонирование объектов                                | Отчёты (deepClone для экспорта)                            |
| `\|\|` vs `??`                                       | Мультивалютность (`rate ?? 1`)                             |
| Promise                                              | Авторизация, Мультивалютность                              |
| Методы Promise (all, race, any, allSettled, finally) | Бюджеты (Promise.all/race), Мультивалютность (any/finally) |
| Обработка ошибок через then                          | Авторизация (обсуждение)                                   |
| Async/await                                          | Авторизация, Мультивалютность, Транзакции                  |
| Генераторы                                           | Импорт (чтение CSV чанками)                                |
| AbortController                                      | Мультивалютность (отмена запросов), useFetch               |
| `reduce()`                                           | Транзакции (totalIncome, totalExpense)                     |
| Map vs объект                                        | Мультивалютность (Map для курсов)                          |
| WeakMap / WeakSet                                    | Мультивалютность (кеш конвертаций)                         |
| Event Loop, микро/макрозадачи                        | Бюджеты (порядок обработки)                                |
| `requestAnimationFrame` / `requestIdleCallback`      | Дашборд (rAF анимации), Отчёты (rIC фоновые вычисления)    |
| IntersectionObserver / ResizeObserver                | Транзакции (InfiniteScroll), Настройки (ResizeObserver)    |
| Каррирование                                         | Мультивалютность (createConverter)                         |

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

## 14. Чек-лист готовности к собесу

> Свод по всем 100+ вопросам из `100_вопросов_frontend_собеседований.md`. Используется как самопроверка перед mock-собесом.
>
> Легенда: **✅ Полностью покрыто кодом** | **🟡 Покрыто обсуждением/паттерном** | **🔴 Требует отдельной подготовки**

### 1. JavaScript

| #   | Вопрос                                           | Статус | Где разобрано                           |
| --- | ------------------------------------------------ | ------ | --------------------------------------- |
| 1   | Мутирующие/немутирующие методы массива           | ✅     | Транзакции (`toSorted` vs `sort`)       |
| 2   | Прототипное наследование                         | 🟡     | Категории (обсуждение)                  |
| 3   | Внутренние слоты `[[ ]]`                         | 🟡     | Категории (`[[Prototype]]`)             |
| 4   | Promise vs async/await                           | ✅     | Авторизация, useFetch                   |
| 5   | Контекст выполнения, `this`                      | ✅     | Мультивалютность (WS callbacks)         |
| 6   | `bind` / `call` / `apply`                        | ✅     | Мультивалютность                        |
| 7   | Замыкание                                        | ✅     | Auth interceptor, debounce              |
| 8   | Виды функций                                     | ✅     | Мультивалютность (arrow vs function)    |
| 9   | Сборщик мусора, алгоритм, достижимость           | ✅     | Импорт + Computer Science               |
| 10  | Рекурсия, опасности                              | ✅     | Категории (рекурсивный компонент)       |
| 11  | Всплытие/погружение, делегирование               | ✅     | Транзакции (делегирование клика)        |
| 12  | Способы клонирования                             | ✅     | Отчёты (deepClone, structuredClone)     |
| 13  | `\|\|` vs `??`                                   | ✅     | Мультивалютность                        |
| 14  | Promise                                          | ✅     | useFetch, Авторизация                   |
| 15  | Методы Promise (all/race/any/allSettled/finally) | ✅     | Бюджеты + Мультивалютность              |
| 16  | Обработка ошибок через `then`                    | 🟡     | Авторизация (обсуждение)                |
| 17  | async/await                                      | ✅     | Все async actions                       |
| 18  | Генераторы                                       | ✅     | Импорт CSV (чанки)                      |
| 19  | AbortController                                  | ✅     | useFetch                                |
| 20  | `reduce()`                                       | ✅     | totalIncome/totalExpense                |
| 21  | Map vs объект                                    | ✅     | currencyStore.rates                     |
| 22  | WeakMap / WeakSet                                | ✅     | Кеш конвертаций                         |
| 23  | Event Loop, микро/макро                          | ✅     | Бюджеты (порядок обработки)             |
| 24  | rAF / rIC                                        | ✅     | Дашборд + Отчёты                        |
| 25  | IntersectionObserver / ResizeObserver            | ✅     | InfiniteScroll, ResizeObserver виджетов |
| 26  | Каррирование                                     | ✅     | createConverter                         |

### 2. Браузер и сети

| #   | Вопрос                           | Статус | Где разобрано                         |
| --- | -------------------------------- | ------ | ------------------------------------- |
| 1   | Что происходит при вводе URL     | ✅     | PWA + Безопасность                    |
| 2   | Garbage Collection               | ✅     | Импорт + Computer Science             |
| 3   | Состав HTTP-запроса              | ✅     | API Specification                     |
| 4   | Cookie, HttpOnly                 | ✅     | Безопасность (cookie attributes)      |
| 5   | Хранение данных на фронтенде     | ✅     | PWA + Безопасность (таблица хранилищ) |
| 6   | Web API                          | ✅     | PWA                                   |
| 7   | Оптимизация (FCP, LCP, CLS)      | ✅     | Метрики успеха                        |
| 8   | Lighthouse, Performance, Network | ✅     | Метрики успеха (Lighthouse CI)        |
| 9   | WebRTC, WebSocket                | ✅     | Мультивалютность                      |
| 10  | Shadow DOM                       | 🟡     | PWA (Web Components обсуждение)       |
| 11  | Рендер HTML                      | ✅     | Отчёты (DOM → CSSOM → Render Tree)    |
| 12  | HTTP vs HTTPS                    | ✅     | Авторизация + Безопасность            |
| 13  | CORS, preflight, OPTIONS         | ✅     | Мультивалютность                      |
| 14  | Layout, paint, compositing       | ✅     | Отчёты                                |
| 15  | Web Worker, Service Worker       | ✅     | Импорт + PWA                          |
| 16  | SPA, PWA                         | ✅     | PWA                                   |

### 3. Vue.js

| #   | Вопрос                                        | Статус | Где разобрано                          |
| --- | --------------------------------------------- | ------ | -------------------------------------- |
| 1   | Реактивность Vue 3, Proxy vs defineProperty   | ✅     | SSR раздел + effect/track/trigger      |
| 2   | ref vs reactive                               | ✅     | Composables                            |
| 3   | shallowRef / shallowReactive                  | ✅     | Дашборд (графики)                      |
| 4   | computed vs watch vs watchEffect              | ✅     | Composables                            |
| 5   | toRef/toRefs/toRaw/unref/isRef                | 🟡     | Composables (упоминание)               |
| 6   | nextTick                                      | ✅     | Бюджеты                                |
| 7   | `.value` у ref                                | ✅     | Все composables                        |
| 8   | Effect, track/trigger                         | ✅     | Реактивность изнутри (раздел 7.5)      |
| 9   | triggerRef                                    | 🟡     | Дашборд (shallowRef + triggerRef)      |
| 10  | effectScope                                   | ✅     | createStore                            |
| 11  | Жизненный цикл                                | ✅     | Composables, Дашборд (onActivated)     |
| 12  | Options API vs Composition API                | ✅     | Все компоненты на Composition          |
| 13  | Composables vs mixins                         | ✅     | Все composables + Антипаттерны         |
| 14  | `<script setup>`                              | ✅     | Все компоненты                         |
| 15  | defineProps/Emits/Expose/Model/Options/Slots  | ✅     | UI-kit                                 |
| 16  | provide / inject + реактивность               | ✅     | Категории, AppTabs                     |
| 17  | Передача данных между компонентами            | ✅     | UI-kit + Антипаттерны (prop drilling)  |
| 18  | v-model на компоненте + кастомный модификатор | ✅     | InputMoney                             |
| 19  | key в v-for                                   | ✅     | Транзакции                             |
| 20  | Teleport                                      | ✅     | AppModal                               |
| 21  | Suspense                                      | ✅     | Дашборд                                |
| 22  | defineAsyncComponent                          | ✅     | Дашборд (графики)                      |
| 23  | Slots (default/named/scoped)                  | ✅     | AppModal, Категории                    |
| 24  | KeepAlive                                     | ✅     | Дашборд                                |
| 25  | Transition / TransitionGroup                  | ✅     | Toast, Modal                           |
| 26  | attrs, fallthrough                            | ✅     | AppButton, AppInput                    |
| 27  | Render-функция, h()                           | ✅     | Отчёты (DynamicChart)                  |
| 28  | Виртуальный DOM                               | 🟡     | Дашборд (обсуждение)                   |
| 29  | Алгоритм патчинга (diff)                      | 🟡     | Транзакции (key для оптимизации)       |
| 30  | Компиляция шаблонов                           | 🟡     | Обсуждение                             |
| 31  | Static hoisting, patch flags, block tree      | 🟡     | Дашборд                                |
| 32  | Vue vs React vs Svelte                        | 🟡     | SSR раздел (push vs pull)              |
| 33  | Hash vs history mode                          | ✅     | Маршрутизация                          |
| 34  | Navigation guards                             | ✅     | Авторизация                            |
| 35  | Lazy loading роутов                           | ✅     | Маршрутизация                          |
| 36  | params vs query                               | ✅     | Маршрутизация                          |
| 37  | Nested routes                                 | ✅     | Маршрутизация                          |
| 38  | Защита роутов                                 | ✅     | Авторизация                            |
| 39  | router.push vs replace                        | ✅     | Авторизация                            |
| 40  | Pinia vs Vuex                                 | ✅     | Pinia Stores                           |
| 41  | state/getters/actions                         | ✅     | transactionStore                       |
| 42  | Option vs Setup stores                        | ✅     | authStore vs transactionStore          |
| 43  | storeToRefs                                   | ✅     | Pinia Stores                           |
| 44  | Inter-store communication                     | ✅     | addTransaction → budgetStore           |
| 45  | Плагины Pinia                                 | ✅     | piniaLoggerPlugin                      |
| 46  | Тестирование stores                           | ✅     | Тестирование                           |
| 47  | Flux                                          | ✅     | Pinia (action → state → getter → view) |
| 48  | Профилирование                                | ✅     | Метрики успеха                         |
| 49  | v-once / v-memo                               | ✅     | VirtualScroll                          |
| 50  | Избежание ре-рендеров                         | ✅     | Антипаттерны (mutation в computed)     |
| 51  | Кастомные директивы                           | ✅     | v-lazy-img, v-click-outside            |
| 52  | Vue плагины, app.use()                        | ✅     | toastPlugin, errorPlugin               |
| 53  | SSR (Nuxt), ограничения                       | ✅     | Раздел 4.5                             |
| 54  | Hydration, mismatch                           | ✅     | Раздел 4.5                             |
| 55  | `<ClientOnly>`                                | ✅     | Раздел 4.5                             |

### 4. TypeScript

| #   | Вопрос                    | Статус | Где разобрано                                 |
| --- | ------------------------- | ------ | --------------------------------------------- |
| 1   | interface vs type         | ✅     | Модели данных                                 |
| 2   | Enum, компиляция          | ✅     | Модели данных (Period, Currency)              |
| 3   | Компиляция type/interface | ✅     | Модели данных (стираются)                     |
| 4   | any / unknown / never     | ✅     | Модели данных (parseApiResponse, assertNever) |
| 5   | Generics                  | ✅     | ApiResponse<T>, CreateDTO<T>                  |
| 6   | extends                   | ✅     | BaseEntity + constraints                      |
| 7   | keyof / typeof            | ✅     | SortableKeys                                  |
| 8   | Utility Types             | ✅     | Omit/Partial/Pick + DeepReadonly              |
| 9   | as                        | ✅     | После type narrowing                          |

### 5. Методологии и подходы

| #   | Вопрос                          | Статус | Где разобрано                                       |
| --- | ------------------------------- | ------ | --------------------------------------------------- |
| 1   | SOLID на фронте                 | 🟡     | FSD (SRP, OCP, DIP)                                 |
| 2   | KISS / DRY / YAGNI              | 🟡     | Архитектура                                         |
| 3   | BEM                             | ✅     | CSS / Верстка                                       |
| 4   | Паттерны проектирования         | ✅     | Архитектура (Observer, Strategy, Facade, Singleton) |
| 5   | 3 группы паттернов              | ✅     | Архитектура                                         |
| 6   | Frontend-паттерны в библиотеках | 🟡     | Pinia (Singleton), Vue Router (Strategy)            |
| 7   | Антипаттерны                    | ✅     | Раздел 12.5                                         |
| 8   | FSD, Breadcrumbs                | ✅     | Архитектура (Breadcrumbs → shared/ui)               |
| 9   | Flux                            | ✅     | Pinia                                               |
| 10  | MVC                             | 🟡     | Обсуждение (Vue ближе к MVVM)                       |
| 11  | Микрофронты                     | 🔴     | Обсуждение, не реализуем                            |
| 12  | Способы разбить приложение      | ✅     | FSD + микрофронты обсуждение                        |
| 13  | WebWorker / ServiceWorker       | ✅     | Импорт + PWA                                        |
| 14  | SSE vs WebSocket                | ✅     | Бюджеты vs Мультивалютность                         |
| 15  | Long-polling                    | 🟡     | Бюджеты (обсуждение альтернативы)                   |
| 16  | Grafana / Sentry                | ✅     | errorPlugin, Метрики успеха                         |

### 6. Computer Science

| #   | Вопрос                          | Статус | Где разобрано                     |
| --- | ------------------------------- | ------ | --------------------------------- |
| 1   | Big O                           | ✅     | Транзакции + Раздел 12.6          |
| 2   | Стек/очередь, FIFO/LIFO         | ✅     | Undo-стек транзакций              |
| 3   | Hash table, bucket, коллизии    | ✅     | Раздел 12.6                       |
| 4   | Способы разрешения коллизий     | ✅     | Раздел 12.6 (chaining vs probing) |
| 5   | Опасности рекурсии              | ✅     | Категории                         |
| 6   | Stack vs Heap                   | ✅     | Импорт                            |
| 7   | GC, языки без него, алгоритмы   | ✅     | Раздел 12.6 + Импорт              |
| 8   | Ссылочные типы                  | ✅     | Импорт (structured clone)         |
| 9   | Параллельность vs асинхронность | ✅     | Бюджеты                           |
| 10  | Race condition                  | ✅     | Бюджеты + Раздел 12.6 (If-Match)  |
| 11  | Алгоритм `.sort` (TimSort)      | ✅     | Раздел 12.6                       |
| 12  | OSI 7 уровней                   | ✅     | Раздел 12.6                       |
| 13  | Как работает HTTPS              | 🟡     | Авторизация + Безопасность (HSTS) |
| 14  | TCP vs UDP                      | ✅     | Раздел 12.6                       |

### 7. Фреймворки и архитектура (React-вопросы)

| #   | Вопрос                     | Статус | Где разобрано                     |
| --- | -------------------------- | ------ | --------------------------------- |
| 1   | Фреймворк vs библиотека    | 🟡     | Стек технологий (Vue — фреймворк) |
| 2   | Реактивный ли React?       | 🟡     | SSR раздел (pull vs push)         |
| 3   | Свой стейт-менеджер        | ✅     | createStore (раздел 7.4)          |
| 4   | SSR — как работает         | ✅     | Раздел 4.5                        |
| 5   | SSR / ISR / SSG / PPR      | ✅     | Раздел 4.5                        |
| 6   | Vue 2 vs Vue 3 под капотом | ✅     | Раздел 4.5 (таблица)              |

### 8. Процессы разработки

| #   | Вопрос                   | Статус | Где разобрано               |
| --- | ------------------------ | ------ | --------------------------- |
| 1   | git fetch vs pull        | ✅     | DevOps                      |
| 2   | git blame                | ✅     | DevOps                      |
| 3   | git rebase vs merge      | ✅     | DevOps                      |
| 4   | Git Flow / Trunk Based   | ✅     | DevOps                      |
| 5   | git stash                | ✅     | DevOps                      |
| 6   | Linux, деплой, CI/CD     | ✅     | DevOps                      |
| 7   | Docker                   | ✅     | DevOps (multi-stage)        |
| 8   | nginx                    | ✅     | DevOps + Безопасность (CSP) |
| 9   | Unit / Integration / E2E | ✅     | Тестирование (стек)         |
| 10  | Дебаг сложных багов      | 🟡     | DevOps (DevTools, Sentry)   |

### 9. Практические задачи

| #   | Задача                                 | Статус | Где разобрано                |
| --- | -------------------------------------- | ------ | ---------------------------- |
| 1   | Debounce / Throttle                    | ✅     | useDebounce                  |
| 2   | DeepClone                              | ✅     | Отчёты                       |
| 3   | Flatten                                | 🟡     | Категории (упоминание)       |
| 4   | findUnique                             | 🟡     | Транзакции (упоминание)      |
| 5   | GroupBy                                | ✅     | groupBy утилита + tests      |
| 6   | Promise.all/allSettled/race реализация | 🟡     | Обсуждение                   |
| 7   | fetchWithRetry                         | ✅     | Мультивалютность             |
| 8   | Задачи на console (event loop)         | 🔴     | Требует отдельной подготовки |
| 9   | Задачи на this/контекст/всплытие       | 🔴     | Требует отдельной подготовки |
| 10  | useDebounce                            | ✅     | Composables                  |
| 11  | useFetch                               | ✅     | Composables                  |
| 12  | useLocalStorage                        | ✅     | Composables                  |
| 13  | useClickOutside                        | ✅     | Composables                  |
| 14  | useIntersectionObserver                | ✅     | Composables                  |
| 15  | watch vs watchEffect задача            | 🟡     | Composables (обсуждение)     |
| 16  | ref vs reactive потеря реактивности    | 🟡     | Composables (обсуждение)     |
| 17  | Modal (Teleport + v-model + slots)     | ✅     | AppModal                     |
| 18  | Tabs (provide/inject)                  | ✅     | AppTabs                      |
| 19  | InfiniteScroll                         | ✅     | InfiniteScroll               |
| 20  | v-model с модификатором                | ✅     | InputMoney                   |
| 21  | Input-обёртка (proxy attrs)            | ✅     | AppInput                     |
| 22  | Баг с key=index                        | ✅     | Транзакции                   |
| 23  | KeepAlive — кеш формы                  | ✅     | Дашборд                      |
| 24  | beforeEach guard                       | ✅     | Авторизация                  |
| 25  | Breadcrumbs (route.matched)            | ✅     | Маршрутизация                |
| 26  | Lazy loading с loading/error           | ✅     | Маршрутизация                |
| 27  | Store корзины                          | ✅     | transactionStore (паттерн)   |
| 28  | storeToRefs — потеря реактивности      | ✅     | Pinia Stores                 |
| 29  | Плагин логирования Pinia               | ✅     | piniaLoggerPlugin            |
| 30  | 10000 элементов — оптимизация          | ✅     | VirtualScroll + v-memo       |
| 31  | defineAsyncComponent + fallback        | ✅     | Дашборд                      |
| 32  | v-lazy-img директива                   | ✅     | UI-kit                       |
| 33  | getValueByKey (generics)               | ✅     | Модели данных                |
| 34  | Свой Readonly/Partial                  | ✅     | DeepReadonly                 |

### 10. CSS

| #   | Вопрос                  | Статус | Где разобрано |
| --- | ----------------------- | ------ | ------------- |
| 1   | Порядок селекторов      | ✅     | CSS / Верстка |
| 2   | Flex / Grid, responsive | ✅     | Дашборд       |
| 3   | Sticky header / footer  | ✅     | AppHeader     |
| 4   | Центрирование           | ✅     | Modal         |
| 5   | Карточки в сетке        | ✅     | budgetCards   |

### Что осталось 🔴

Темы, которые НЕ закрываются проектом, требуют отдельной подготовки:

-   **Console output задачи** (event loop, миллион вариантов) — нужен tilt в Code Punks-стиле, набор из 30-50 типовых задач.
-   **this / контекст / всплытие — задачи** — отдельный набор, не имитировать в проекте.
-   **Микрофронты** — обсуждение в архитектуре есть, но без реализации; читать про Module Federation, single-spa.

### Финальная статистика

-   **Всего вопросов:** ~143 (включая раздел "Задачи").
-   **✅ Полностью покрыто кодом:** ~115 (≈ 80%).
-   **🟡 Покрыто обсуждением:** ~22 (≈ 15%).
-   **🔴 Требует отдельной подготовки:** ~6 (≈ 5%).

---

**Итого: проект FinTrack v2 покрывает кодом ~80% вопросов, ещё ~15% — обсуждением паттернов в проекте; оставшиеся 5% — теоретические задачи, которые готовятся отдельным практическим тренингом.**
