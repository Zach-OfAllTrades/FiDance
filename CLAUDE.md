# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FiDance is a single-user personal finance tracker: monthly cash flow, budgets vs. actuals, fixed bills, credit card debt, investments, payroll/income, and net worth, navigable by month with an annual rollup. It's a React Router v8 (framework mode, SSR) app with a Prisma/SQLite backend. See `overview.md` for the original product spec this app was built from.

## Project rules

1. **DRY — do not repeat yourself.** Before writing a block of markup, a calculation, or a config, check whether it already exists (a `computations.ts` helper, a juice component, a repeated JSX pattern across routes) and reuse/extract instead of copy-pasting. This is the rule most worth stopping and checking before you write code.
2. **Always write tests, and run typecheck + lint before committing.** `npm run typecheck && npm run lint && npm test` should be clean before any commit. New pure logic (anything in `app/lib/`) needs a matching `*.test.ts`. There's no component-rendering test setup here (see Testing below for why) — route components with real interactivity are verified by hand in the browser instead.
3. **Use `../juice` (`@zach-ofalltrades/juice`) for UI components — don't write bespoke component markup/CSS in this repo.** If juice doesn't have the component you need, add it to `../juice` (new component directory under `src/components/{atoms,molecules,organisms}/`, following its existing conventions — CSS driven only by `--juice-*` tokens, a barrel `index.ts`, a Vitest test, a Storybook story) rather than building a one-off in FiDance. Only truly FiDance-specific, non-reusable bits (the sidebar nav chrome in `app-layout.tsx`, the `category-dot` swatch) stay as local CSS. See Styling below for how FiDance's visual identity is preserved through juice's token system rather than juice's generic default theme.

## Commands

```bash
npm run dev          # start dev server (HMR) at http://localhost:5173
npm run build        # production build
npm run start        # serve the production build (./build/server/index.js)
npm run typecheck    # react-router typegen + tsc

npm run db:migrate   # prisma migrate dev (creates/applies a migration from schema.prisma changes)
npm run db:seed      # prisma db seed (runs prisma/seed.ts via tsx)
npm run db:studio    # prisma studio GUI
npm run db:reset     # prisma migrate reset (drops db, reapplies migrations, reseeds)

npm test             # vitest run — all *.test.ts under app/
npm run test:watch   # vitest watch mode
npm run lint         # biome lint ./app
npm run format       # biome format --write ./app
npm run check        # biome check (lint + format) ./app
```

Run a single test file: `npx vitest run app/lib/computations.test.ts`.

**Testing setup is intentionally Node-only, no jsdom/React Testing Library.** `vitest.config.ts` runs in a plain `node` environment against `app/**/*.test.ts`. Adding `@vitejs/plugin-react` (needed for a jsdom/component-rendering setup) currently conflicts at the npm dependency-resolution level with `@react-router/dev`'s babel 7 pin, because this repo is on Vite 8's rolldown-based toolchain — `@vitejs/plugin-react`'s latest major wants `@rolldown/plugin-babel` (babel 8). If that's resolved upstream and component tests become viable, juice's own `vitest.config.ts` + `src/test/setup.ts` (jsdom stubs for `scrollTo`/`ResizeObserver`/pointer capture) is the reference setup to copy. Until then, put real logic in `app/lib/*.ts` and unit-test it there — route loaders/components stay thin enough that they don't need their own tests.

After changing `prisma/schema.prisma`, run `npm run db:migrate` to generate a migration and regenerate the Prisma client. After changing routes, `npm run typecheck` regenerates route types under `.react-router/types` — do this before trusting type errors in route files.

## Architecture

**Routing**: `app/routes.ts` is the single route config (no filesystem routing). All pages are nested under one `layout("routes/app-layout.tsx", [...])` which renders the sidebar/header chrome. Adding a page means: add the route file under `app/routes/`, register it in `app/routes.ts`, and add nav entries in the `NAV_SECTIONS` and `PAGE_TITLES` maps in `app-layout.tsx`.

**Data flow**: Route modules use React Router's `loader`/`action` convention, importing `prisma` from `~/db.server`. There is no real auth yet, but loaders/actions don't call `prisma.user.findFirst()` directly — they go through `app/lib/auth.server.ts`'s `requireUser()` (throws a 500 if the single user row is missing — expected only pre-seed) or `getUser()` (returns `null` instead of throwing, for the rare case a route wants to render around a missing user), then scope all queries to that user's id (see `dashboard.tsx`, `categories.tsx` for the pattern). Both return the full `User` row (so fields like `payFrequency` are available without a second query). Keeping every route behind this one helper is what will let real auth (per-request sessions instead of "the one user row") land later by changing one file instead of every loader. Most route files under `app/routes/` are still static placeholder UI (empty-state cards, no loader/action) — check whether a given route already has a loader before assuming its data layer exists.

