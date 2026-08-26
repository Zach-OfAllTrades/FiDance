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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Manage the categories used across transactions, expenses, and income.
        </p>
        <button className="btn btn--primary">+ Add Category</button>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className="card">
          <div className="card__body">
            <div className="empty-state">
              <div className="empty-state__icon">🏷️</div>
              <div className="empty-state__title">No categories</div>
              <div className="empty-state__description">
                Run the database seed to create default categories.
              </div>
            </div>
          </div>
        </div>
      ) : (
        Object.entries(grouped).map(([type, cats]) => (
          <div key={type} className="card" style={{ marginBottom: "var(--space-6)" }}>
            <div className="card__header">
              <h2 className="card__title">{TYPE_LABELS[type] || type} Categories</h2>
              <span className="badge badge--neutral">{cats.length}</span>
            </div>
            <div className="card__body">
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
                          <span className="badge badge--neutral" style={{ marginLeft: "var(--space-2)" }}>
                            Default
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${cat.isActive ? "badge--success" : "badge--danger"}`}>
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
