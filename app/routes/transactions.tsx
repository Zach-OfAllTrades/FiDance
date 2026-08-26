import type { Route } from "./+types/transactions";

export function meta() {
  return [
    { title: "Transactions — FiDance" },
    { name: "description", content: "Log and track your variable spending" },
  ];
}

export default function Transactions() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Track your variable spending across categories.
        </p>
        <button className="btn btn--primary">+ Add Transaction</button>
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">All Transactions</h2>
        </div>
        <div className="card__body">
          <div className="empty-state">
            <div className="empty-state__icon">💳</div>
            <div className="empty-state__title">No transactions yet</div>
            <div className="empty-state__description">
              Add your first transaction to start tracking spending.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
