/**
 * Derived field computations for FiDance.
 *
 * These functions compute values that are NOT stored in the database
 * (single source of truth principle). They run at query time in loaders.
 */

// ──────────────────────────────────────────────
// Credit Card
// ──────────────────────────────────────────────

export interface CreditCardEntryData {
  startingBalance: number;
  actualPayment: number;
  interestAccrued: number;
}

/**
 * Computes the ending balance for a credit card entry.
 * endingBalance = startingBalance - actualPayment + interestAccrued
 */
export function computeEndingBalance(entry: CreditCardEntryData): number {
  return entry.startingBalance - entry.actualPayment + entry.interestAccrued;
}

/**
 * Computes available credit across all credit cards for a given month.
 */
export function computeAvailableCredit(
  cards: Array<{ creditLimit: number }>,
  entries: CreditCardEntryData[]
): number {
  const totalLimits = cards.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalDebt = entries.reduce((sum, e) => sum + computeEndingBalance(e), 0);
  return totalLimits - totalDebt;
}

// ──────────────────────────────────────────────
// Investment Returns
// ──────────────────────────────────────────────

export interface InvestmentEntryData {
  startingBalance: number;
  contributions: number;
  endingBalance: number;
}

/**
 * Computes the dollar return for an investment entry.
 */
export function computeInvestmentReturnDollar(entry: InvestmentEntryData): number {
  return entry.endingBalance - entry.startingBalance - entry.contributions;
}

/**
 * Computes the percentage return for an investment entry.
 * Returns null if the base (starting + contributions) is zero to avoid division by zero.
 */
export function computeInvestmentReturnPercent(entry: InvestmentEntryData): number | null {
  const base = entry.startingBalance + entry.contributions;
  if (base === 0) return null;
  return (entry.endingBalance - base) / base;
}

// ──────────────────────────────────────────────
// Payroll
// ──────────────────────────────────────────────

export interface PayrollEntryData {
  grossIncome: number;
  federalTax: number;
  stateTax: number;
  ssTax: number;
  medicareTax: number;
  hsa: number;
  dentalBenefit: number;
  medicalBenefit: number;
  visionBenefit: number;
  lifeBenefit: number;
  retirementContribution: number;
  otherDeductions: number;
}

/**
 * Computes take-home pay from a payroll entry.
 */
export function computeTakeHomePay(entry: PayrollEntryData): number {
  const totalDeductions =
    entry.federalTax +
    entry.stateTax +
    entry.ssTax +
    entry.medicareTax +
    entry.hsa +
    entry.dentalBenefit +
    entry.medicalBenefit +
    entry.visionBenefit +
    entry.lifeBenefit +
    entry.retirementContribution +
    entry.otherDeductions;

  return entry.grossIncome - totalDeductions;
}

// ──────────────────────────────────────────────
// Monthly Budget
// ──────────────────────────────────────────────

export interface TransactionForBudget {
  categoryId: string;
  amount: number;
  isSplit: boolean;
  totalAmount: number | null;
}

/**
 * Computes actual spending and split totals by category from transactions.
 */
export function computeBudgetActuals(
  transactions: TransactionForBudget[]
): Map<string, { actual: number; splitTotal: number }> {
  const result = new Map<string, { actual: number; splitTotal: number }>();

  for (const tx of transactions) {
    const current = result.get(tx.categoryId) || { actual: 0, splitTotal: 0 };
    current.actual += tx.amount;
    if (tx.isSplit && tx.totalAmount != null) {
      current.splitTotal += tx.totalAmount;
    }
    result.set(tx.categoryId, current);
  }

  return result;
}

// ──────────────────────────────────────────────
// Cash Flow Engine
// ──────────────────────────────────────────────

export interface CashFlowInputs {
  startingCash: number;
  payrollTakeHome: number; // sum of computed take-home pay for all payroll entries
  otherIncome: number; // sum of Income.amount entries
  variableCashExpenses: number; // sum of Transaction.amount WHERE isCash = true
  fixedCashExpenses: number; // sum of FixedExpenseEntry.actualAmount WHERE isCash = true
}

/**
 * Computes ending cash balance for a month.
 * Ending Cash = Starting Cash + Receivables - Payables
 */
export function computeEndingCash(inputs: CashFlowInputs): number {
  const receivables = inputs.payrollTakeHome + inputs.otherIncome;
  const payables = inputs.variableCashExpenses + inputs.fixedCashExpenses;
  return inputs.startingCash + receivables - payables;
}

// ──────────────────────────────────────────────
// Net Worth
// ──────────────────────────────────────────────

export interface NetWorthInputs {
  // From NetWorthSnapshot (manually entered)
  realEstateValue: number;
  vehicleValue: number;
  otherAssets: number;
  mortgagePrincipal: number;
  studentLoans: number;
  autoLoans: number;
  otherLiabilities: number;
  // Derived from other entities
  totalInvestments: number; // SUM(InvestmentEntry.endingBalance) for month
  totalCashBalance: number; // from cash flow engine
  totalCreditDebt: number; // SUM(CreditCardEntry ending balances) for month
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

/**
 * Computes total assets, liabilities, and net worth.
 */
export function computeNetWorth(inputs: NetWorthInputs): NetWorthResult {
  const totalAssets =
    inputs.realEstateValue +
    inputs.vehicleValue +
    inputs.otherAssets +
    inputs.totalInvestments +
    inputs.totalCashBalance;

  const totalLiabilities =
    inputs.mortgagePrincipal +
    inputs.studentLoans +
    inputs.autoLoans +
    inputs.otherLiabilities +
    inputs.totalCreditDebt;

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
  };
}

// ──────────────────────────────────────────────
// Split Transaction
// ──────────────────────────────────────────────

/**
 * Derives the split ratio from totalAmount and user's portion.
 * Returns 1 if totalAmount is 0 or null (no split).
 */
export function computeSplitRatio(totalAmount: number | null, userAmount: number): number {
  if (totalAmount == null || totalAmount === 0) return 1;
  return userAmount / totalAmount;
}

// ──────────────────────────────────────────────
// Formatting utilities
// ──────────────────────────────────────────────

/**
 * Formats a number as USD currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a decimal ratio as a percentage string.
 * e.g. 0.1234 → "12.34%"
 */
export function formatPercent(ratio: number | null): string {
  if (ratio == null) return "N/A";
  return `${(ratio * 100).toFixed(2)}%`;
}
