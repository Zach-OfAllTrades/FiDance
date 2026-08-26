# FiDance

A personal finance tracker for managing monthly cash flow, budgets, debt, investments, and net worth — built as a single-user replacement for a spreadsheet-based financial tracker. See [`overview.md`](./overview.md) for the original product spec.

## What it does

FiDance organizes your finances by month (with an annual rollup) across a few connected areas:

- **Transactions** — variable spending by category, with support for split expenses (shared bills where you only owe a portion).
- **Budgets** — planned vs. actual spending per category, computed live from logged transactions.
- **Fixed Expenses** — recurring bills (mortgage, utilities, subscriptions) tracked as expected vs. actual per month.
- **Credit Cards** — balances, payments, interest, and available credit across accounts.
- **Investments** — account balances, contributions, and computed dollar/percent returns.
- **Income** — payroll entries with full deduction breakdowns, plus one-off income (freelance, gifts, refunds).
- **Net Worth** — assets and liabilities rolled up from the above, plus manually entered items like real estate and loans.
- **Savings Goals** — target vs. current progress toward named goals.
- **Dashboard** — a monthly overview of the key numbers from all of the above.

Every derived number (ending balances, returns, take-home pay, net worth, etc.) is computed at query time from the underlying entries rather than stored — see `app/lib/computations.ts`.

This is an early-stage project: the dashboard and categories pages are wired to real data, and the rest are scaffolded pages that will grow forms and data as the app develops.

## Tech stack

- [React Router v8](https://reactrouter.com/) in framework (SSR) mode
- [Prisma](https://www.prisma.io/) + SQLite for local development (swappable to PostgreSQL for production)
- [`@zach-ofalltrades/juice`](https://github.com/Zach-OfAllTrades/juice) for UI components, themed to FiDance's own design tokens
- TypeScript, [Biome](https://biomejs.dev/) for lint/format, [Vitest](https://vitest.dev/) for tests

## Getting started

### Prerequisites

- Node.js and npm
- A sibling checkout of [`juice`](https://github.com/Zach-OfAllTrades/juice) at `../juice` (installed as a local `file:` dependency — see `package.json`)

### Setup

```bash
npm install

# Configure your database connection
cp .env.example .env   # if present, otherwise create .env with DATABASE_URL="file:./prisma/dev.db"

npm run db:migrate      # create the local SQLite database and apply migrations
npm run db:seed         # seed default categories and a sample savings goal

npm run dev              # start the dev server at http://localhost:5173
```

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Regenerate route types and run `tsc` |
| `npm test` | Run the test suite (Vitest) |
| `npm run lint` / `format` / `check` | Biome lint / format / lint+format |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed default categories and sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Drop, recreate, and reseed the database |

## Deployment

A `Dockerfile` is included for containerized deployment (build with `docker build -t fidance .`, run with `docker run -p 3000:3000 fidance`). Any platform that runs a standard Node server works too — deploy the `build/` output produced by `npm run build` and run it with `npm run start`.

## Contributing

See [`CLAUDE.md`](./CLAUDE.md) for architecture notes and project conventions if you're working on this codebase with an AI coding agent.
