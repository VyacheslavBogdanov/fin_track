# Coding Conventions — FinTrack

Документ-конвенция для проекта FinTrack. Короткие правила «как писать код» с отсылками на источники истины: `ТЗ_Finance_App.md`, `100_вопросов_frontend_собеседований.md`, конфиги Prettier/ESLint/EditorConfig.

> **Зачем существует.** Этот файл — компактная навигация по правилам проекта. Глубокие пояснения и обоснования (как это устроено под капотом, какие альтернативы) живут в ТЗ. Здесь — только «делай так / не делай так» и ссылки.

---

## 1. Назначение и связь с другими документами

| Документ                                                  | Что в нём                                                                        | Когда читать                                    |
| --------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------- |
| `ТЗ_Finance_App.md`                                       | Архитектура, модули, модели, API, тесты, антипаттерны, матрица тем собесов       | Перед проектированием новой фичи                |
| `100_вопросов_frontend_собеседований.md`                  | Банк тем для собеса — источник, на который ссылаются якоря `[Собес: ...]` в коде | Когда пишешь якоря, при подготовке к собесу     |
| `coding-conventions.md` (этот файл)                       | Короткие правила «как писать»                                                    | Перед коммитом, при code review                 |
| `.prettierrc.json` / `eslint.config.js` / `.editorconfig` | Автоматически проверяемые правила                                                | Сами по себе — `npm run format && npm run lint` |

**Принцип взаимодействия:** если правило можно автоматизировать (Prettier / ESLint) — оно живёт в конфиге, в conventions только маркируется. Если правило содержательное (декомпозиция, FSD, якоря, антипаттерны) — фиксируется здесь и в ТЗ.

---

## 2. Общие принципы

-   **KISS** — простое решение лучше сложного. Не делать абстракции/обёртки «на будущее»; три похожие строки лучше преждевременной абстракции.
-   **DRY** — не дублировать логику; общую вынести в composable / утилиту / компонент. Не путать с KISS: повторение допустимо, если альтернатива — переусложнённая абстракция.
-   **YAGNI** — не реализовывать функциональность «на всякий случай». Только то, что сейчас требуется.
-   **SOLID:**
    -   **S** — один компонент / composable / store = одна задача.
    -   **O** — расширять через props / slots / composables, не модифицируя существующее.
    -   **L** — компоненты с одинаковым контрактом (props/emits) взаимозаменяемы.
    -   **I** — типы и интерфейсы специализированные, не «жирные».
    -   **D** — зависимости через абстракции (composables, типы), не от конкретных реализаций (`fetch`, `localStorage`).
-   **Масштабируемость как сумма мелких правил.** «Масштабируемая архитектура» в этом проекте — не отдельное правило, а результат соблюдения §3 (лимит 200 строк), §5 (FSD-слои), §6 (именование), §8.10 (composables вместо mixins). Если все они соблюдены — рост команды и кодовой базы не упирается в архитектуру.
-   **Адаптивность по умолчанию.** Любой UI-компонент пишется mobile-first и должен корректно работать на viewport от 320 px до 1920+ px. См. §11.5.

> Подробное обоснование — `ТЗ_Finance_App.md` §3 (FSD); банк тем — `100_вопросов_…md` §5 «Методологии и подходы».

---

## 3. Размер файлов и компонентов

### 3.1. Лимит ≤ 200 строк на файл

**Жёсткое правило для `.vue`, `.ts`, `.scss` в `src/`:** один файл — не более **200 строк** (включая `<template>`, `<script>` и `<style>` для `.vue`).

-   Markdown-документация (`src/docs/*.md`) и конфиги под лимит **не подпадают**.
-   Сгенерированные файлы (если появятся) — тоже не подпадают.
-   Если файл подбирается к 200 строкам — это сигнал к декомпозиции, а не предлог раздуть лимит.

### 3.2. Лимит ≤ 100 символов в строке

`printWidth: 100` из `.prettierrc.json`. Перенос строк делает Prettier автоматически — `npm run format`.

### 3.3. Что делать при превышении

