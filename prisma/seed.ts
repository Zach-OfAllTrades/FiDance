import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../app/lib/constants";

const prisma = new PrismaClient();

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
