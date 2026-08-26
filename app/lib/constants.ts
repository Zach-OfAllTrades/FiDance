// ──────────────────────────────────────────────
// Category types — determines which entity a category belongs to
// ──────────────────────────────────────────────
export const CATEGORY_TYPES = {
  TRANSACTION: "TRANSACTION",
  FIXED_EXPENSE: "FIXED_EXPENSE",
  INCOME: "INCOME",
  INVESTMENT: "INVESTMENT",
  CREDIT_CARD: "CREDIT_CARD",
} as const;

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

// ──────────────────────────────────────────────
// Pay frequency options
// ──────────────────────────────────────────────
export const PAY_FREQUENCIES = {
  WEEKLY: "WEEKLY",
  BIWEEKLY: "BIWEEKLY",
  SEMI_MONTHLY: "SEMI_MONTHLY",
  MONTHLY: "MONTHLY",
} as const;

export type PayFrequency = (typeof PAY_FREQUENCIES)[keyof typeof PAY_FREQUENCIES];

export const PAY_FREQUENCY_LABELS: Record<PayFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly (Every 2 Weeks)",
  SEMI_MONTHLY: "Semi-Monthly (1st & 15th)",
  MONTHLY: "Monthly",
};

// ──────────────────────────────────────────────
// Default categories (seeded on first run)
// ──────────────────────────────────────────────
export interface DefaultCategory {
  name: string;
  type: CategoryType;
  color: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Transaction categories
  { name: "Grocery", type: "TRANSACTION", color: "#4CAF50" },
  { name: "Dining", type: "TRANSACTION", color: "#FF9800" },
  { name: "Entertainment", type: "TRANSACTION", color: "#9C27B0" },
  { name: "Dogs", type: "TRANSACTION", color: "#795548" },
  { name: "Kids", type: "TRANSACTION", color: "#E91E63" },
  { name: "Alcohol", type: "TRANSACTION", color: "#F44336" },
  { name: "Car", type: "TRANSACTION", color: "#607D8B" },
  { name: "Business", type: "TRANSACTION", color: "#3F51B5" },
  { name: "Home", type: "TRANSACTION", color: "#009688" },
  { name: "Misc", type: "TRANSACTION", color: "#9E9E9E" },

  // Fixed expense categories
  { name: "Mortgage", type: "FIXED_EXPENSE", color: "#1565C0" },
  { name: "Utilities", type: "FIXED_EXPENSE", color: "#FFA726" },
  { name: "Home Services", type: "FIXED_EXPENSE", color: "#66BB6A" },
  { name: "Debt", type: "FIXED_EXPENSE", color: "#EF5350" },
  { name: "Subscriptions", type: "FIXED_EXPENSE", color: "#AB47BC" },
  { name: "Kids", type: "FIXED_EXPENSE", color: "#EC407A" },
  { name: "Insurance", type: "FIXED_EXPENSE", color: "#42A5F5" },

  // Income categories
  { name: "Freelance", type: "INCOME", color: "#26A69A" },
  { name: "Side Hustle", type: "INCOME", color: "#7E57C2" },
  { name: "Reimbursement", type: "INCOME", color: "#29B6F6" },
  { name: "Gift", type: "INCOME", color: "#EC407A" },
  { name: "Bonus", type: "INCOME", color: "#FFB74D" },
  { name: "Sale", type: "INCOME", color: "#8D6E63" },
  { name: "Tax Refund", type: "INCOME", color: "#66BB6A" },
  { name: "Other", type: "INCOME", color: "#BDBDBD" },

  // Investment categories
  { name: "Roth IRA", type: "INVESTMENT", color: "#5C6BC0" },
  { name: "401(k)", type: "INVESTMENT", color: "#26C6DA" },
  { name: "Trading", type: "INVESTMENT", color: "#FF7043" },
  { name: "Savings", type: "INVESTMENT", color: "#66BB6A" },
];

// ──────────────────────────────────────────────
// Month/Year helpers
// ──────────────────────────────────────────────
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Formats a Date into a "YYYY-MM" string for monthYear fields.
 */
export function toMonthYear(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Returns the current month-year string.
 */
export function currentMonthYear(): string {
  return toMonthYear(new Date());
}

/**
 * Parses a "YYYY-MM" string into a label like "August 2026".
 */
export function monthYearLabel(monthYear: string): string {
  const [yearStr, monthStr] = monthYear.split("-");
  const monthIndex = parseInt(monthStr, 10) - 1;
  return `${MONTHS[monthIndex]} ${yearStr}`;
}
