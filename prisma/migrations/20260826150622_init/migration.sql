-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "payFrequency" TEXT NOT NULL DEFAULT 'BIWEEKLY',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "monthYear" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "amount" REAL NOT NULL,
    "totalAmount" REAL,
    "splitRatio" REAL NOT NULL DEFAULT 0.5,
    "isCash" BOOLEAN NOT NULL DEFAULT false,
    "isSplit" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyBudget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "budgetedAmount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyBudget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FixedExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "expectedAmount" REAL NOT NULL,
    "dueDay" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FixedExpenseEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fixedExpenseId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "expectedAmount" REAL NOT NULL,
    "actualAmount" REAL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isCash" BOOLEAN NOT NULL DEFAULT false,
    "paidDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FixedExpenseEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FixedExpenseEntry_fixedExpenseId_fkey" FOREIGN KEY ("fixedExpenseId") REFERENCES "FixedExpense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountName" TEXT NOT NULL,
    "creditLimit" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CreditCardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "startingBalance" REAL NOT NULL,
    "expectedPayment" REAL,
    "actualPayment" REAL NOT NULL DEFAULT 0,
    "interestAccrued" REAL NOT NULL DEFAULT 0,
    "rewardsEarned" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CreditCardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditCardEntry_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvestmentAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InvestmentEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "investmentAccountId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "startingBalance" REAL NOT NULL,
    "contributions" REAL NOT NULL DEFAULT 0,
    "endingBalance" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InvestmentEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InvestmentEntry_investmentAccountId_fkey" FOREIGN KEY ("investmentAccountId") REFERENCES "InvestmentAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PayrollEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "payDate" DATETIME NOT NULL,
    "grossIncome" REAL NOT NULL,
    "federalTax" REAL NOT NULL DEFAULT 0,
    "stateTax" REAL NOT NULL DEFAULT 0,
    "ssTax" REAL NOT NULL DEFAULT 0,
    "medicareTax" REAL NOT NULL DEFAULT 0,
    "hsa" REAL NOT NULL DEFAULT 0,
    "dentalBenefit" REAL NOT NULL DEFAULT 0,
    "medicalBenefit" REAL NOT NULL DEFAULT 0,
    "visionBenefit" REAL NOT NULL DEFAULT 0,
    "lifeBenefit" REAL NOT NULL DEFAULT 0,
    "retirementContribution" REAL NOT NULL DEFAULT 0,
    "otherDeductions" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PayrollEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "monthYear" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isTaxable" BOOLEAN NOT NULL DEFAULT true,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NetWorthSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "realEstateValue" REAL NOT NULL DEFAULT 0,
    "vehicleValue" REAL NOT NULL DEFAULT 0,
    "otherAssets" REAL NOT NULL DEFAULT 0,
    "mortgagePrincipal" REAL NOT NULL DEFAULT 0,
    "studentLoans" REAL NOT NULL DEFAULT 0,
    "autoLoans" REAL NOT NULL DEFAULT 0,
    "otherLiabilities" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NetWorthSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavingsGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetAmount" REAL NOT NULL,
    "currentAmount" REAL NOT NULL DEFAULT 0,
    "targetDate" DATETIME,
    "investmentAccountId" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SavingsGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavingsGoal_investmentAccountId_fkey" FOREIGN KEY ("investmentAccountId") REFERENCES "InvestmentAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Category_userId_type_idx" ON "Category"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_type_key" ON "Category"("userId", "name", "type");

-- CreateIndex
CREATE INDEX "Transaction_userId_monthYear_idx" ON "Transaction"("userId", "monthYear");

-- CreateIndex
CREATE INDEX "Transaction_userId_categoryId_idx" ON "Transaction"("userId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyBudget_userId_monthYear_categoryId_key" ON "MonthlyBudget"("userId", "monthYear", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "FixedExpenseEntry_userId_fixedExpenseId_monthYear_key" ON "FixedExpenseEntry"("userId", "fixedExpenseId", "monthYear");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCardEntry_userId_creditCardId_monthYear_key" ON "CreditCardEntry"("userId", "creditCardId", "monthYear");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentEntry_userId_investmentAccountId_monthYear_key" ON "InvestmentEntry"("userId", "investmentAccountId", "monthYear");

-- CreateIndex
CREATE INDEX "PayrollEntry_userId_monthYear_idx" ON "PayrollEntry"("userId", "monthYear");

-- CreateIndex
CREATE INDEX "Income_userId_monthYear_idx" ON "Income"("userId", "monthYear");

-- CreateIndex
CREATE UNIQUE INDEX "NetWorthSnapshot_userId_monthYear_key" ON "NetWorthSnapshot"("userId", "monthYear");

-- CreateIndex
CREATE INDEX "SavingsGoal_userId_idx" ON "SavingsGoal"("userId");