**Single source of truth / computed fields**: The schema deliberately does *not* store derived values. `app/lib/computations.ts` holds every derived calculation (ending balances, investment returns, take-home pay, ending cash, net worth, budget actuals, currency/percent formatting) and the Prisma schema comments call out which fields are computed at query time instead of persisted, e.g.:
- `CreditCardEntry.endingBalance` = starting − actualPayment + interestAccrued
- `InvestmentEntry` monthly return $ and % 
- `PayrollEntry.takeHomePay` = gross − all deductions
- `MonthlyBudget` actual/variance/splitTotal = aggregated from `Transaction` rows
- `NetWorthSnapshot` totals = manual asset/liability fields + aggregates from `InvestmentEntry`/`CreditCardEntry`/cash flow

When adding a new derived value, add a pure function to `computations.ts` rather than storing it on the model or recomputing inline in a loader.

**Month-based partitioning**: Nearly every model that varies monthly stores a `monthYear` string (`"YYYY-01"`) rather than relying on a `DateTime` range query — use `app/lib/constants.ts`'s `toMonthYear`/`currentMonthYear`/`monthYearLabel` helpers to produce/parse it, and filter/index queries by that field (see the `@@index`/`@@unique` constraints in `schema.prisma`, most of which include `monthYear`). Recurring things (fixed expenses, credit cards, investment accounts) follow a template + monthly-entry split: a `FixedExpense`/`CreditCard`/`InvestmentAccount` template row, plus one `*Entry` row per `monthYear` (unique on `[userId, templateId, monthYear]`).

**Categories**: `Category` rows are user-editable and typed by which entity they apply to (`CATEGORY_TYPES` in `app/lib/constants.ts`: `TRANSACTION`, `FIXED_EXPENSE`, `INCOME`, `INVESTMENT`, `CREDIT_CARD`). `DEFAULT_CATEGORIES` in the same file is the source list seeded into the DB — `prisma/seed.ts` currently duplicates this list rather than importing it, so update both if you change the defaults.

**Split transactions**: `Transaction.amount` is always the user's own portion; `totalAmount` is the full bill (null if not split); `splitRatio` is derived from the two. The user enters `totalAmount` first, then `amount`.

**Styling**: UI components come from `@zach-ofalltrades/juice` (installed as `file:../juice`, a sibling repo — see its own `CLAUDE.md`), not bespoke markup/CSS in this repo (project rule 3 above). `app/root.tsx` imports juice's `reset`, `tokens`, and `styles` CSS (in that order) plus `app/app.css`, and sets `data-juice-theme="dark"` on `<html>`.

`app/app.css` keeps FiDance's own design tokens (`--color-*`, `--gradient-*`, `--shadow-glow`, `--space-*`, etc. — the original hand-built dark/indigo/glow identity) and, immediately after, a **"Juice theme adapter"** `:root` block that maps every one of those onto juice's `--juice-*` token contract. Because `app.css` loads after juice's `tokens.css`, this block wins the cascade and juice's components render in FiDance's actual palette instead of juice's generic light/dark default. Two of juice's tokens exist specifically to make this possible: `--juice-color-brand-fill` / `--juice-color-surface(-raised)-fill` (fill tokens that default to a flat color but accept a gradient — Button/Card/Badge CSS reference these via the `background` shorthand, not `background-color`, precisely so a gradient can be substituted) and `--juice-shadow-glow` (off by default, used on hover for primary buttons and `StatCard`). **When extending juice, prefer widening this kind of token contract over hardcoding a color/gradient into component CSS** — it's what keeps juice itself generic while letting FiDance keep its identity.

What's left in `app/app.css` beyond the token block: `app-layout`/`sidebar`/`main-content` chrome (no juice equivalent — this is app-specific shell, not a reusable component), and `.category-dot` (a trivial one-off swatch, not worth componentizing). Tabular data uses juice's `Table` organism (`Table`/`Table.Head`/`Table.Body`/`Table.Row`/`Table.HeaderCell`/`Table.Cell`/`Table.Empty` — see `categories.tsx`), added once a second real table showed up, per the rule above.

Two components were added to juice specifically for this app and are generically reusable, not FiDance-specific: `EmptyState` (icon/title/description/action placeholder) and `StatGrid`/`StatGrid.Card` (a KPI grid, mirrors the `Card`/`Row` compound-component pattern).

**Database**: SQLite for local dev (`prisma/dev.db`, path from `.env`'s `DATABASE_URL`); the schema comment notes swapping the `datasource` provider to `postgresql` for production. `app/db.server.ts` memoizes the Prisma client on `global.__prisma` in development to survive HMR — follow that pattern if you ever need a second client-touching module.