| Ситуация                              | Декомпозиция                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| Большой компонент (>200 строк `.vue`) | Разбить на дочерние widgets / features. См. антипаттерн **God Component** в ТЗ §12.5.   |
| Длинный store (>200 строк `.ts`)      | Вынести бизнес-логику в composables; в store оставить state + actions-обёртки.          |
| Длинный composable                    | Разбить по ответственностям: один composable = одна задача (`useFetch`, `useDebounce`). |
| Длинный SCSS                          | Вынести переменные в `app/styles/_variables.scss`, миксины в `_mixins.scss`.            |
| Длинная утилита                       | Один файл = одна функция (или семейство тесно связанных), модулями.                     |

> Полная таблица антипаттернов и решений — `ТЗ_Finance_App.md` §12.5.

---

## 4. Якоря `[Собес: ...]` в коде

**Обязательная конвенция проекта.** Каждый нетривиальный файл / блок кода имеет навигационный комментарий-якорь со ссылкой на тему из `100_вопросов_frontend_собеседований.md`.

**Формат:** `// [Собес: <раздел> → <короткая формулировка>]`

**Хедер файла:**

```typescript
// src/shared/composables/useDebounce.ts
//
// Раскрывает темы из 100_вопросов_frontend_собеседований.md:
//   - 1) JavaScript → Что такое замыкание?
//   - 3) Vue.js → Composition API → Что такое composables?
```

**Локальный якорь:**

```typescript
// [Собес: JavaScript → Что такое замыкание?]
// `timer` и `fn` захватываются внутренней функцией.
return (...args: Parameters<T>) => {
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => fn(...args), delay);
};
```

> **Полное руководство** (правила, исключения, примеры для `.vue` и `.scss`, чек-лист) — `ТЗ_Finance_App.md` §1.5.

---

## 5. FSD-архитектура

**Иерархия слоёв** (импорты строго сверху вниз):

```
app → pages → widgets → features → entities → shared
```

-   Слой может импортировать **только из нижестоящих** (никогда из своего же или вышестоящих).
-   Cross-import между слайсами одного слоя (`features/a` → `features/b`) — **запрещён**.
-   Каждый слайс (`entities/transaction`, `features/add-transaction`) экспортирует наружу только через `index.ts` (public API).
-   Внутренности слайса (`model/`, `api/`, `ui/`, `lib/`) — приватные; импортировать их извне нельзя.

> Полная структура папок и пример слайса — `ТЗ_Finance_App.md` §3.

---

## 6. Именование

### 6.1. Файлы и директории

-   `.vue` компоненты: `PascalCase.vue` (`TransactionList.vue`)
-   `.ts` модули: `camelCase.ts` (`useDebounce.ts`, `formatMoney.ts`)
-   SCSS-партиалы: `_kebab-case.scss` (`_variables.scss`, `_mixins.scss`)
-   Директории: `kebab-case` (`add-transaction/`, `transaction-list/`)

### 6.2. Код

| Сущность                 | Стиль                                                        |
| ------------------------ | ------------------------------------------------------------ |
| Переменные и функции     | `camelCase`                                                  |
| Интерфейсы и типы        | `PascalCase` (`Transaction`, `BudgetState`)                  |
| Константы                | `UPPER_SNAKE_CASE` (`BUDGET_WARN_THRESHOLD`)                 |
| Props (входы компонента) | `camelCase`                                                  |
| Emit-события             | `kebab-case` (`update:model-value`, `add-transaction`)       |
| CSS-классы               | БЭМ: `block__element--modifier` (`transaction__row--income`) |

### 6.3. По слоям FSD

| Где                                           | Префикс / шаблон                                             |
| --------------------------------------------- | ------------------------------------------------------------ |
| `shared/ui/*`                                 | `App` (`AppButton`, `AppModal`, `AppTabs`)                   |
| `entities/*/ui`, `features/*/ui`, `widgets/*` | По домену (`TransactionList`, `BudgetCard`, `DashboardGrid`) |
| Composables                                   | `use<Name>` (`useDebounce`, `useFetch`, `useCurrency`)       |
| Pinia stores                                  | `use<Entity>Store` (`useTransactionStore`, `useBudgetStore`) |
| Утилиты `shared/lib/*`                        | `camelCase`, глагол-действие (`groupBy`, `formatMoney`)      |

