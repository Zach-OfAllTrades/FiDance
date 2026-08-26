import { describe, expect, it } from "vitest";
import {
  computeAvailableCredit,
  computeBudgetActuals,
  computeEndingBalance,
  computeEndingCash,
  computeInvestmentReturnDollar,
  computeInvestmentReturnPercent,
  computeNetWorth,
  computeSplitRatio,
  computeTakeHomePay,
  formatCurrency,
  formatPercent,
} from "./computations";

describe("computeEndingBalance", () => {
  it("subtracts payment and adds interest", () => {
    expect(
      computeEndingBalance({ startingBalance: 1000, actualPayment: 200, interestAccrued: 15 })
    ).toBe(815);
  });
});

describe("computeAvailableCredit", () => {
  it("subtracts total ending balances from total limits", () => {
    const cards = [{ creditLimit: 5000 }, { creditLimit: 2000 }];
    const entries = [
      { startingBalance: 1000, actualPayment: 200, interestAccrued: 0 },
      { startingBalance: 500, actualPayment: 0, interestAccrued: 10 },
    ];
    // limits: 7000, debt: 800 + 510 = 1310
    expect(computeAvailableCredit(cards, entries)).toBe(5690);
  });
});

describe("computeInvestmentReturnDollar", () => {
  it("is ending minus starting minus contributions", () => {
    expect(
      computeInvestmentReturnDollar({
        startingBalance: 1000,
        contributions: 100,
        endingBalance: 1150,
      })
    ).toBe(50);
  });
});

describe("computeInvestmentReturnPercent", () => {
  it("divides the dollar return by the base", () => {
    expect(
      computeInvestmentReturnPercent({
        startingBalance: 1000,
        contributions: 0,
        endingBalance: 1100,
      })
    ).toBeCloseTo(0.1);
  });

  it("returns null when starting balance and contributions are both zero", () => {
    expect(
      computeInvestmentReturnPercent({ startingBalance: 0, contributions: 0, endingBalance: 0 })
    ).toBeNull();
  });
});

describe("computeTakeHomePay", () => {
  it("subtracts every deduction from gross income", () => {
    expect(
      computeTakeHomePay({
        grossIncome: 5000,
        federalTax: 800,
        stateTax: 200,
        ssTax: 310,
        medicareTax: 72,
        hsa: 100,
        dentalBenefit: 20,
        medicalBenefit: 150,
        visionBenefit: 10,
        lifeBenefit: 5,
        retirementContribution: 300,
        otherDeductions: 0,
      })
    ).toBe(3033);
  });
});

describe("computeBudgetActuals", () => {
  it("sums amounts and split totals per category", () => {
    const result = computeBudgetActuals([
      { categoryId: "grocery", amount: 50, isSplit: false, totalAmount: null },
      { categoryId: "grocery", amount: 25, isSplit: true, totalAmount: 50 },
      { categoryId: "dining", amount: 40, isSplit: false, totalAmount: null },
    ]);

    expect(result.get("grocery")).toEqual({ actual: 75, splitTotal: 50 });
    expect(result.get("dining")).toEqual({ actual: 40, splitTotal: 0 });
  });
});

describe("computeEndingCash", () => {
  it("adds receivables and subtracts payables from starting cash", () => {
    expect(
      computeEndingCash({
        startingCash: 1000,
        payrollTakeHome: 3000,
        otherIncome: 200,
        variableCashExpenses: 500,
        fixedCashExpenses: 1200,
      })
    ).toBe(2500);
  });
});

describe("computeNetWorth", () => {
  it("computes total assets, liabilities, and net worth", () => {
    const result = computeNetWorth({
      realEstateValue: 400000,
      vehicleValue: 20000,
      otherAssets: 5000,
      mortgagePrincipal: 300000,
      studentLoans: 20000,
      autoLoans: 10000,
      otherLiabilities: 0,
      totalInvestments: 50000,
      totalCashBalance: 10000,
      totalCreditDebt: 2000,
    });

    expect(result.totalAssets).toBe(485000);
    expect(result.totalLiabilities).toBe(332000);
    expect(result.netWorth).toBe(153000);
  });
});

describe("computeSplitRatio", () => {
  it("divides the user's amount by the total", () => {
    expect(computeSplitRatio(100, 50)).toBeCloseTo(0.5);
  });

  it("returns 1 when there is no total (not split)", () => {
    expect(computeSplitRatio(null, 50)).toBe(1);
    expect(computeSplitRatio(0, 50)).toBe(1);
  });
});

describe("formatCurrency", () => {
  it("formats a number as USD", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });
});

describe("formatPercent", () => {
  it("formats a decimal ratio as a percentage string", () => {
    expect(formatPercent(0.1234)).toBe("12.34%");
  });

  it("returns N/A for null", () => {
    expect(formatPercent(null)).toBe("N/A");
  });
});
