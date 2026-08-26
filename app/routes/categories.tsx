import { Badge, Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";
import { prisma } from "~/db.server";
import { CATEGORY_TYPES } from "~/lib/constants";
import type { Route } from "./+types/categories";

export function meta() {
  return [
    { title: "Categories — FiDance" },
    { name: "description", content: "Manage your spending and income categories" },
  ];
}

export async function loader() {
  const user = await prisma.user.findFirst();
  if (!user) return { categories: [], categoryTypes: Object.values(CATEGORY_TYPES) };

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
  });

  return { categories, categoryTypes: Object.values(CATEGORY_TYPES) };
}

const TYPE_LABELS: Record<string, string> = {
  TRANSACTION: "Transaction",
  FIXED_EXPENSE: "Fixed Expense",
  INCOME: "Income",
  INVESTMENT: "Investment",
  CREDIT_CARD: "Credit Card",
};

export default function Categories({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData;

  // Group categories by type
  const grouped = categories.reduce<Record<string, typeof categories>>((acc, cat) => {
    if (!acc[cat.type]) acc[cat.type] = [];
    acc[cat.type].push(cat);
    return acc;
  }, {});

  return (
    <div>
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ Add Category</Button>}
      >
        <Text tone="muted">
          Manage the categories used across transactions, expenses, and income.
        </Text>
      </Row>

      {Object.entries(grouped).length === 0 ? (
        <Card>
          <Card.Body>
            <EmptyState
              icon="🏷️"
              title="No categories"
              description="Run the database seed to create default categories."
            />
          </Card.Body>
        </Card>
      ) : (
        Object.entries(grouped).map(([type, cats]) => (
          <Card key={type} style={{ marginBottom: "var(--space-6)" }}>
            <Card.Header
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Card.Title>{TYPE_LABELS[type] || type} Categories</Card.Title>
              <Badge>{cats.length}</Badge>
            </Card.Header>
            <Card.Body>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Color</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cats.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <span
                          className="category-dot"
                          style={{ backgroundColor: cat.color || "#6366f1" }}
                        />
                      </td>
                      <td style={{ color: "var(--color-text-primary)" }}>
                        {cat.name}
                        {cat.isDefault && (
                          <Badge style={{ marginLeft: "var(--space-2)" }}>Default</Badge>
                        )}
                      </td>
                      <td>
                        <Badge variant={cat.isActive ? "success" : "danger"}>
                          {cat.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