**Composables возвращают объект,** не голый ref: `{ data, error, loading }` вместо `data`.

```typescript
// Хорошо
export function useFetch<T>(url: MaybeRefOrGetter<string>): UseFetchReturn<T> {
	return { data, error, loading, refetch };
}

// Плохо — теряется расширяемость
export function useFetch<T>(url: string): Ref<T | null> {
	/* ... */
}
```

---

## 7. TypeScript

### 7.1. Strict mode

Включён в `tsconfig.app.json`. **Все типы — явные;** не опираться на инференс там, где он скрывает контракт (публичные функции, props компонентов, возврат composables).

### 7.2. `interface` vs `type`

-   `interface` — для объектов и props компонентов.
-   `type` — для union-типов, утилитных типов, `Record<...>`, дискриминированных юнионов.

```typescript
interface Transaction {
	id: string;
	amount: number;
	categoryId: string;
}

type TransactionType = 'income' | 'expense' | 'transfer';

type AsyncState<T> =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'success'; data: T }
	| { status: 'error'; error: string };
```

### 7.3. Никакого `any`

`any` запрещён. Если тип неизвестен — `unknown` + type guards или валидация на границе через `zod`.

```typescript
// Плохо
function parseResponse(data: any) {
	return data.user.name;
}

// Хорошо
import { z } from 'zod';
const UserSchema = z.object({ user: z.object({ name: z.string() }) });
function parseResponse(data: unknown) {
	return UserSchema.parse(data).user.name;
}
```

### 7.4. Дискриминированные юнионы для error-states

Не передавать `null | undefined | Error | data` через позицию аргумента / поля. Используй discriminator (`status`, `kind`).

> Темы собеса: `100_вопросов_…md` §4 «TypeScript».

---

## 8. Vue 3 (Composition API)

### 8.1. `<script setup lang="ts">`

Единственно допустимый стиль для новых компонентов. Options API — запрещён.

### 8.2. Порядок секций в SFC

1. `<script setup lang="ts">`
2. `<template>`
3. `<style lang="scss" scoped>`

### 8.3. Порядок внутри `<script setup>`

1. Импорты (Vue / vue-router / pinia → сторонние → `@/...`)
2. Типы и интерфейсы (`Props`, `Emits`)
3. `defineProps` / `defineEmits` / `defineModel` / `defineExpose`
4. Composables (`useRouter`, `useTransactionStore`)
5. Реактивные данные (`ref`, `reactive`, `shallowRef`)
6. `computed`
7. `watch` / `watchEffect`
8. Функции-обработчики
9. Lifecycle хуки (`onMounted`, `onBeforeUnmount`)
10. `provide`

### 8.4. `ref` vs `reactive`

