import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("routes/app-layout.tsx", [
    index("routes/dashboard.tsx"),
    route("transactions", "routes/transactions.tsx"),
    route("budgets", "routes/budgets.tsx"),
    route("fixed-expenses", "routes/fixed-expenses.tsx"),
    route("credit-cards", "routes/credit-cards.tsx"),
    route("investments", "routes/investments.tsx"),
    route("income", "routes/income.tsx"),
    route("net-worth", "routes/net-worth.tsx"),
    route("savings-goals", "routes/savings-goals.tsx"),
    route("categories", "routes/categories.tsx"),
  ]),
] satisfies RouteConfig;
