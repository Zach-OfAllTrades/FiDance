import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
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

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create default user
  const user = await prisma.user.upsert({
    where: { email: "default@fidance.local" },
    update: {},
    create: {
      name: "Default User",
      email: "default@fidance.local",
      payFrequency: "BIWEEKLY",
    },
  });
  console.log(`  ✓ User: ${user.name} (${user.id})`);

  // 2. Seed default categories
  let categoryCount = 0;
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: cat.name,
          type: cat.type,
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: cat.name,
        type: cat.type,
        color: cat.color,
        isDefault: true,
        sortOrder: categoryCount,
      },
    });
    categoryCount++;
  }
  console.log(`  ✓ Categories: ${categoryCount} defaults seeded`);

  // 3. Seed a sample savings goal
  const existingGoals = await prisma.savingsGoal.count({
    where: { userId: user.id },
  });
  if (existingGoals === 0) {
    await prisma.savingsGoal.create({
      data: {
        userId: user.id,
        name: "Emergency Fund",
        targetAmount: 15000,
        currentAmount: 3500,
        notes: "6 months of expenses",
      },
    });
    console.log("  ✓ Sample savings goal created");
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