-   `ref` — для примитивов и для объектов, которые **переприсваиваются целиком** (`data.value = newObj`).
-   `reactive` — для объектов, у которых меняются **отдельные поля** и нет переприсваивания.
-   Composables возвращают `ref` (или объект с ref'ами), не `reactive`.

### 8.5. `computed` vs `watch` vs `watchEffect`

-   `computed` — derived state (чистая функция от реактивных входов, кэшируется).
-   `watch` — side effects при изменении конкретного источника.
-   `watchEffect` — side effects с автоотслеживанием зависимостей. Использовать осторожно — легко собрать лишние зависимости.

### 8.6. `v-if` vs `v-show`

-   `v-if` — условный рендер; элемент создаётся/уничтожается; **дороже на toggle**, дешевле в начальном рендере.
-   `v-show` — `display: none`; элемент всегда в DOM; **дешевле toggle**, дороже initial.

Правило: если переключение редкое — `v-if`; частое — `v-show`.

### 8.7. `key` в `v-for` — обязателен и стабилен

```vue
<!-- Хорошо: стабильный id из данных -->
<TransactionRow v-for="tx in transactions" :key="tx.id" :tx="tx" />

<!-- Плохо: index ломает state дочерних компонентов при сортировке -->
<TransactionRow v-for="(tx, i) in transactions" :key="i" :tx="tx" />
```

### 8.8. `define*` макросы

-   `defineProps` — типизация через generic, не runtime-валидация.
-   `defineEmits` — типизация payload'ов событий.
-   `defineModel` — для двусторонних связей (вместо `props.modelValue` + `emit('update:modelValue')`).
-   `defineExpose` — только когда родителю реально нужен доступ к внутренностям; по умолчанию ничего не выставляем.

### 8.9. `provide` / `inject` вместо prop drilling

Если значение пробрасывается через 3+ уровня — `provide` в общем предке, `inject` в потомке. Для глобального state — Pinia.

### 8.10. Composables (mixins запрещены)

-   Composable = `use<Name>`-функция, возвращающая объект с реактивными значениями.
-   **Mixins запрещены** — нет explicit-импортов, конфликты имён, плохая типизация. Замена — composables.

> Темы собеса: `100_вопросов_…md` §3 «Vue.js».

---

## 9. Pinia

### 9.1. Setup-стиль stores

`defineStore('name', () => { ... })`, не Options-стиль.

```typescript
export const useTransactionStore = defineStore('transaction', () => {
	const items = ref<Transaction[]>([]);
	const totalIncome = computed(() =>
		items.value.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
	);
	function add(tx: Transaction) {
		items.value.push(tx);
	}
	return { items, totalIncome, add };
});
```

### 9.2. `storeToRefs` обязателен при деструктуризации

При деструктуризации store **теряется реактивность** для `state`/`getters`. Решение — `storeToRefs`:

```typescript
// Плохо
const { items, totalIncome } = useTransactionStore(); // не реактивно

// Хорошо
const store = useTransactionStore();
const { items, totalIncome } = storeToRefs(store); // ref'ы
const { add } = store; // actions деструктурируем напрямую
```

> Подробнее — `ТЗ_Finance_App.md` §7.

---

## 10. Vue Router

### 10.1. Lazy loading роутов

Все страницы — динамическим импортом, чтобы попадали в отдельные чанки:

```typescript
{
	path: '/transactions',
	component: () => import('@/pages/TransactionsPage/TransactionsPage.vue'),
}
```

### 10.2. Navigation guards для авторизации

`meta: { requiresAuth: true }` на приватных роутах + глобальный `beforeEach`-guard, проверяющий `useAuthStore().isAuthenticated`.

### 10.3. `router.push` vs `router.replace`

-   `push` — для пользовательской навигации (попадает в history).
-   `replace` — для системных редиректов (после логина, при отсутствии прав), чтобы не засорять history.

---

## 11. CSS / SCSS / БЭМ

### 11.1. Нейминг

`block__element--modifier`. Модификатор ставится либо на блок, либо на элемент — никогда сразу на оба уровня одного селектора.

```scss
.transaction__row--income {
	color: var(--color-success);
}
.budget__bar--warning {
	background: var(--color-warning);
}
```

### 11.2. Максимум 3 уровня вложенности SCSS

```scss
// Хорошо
.transaction {
	&__row {
		&--income {
			color: var(--color-success);
		}
	}
}

// Плохо: 4+ уровня, селектор зависит от внешнего контекста
.page {
	.list {
		.transaction {
			&__row {
				/* ... */
			}
		}
	}
}
```

### 11.3. Переменные / CSS custom properties

Значения — через SCSS-переменные (для констант темы) или CSS custom properties (для динамики, которая может меняться в runtime).

```scss
// Хорошо
color: var(--color-text-primary);
padding: $spacing-md;

// Плохо: magic value
color: #1f2937;
padding: 16px;
```

### 11.4. Запрещено

-   `!important` — указывает на проблему с архитектурой селекторов.
-   Inline-стили (`:style="..."`) — кроме случаев, когда значение реально динамическое (тогда — через CSS custom property: `:style="{ '--budget-color': color }"` + класс с `background: var(--budget-color)`).

### 11.5. Адаптивная вёрстка

**Mobile-first.** Базовые стили — для самого узкого viewport (320 px+). Расширения — через `min-width`-медиа-запросы. Не наоборот: `max-width`-каскад быстро превращается в гонку «отменить родительские стили».

**Брейкпоинты проекта** — единый источник в `src/app/styles/_breakpoints.scss`:

| Миксин    | Диапазон    |
| --------- | ----------- |
| `mobile`  | ≤ 480 px    |
| `tablet`  | 481–1024 px |
| `desktop` | ≥ 1025 px   |
| `wide`    | ≥ 1440 px   |

```scss
@use '@/app/styles/breakpoints' as *;

.transaction-list {
	padding: 12px; // mobile (default)
	@include desktop {
		padding: 24px;
	}
}
```

**Container Queries** для компонентов внутри resizable-сеток (виджеты дашборда, карточки в InfiniteScroll). См. ТЗ §10 «Адаптивность».

**Минимальный touch-target — 44 × 44 px** (WCAG 2.5.5). Для иконочных кнопок — `padding` или прозрачный hit-zone (`::before` с `inset: -8px`).

**Адаптивность — обязательная часть Definition of Done** для любого нового компонента. Чек-лист в §19 включает проверку на 320 / 375 / 768 / 1024 / 1440 px.

**Запрещено в адаптивной вёрстке:**

-   Mobile detection через `navigator.userAgent` — только CSS media queries и feature detection.
-   Жёсткий `width` / `height` в пикселях для главных контейнеров — `min-` / `max-` / `clamp()` / `%` / `fr` / `auto-fit minmax(...)`.
-   `window.resize`-листенер для пересчёта layout — `ResizeObserver` для контейнера или CSS Container Queries.

> Темы собеса: `100_вопросов_…md` §10 «CSS» (Flex/Grid, responsive). Полные правила и обоснование — `ТЗ_Finance_App.md` §10 «Адаптивность».

---

## 12. Стиль кода (Prettier + ESLint)

### 12.1. Prettier

Источник истины — `.prettierrc.json`:

| Правило         | Значение |
| --------------- | -------- |
| `useTabs`       | `true`   |
| `tabWidth`      | `4`      |
| `singleQuote`   | `true`   |
| `semi`          | `true`   |
| `printWidth`    | `100`    |
| `trailingComma` | `"all"`  |

Не редактировать «под себя» — `npm run format` всё равно перепишет под этот стиль.

### 12.2. ESLint flat config

Файл — `eslint.config.js` (flat-config от ESLint 9). Подключены:

-   `eslint-plugin-vue` (flat/essential)
-   `@vue/eslint-config-typescript`
-   `@vue/eslint-config-prettier/skip-formatting` (форматированием занимается Prettier)

Блок `eslintConfig` в `package.json` — мёртвый легаси, не трогать.

### 12.3. Команды

```bash
npm run lint        # eslint . --fix
npm run format      # prettier --write src/
npm run type-check  # vue-tsc --build --force
npm run build       # type-check + vite build
```

---

## 13. Тестирование

-   **Unit** (Vitest): чистые функции из `shared/lib`, composables, утилиты для Pinia.
-   **Integration** (Vitest + Vue Test Utils): компонент + store, форма + валидация, composable + store.
-   **E2E** (Playwright): пользовательские сценарии (логин → создать транзакцию → увидеть в дашборде).
-   **TDD по возможности:** сначала тест на ожидаемое поведение, затем код.

> Полное руководство (структура тестов, mocking через MSW, visual regression) — `ТЗ_Finance_App.md` §11.

---

## 14. Accessibility (a11y)

-   Семантический HTML (`<button>`, `<nav>`, `<main>`, заголовки `h1`–`h6` по иерархии).
-   ARIA-атрибуты для нестандартных контролов (`role="dialog"`, `aria-modal`, `aria-live`).
-   Focus trap в модалках, возврат фокуса на кнопку-инициатор при закрытии.
-   Клавиатурная навигация по WAI-ARIA Authoring Practices.
-   `prefers-reduced-motion` для анимаций.
-   Контраст по WCAG AA.

> Полная реализация на компонентах `AppModal` / `AppTabs` / `AppToast` — `ТЗ_Finance_App.md` §10.5.

---

## 15. Безопасность

-   **XSS:** Vue экранирует автоматически; `v-html` — только на доверенный, заранее санитизированный контент.
-   **CSRF:** access token в памяти, refresh token в HttpOnly cookie; CSRF-токен в заголовке для не-GET-запросов.
-   **Хранение:** access — в памяти, refresh — HttpOnly cookie, user-prefs — `localStorage`.
-   **Валидация на границе** API через `zod` (см. §7.3).
-   **HTTPS** обязателен; `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy` — на nginx.

> Чек-лист безопасности перед релизом — `ТЗ_Finance_App.md` §10.6.

---

## 16. i18n

-   `vue-i18n` для мультиязычности.
-   Один файл локали на язык (`src/shared/i18n/ru.json`, `en.json`).
-   Ключи по доменам (`transaction.add.title`), не плоско (`addTransactionTitle`).
-   Форматирование чисел и дат — через `Intl.NumberFormat` / `Intl.DateTimeFormat`, не вручную.

> Полная стратегия — `ТЗ_Finance_App.md` §10.7.

---

## 17. Антипаттерны (чего избегать)

Краткий список — полная таблица из 12 пунктов с FinTrack-примерами и решениями в `ТЗ_Finance_App.md` §12.5.

-   **God Component** → декомпозиция (см. §3.3 этого файла).
-   **Prop Drilling** → `provide`/`inject` или Pinia.
-   **Mixins** → composables.
-   **Неконтролируемый watch** → `AbortController` в `useFetch`.
-   **Direct DOM manipulation** → `v-if`/`v-show`, `defineModel`.
-   **Магические числа** → константы в `shared/config/*`.
-   **Утечки в подписках** → cleanup в `onBeforeUnmount` (`useEventListener`).
-   **Mutation в `computed`** → копировать данные (`[...arr].sort()` или `arr.toSorted()`).
-   **`any` для подавления TS** → `unknown` + type guard / `zod`.
-   **Глобальный state в `app.config.globalProperties`** → Pinia.
-   **Неконтролируемые ре-рендеры** → `shallowRef`, `v-memo`.
-   **Inline-стили** → CSS custom properties + классы.

---

## 18. Коммиты

### 18.1. Формат

`type: краткое описание (что и зачем)`

| `type`     | Когда                                       |
| ---------- | ------------------------------------------- |
| `feat`     | Новая функциональность                      |
| `fix`      | Багфикс                                     |
| `refactor` | Изменение кода без изменения поведения      |
| `style`    | Форматирование, отступы (без правок логики) |
| `test`     | Добавление / правка тестов                  |
| `docs`     | Изменения в документации (`*.md`)           |
| `chore`    | Сборка, конфиги, зависимости                |
| `format`   | Прогон Prettier по большому объёму          |

### 18.2. Когда коммитить

Логически законченный шаг. Не «накопил-всё-за-день», не «фикс опечатки → отдельный коммит» (если опечатка — часть текущей фичи).

---

## 19. Чек-лист перед коммитом

-   [ ] Лимит **≤ 200 строк** на файл не превышен (`.vue` / `.ts` / `.scss`).
-   [ ] Якоря `[Собес: ...]` стоят в новых нетривиальных файлах и блоках (см. §4 и ТЗ §1.5).
-   [ ] Импорты не нарушают FSD-иерархию; cross-import между слайсами одного слоя отсутствует.
-   [ ] Pinia-стейт деструктурируется через `storeToRefs`.
-   [ ] Нет `any`, `!important`, inline-стилей, `v-html` на недоверенный контент.
-   [ ] `npm run lint && npm run format && npm run type-check && npm run build` — зелёные.
-   [ ] Если затронут код, раскрывающий новую тему собеса, — обновлён раздел 13 «Матрица покрытия тем» в ТЗ.
