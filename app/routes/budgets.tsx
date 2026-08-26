import type { Route } from "./+types/budgets";

export function meta() {
  return [
    { title: "Budgets — FiDance" },
    { name: "description", content: "Set and track monthly budgets by category" },
  ];
}

export default function Budgets() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Set monthly budgets and track actual spending vs. planned.
        </p>
        <button className="btn btn--primary">+ Set Budget</button>
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Budget vs. Actual</h2>
        </div>
        <div className="card__body">
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__title">No budgets configured</div>
            <div className="empty-state__description">
              Create budgets for each spending category to track your progress.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
