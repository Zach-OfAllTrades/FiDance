import { prisma } from "~/db.server";
import {
  computeEndingBalance,
  computeAvailableCredit,
  computeTakeHomePay,
  computeEndingCash,
  computeNetWorth,
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

  // Get the default user
  const user = await prisma.user.findFirst();
  if (!user) {
    return {
      monthYear,
      monthLabel: monthYearLabel(monthYear),
      kpis: {
        netWorth: 0,
        availableCredit: 0,
        endingCash: 0,
        savingsRate: 0,
        totalSpending: 0,
        totalIncome: 0,
      },
    };
  }

  // Fetch all data for this month in parallel
  const [transactions, payrollEntries, incomes, creditCards, creditCardEntries, investmentEntries, fixedExpenseEntries, netWorthSnapshot] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: user.id, monthYear } }),
    prisma.payrollEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.income.findMany({ where: { userId: user.id, monthYear } }),
    prisma.creditCard.findMany({ where: { isActive: true } }),
    prisma.creditCardEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.investmentEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.fixedExpenseEntry.findMany({ where: { userId: user.id, monthYear } }),
    prisma.netWorthSnapshot.findFirst({ where: { userId: user.id, monthYear } }),
  ]);

  // Compute KPIs
  const totalSpending = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    + fixedExpenseEntries.reduce((sum, fe) => sum + (fe.actualAmount || 0), 0);

  const payrollTakeHome = payrollEntries.reduce((sum, p) => sum + computeTakeHomePay(p), 0);
  const otherIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalIncome = payrollTakeHome + otherIncome;

  const availableCredit = computeAvailableCredit(creditCards, creditCardEntries);

  const totalInvestments = investmentEntries.reduce((sum, ie) => sum + ie.endingBalance, 0);
  const totalCreditDebt = creditCardEntries.reduce((sum, ce) => sum + computeEndingBalance(ce), 0);

  // Cash flow (simplified — starting cash would need previous month's ending)
  const variableCashExpenses = transactions.filter(tx => tx.isCash).reduce((sum, tx) => sum + tx.amount, 0);
  const fixedCashExpenses = fixedExpenseEntries.filter(fe => fe.isCash).reduce((sum, fe) => sum + (fe.actualAmount || 0), 0);
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

  const kpiCards = [
    {
      label: "Net Worth",
      value: formatCurrency(kpis.netWorth),
      className: kpis.netWorth >= 0 ? "kpi-card__value--positive" : "kpi-card__value--negative",
    },
    {
      label: "Monthly Income",
      value: formatCurrency(kpis.totalIncome),
      className: "kpi-card__value--positive",
    },
    {
      label: "Monthly Spending",
      value: formatCurrency(kpis.totalSpending),
      className: "kpi-card__value--negative",
    },
    {
      label: "Savings Rate",
      value: formatPercent(kpis.savingsRate),
      className: kpis.savingsRate >= 0.2 ? "kpi-card__value--positive" : "kpi-card__value--negative",
    },
    {
      label: "Available Credit",
      value: formatCurrency(kpis.availableCredit),
      className: "",
    },
    {
      label: "Cash Balance",
      value: formatCurrency(kpis.endingCash),
      className: kpis.endingCash >= 0 ? "kpi-card__value--positive" : "kpi-card__value--negative",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "var(--space-6)", color: "var(--color-text-secondary)" }}>
        Showing data for <strong style={{ color: "var(--color-text-primary)" }}>{monthLabel}</strong>
      </div>

      <div className="kpi-grid">
        {kpiCards.map((card) => (
          <div key={card.label} className="kpi-card">
            <div className="kpi-card__label">{card.label}</div>
            <div className={`kpi-card__value ${card.className}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Recent Transactions</h2>
          </div>
          <div className="card__body">
            <div className="empty-state">
              <div className="empty-state__icon">📝</div>
              <div className="empty-state__title">No transactions yet</div>
              <div className="empty-state__description">
                Start logging your expenses to see them here.
              </div>
              <a href="/transactions" className="btn btn--primary">Add Transaction</a>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Budget Overview</h2>
          </div>
          <div className="card__body">
            <div className="empty-state">
              <div className="empty-state__icon">📊</div>
              <div className="empty-state__title">No budgets set</div>
              <div className="empty-state__description">
                Set monthly budgets to track spending by category.
              </div>
              <a href="/budgets" className="btn btn--primary">Set Budgets</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
