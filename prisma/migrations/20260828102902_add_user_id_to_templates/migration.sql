/*
  Warnings:

  - Added the required column `userId` to the `CreditCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `FixedExpense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `InvestmentAccount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CreditCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "creditLimit" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CreditCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CreditCard" ("accountName", "createdAt", "creditLimit", "id", "isActive", "updatedAt") SELECT "accountName", "createdAt", "creditLimit", "id", "isActive", "updatedAt" FROM "CreditCard";
DROP TABLE "CreditCard";
ALTER TABLE "new_CreditCard" RENAME TO "CreditCard";
CREATE INDEX "CreditCard_userId_idx" ON "CreditCard"("userId");
CREATE TABLE "new_FixedExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "expectedAmount" REAL NOT NULL,
    "dueDay" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FixedExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FixedExpense" ("categoryId", "createdAt", "dueDay", "expectedAmount", "id", "isActive", "name", "updatedAt") SELECT "categoryId", "createdAt", "dueDay", "expectedAmount", "id", "isActive", "name", "updatedAt" FROM "FixedExpense";
DROP TABLE "FixedExpense";
ALTER TABLE "new_FixedExpense" RENAME TO "FixedExpense";
CREATE INDEX "FixedExpense_userId_idx" ON "FixedExpense"("userId");
CREATE TABLE "new_InvestmentAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InvestmentAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InvestmentAccount" ("accountName", "category", "createdAt", "id", "isActive", "updatedAt") SELECT "accountName", "category", "createdAt", "id", "isActive", "updatedAt" FROM "InvestmentAccount";
DROP TABLE "InvestmentAccount";
ALTER TABLE "new_InvestmentAccount" RENAME TO "InvestmentAccount";
CREATE INDEX "InvestmentAccount_userId_idx" ON "InvestmentAccount"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
