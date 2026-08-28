import { Button, Card, EmptyState, StatGrid, Text } from "@zach-ofalltrades/juice";
import { useNavigate } from "react-router";
import { prisma } from "~/db.server";
import { requireUser } from "~/lib/auth.server";
import {
  computeAvailableCredit,
  computeEndingBalance,
  computeEndingCash,
  computeNetWorth,
  computeTakeHomePay,
  formatCurrency,
  formatPercent,
} from "~/lib/computations";
import { currentMonthYear, monthYearLabel } from "~/lib/constants";
import type { Route } from "./+types/dashboard";

export function meta() {
  return [
    { title: "Dashboard — FiDance" },
    { name: "description", content: "Your financial overview at a glance" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const monthYear = url.searchParams.get("month") || currentMonthYear();

  const user = await requireUser();

  // Fetch all data for this month in parallel
  const [
    transactions,
    payrollEntries,
    incomes,
    creditCards,
    creditCardEntries,
    investmentEntries,
    fixedExpenseEntries,
    netWorthSnapshot,
  ] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: user.id, monthYear } }),
    prisma.payrollEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.income.findMany({ where: { userId: user.id, monthYear } }),
    prisma.creditCard.findMany({ where: { userId: user.id, isActive: true } }),
    prisma.creditCardEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.investmentEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.fixedExpenseEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.netWorthSnapshot.findFirst({ where: { userId: user.id, monthYear } }),
  ]);

  // Compute KPIs
  const totalSpending =
    transactions.reduce((sum, tx) => sum + tx.amount, 0) +
    fixedExpenseEntries.reduce((sum, fe) => sum + (fe.actualAmount || 0), 0);

  const payrollTakeHome = payrollEntries.reduce((sum, p) => sum + computeTakeHomePay(p), 0);
  const otherIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalIncome = payrollTakeHome + otherIncome;

  const availableCredit = computeAvailableCredit(creditCards, creditCardEntries);

  const totalInvestments = investmentEntries.reduce((sum, ie) => sum + ie.endingBalance, 0);
  const totalCreditDebt = creditCardEntries.reduce((sum, ce) => sum + computeEndingBalance(ce), 0);

  // Cash flow (simplified — starting cash would need previous month's ending)
  const variableCashExpenses = transactions
    .filter((tx) => tx.isCash)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const fixedCashExpenses = fixedExpenseEntries
    .filter((fe) => fe.isCash)
    .reduce((sum, fe) => sum + (fe.actualAmount || 0), 0);
  const endingCash = computeEndingCash({
    startingCash: 0, // TODO: carry forward from previous month
    payrollTakeHome,
    otherIncome,
    variableCashExpenses,
    fixedCashExpenses,
  });

  // Net worth
  const nwResult = computeNetWorth({
    realEstateValue: netWorthSnapshot?.realEstateValue || 0,
    vehicleValue: netWorthSnapshot?.vehicleValue || 0,
    otherAssets: netWorthSnapshot?.otherAssets || 0,
    mortgagePrincipal: netWorthSnapshot?.mortgagePrincipal || 0,
    studentLoans: netWorthSnapshot?.studentLoans || 0,
    autoLoans: netWorthSnapshot?.autoLoans || 0,
    otherLiabilities: netWorthSnapshot?.otherLiabilities || 0,
    totalInvestments,
    totalCashBalance: endingCash,
    totalCreditDebt,
  });

  const savingsRate = totalIncome > 0 ? (totalIncome - totalSpending) / totalIncome : 0;

  return {
    monthYear,
    monthLabel: monthYearLabel(monthYear),
    kpis: {
      netWorth: nwResult.netWorth,
      availableCredit,
      endingCash,
      savingsRate,
      totalSpending,
      totalIncome,
    },
  };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { monthLabel, kpis } = loaderData;
  const navigate = useNavigate();

  const kpiCards = [
    {
      label: "Net Worth",
      value: formatCurrency(kpis.netWorth),
      tone: kpis.netWorth >= 0 ? ("positive" as const) : ("negative" as const),
    },
    {
      label: "Monthly Income",
      value: formatCurrency(kpis.totalIncome),
      tone: "positive" as const,
    },
    {
      label: "Monthly Spending",
      value: formatCurrency(kpis.totalSpending),
      tone: "negative" as const,
    },
    {
      label: "Savings Rate",
      value: formatPercent(kpis.savingsRate),
      tone: kpis.savingsRate >= 0.2 ? ("positive" as const) : ("negative" as const),
    },
    {
      label: "Available Credit",
      value: formatCurrency(kpis.availableCredit),
      tone: "default" as const,
    },
    {
      label: "Cash Balance",
      value: formatCurrency(kpis.endingCash),
      tone: kpis.endingCash >= 0 ? ("positive" as const) : ("negative" as const),
    },
  ];

  return (
    <div>
      <Text tone="muted" style={{ marginBottom: "var(--space-6)" }}>
        Showing data for{" "}
        <strong style={{ color: "var(--color-text-primary)" }}>{monthLabel}</strong>
      </Text>

      <StatGrid style={{ marginBottom: "var(--space-8)" }}>
        {kpiCards.map((card) => (
          <StatGrid.Card key={card.label} label={card.label} value={card.value} tone={card.tone} />
        ))}
      </StatGrid>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        <Card>
          <Card.Header>
            <Card.Title>Recent Transactions</Card.Title>
          </Card.Header>
          <Card.Body>
            <EmptyState
              icon="📝"
              title="No transactions yet"
              description="Start logging your expenses to see them here."
              action={
                <Button variant="primary" onClick={() => navigate("/transactions")}>
                  Add Transaction
                </Button>
              }
            />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Budget Overview</Card.Title>
          </Card.Header>
          <Card.Body>
            <EmptyState
              icon="📊"
              title="No budgets set"
              description="Set monthly budgets to track spending by category."
              action={
                <Button variant="primary" onClick={() => navigate("/budgets")}>
                  Set Budgets
                </Button>
              }
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
