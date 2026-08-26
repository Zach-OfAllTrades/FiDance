import type { Route } from "./+types/fixed-expenses";

export function meta() {
  return [
    { title: "Fixed Expenses — FiDance" },
    { name: "description", content: "Track recurring bills and fixed monthly payments" },
  ];
}

export default function FixedExpenses() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Manage your recurring bills — mortgage, utilities, subscriptions, and more.
        </p>
        <button className="btn btn--primary">+ Add Fixed Expense</button>
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Monthly Fixed Expenses</h2>
        </div>
        <div className="card__body">
          <div className="empty-state">
            <div className="empty-state__icon">🏠</div>
            <div className="empty-state__title">No fixed expenses set up</div>
            <div className="empty-state__description">
              Add your recurring bills to track expected vs. actual payments each month.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
