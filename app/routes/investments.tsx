import type { Route } from "./+types/investments";

export function meta() {
  return [
    { title: "Investments — FiDance" },
    { name: "description", content: "Track investment portfolios and returns" },
  ];
}

export default function Investments() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Track portfolio growth across all investment accounts.
        </p>
        <button className="btn btn--primary">+ Add Account</button>
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Investment Accounts</h2>
        </div>
        <div className="card__body">
          <div className="empty-state">
            <div className="empty-state__icon">📈</div>
            <div className="empty-state__title">No investment accounts</div>
            <div className="empty-state__description">
              Add your retirement accounts, brokerage accounts, and savings accounts to track growth.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
