import type { Route } from "./+types/net-worth";

export function meta() {
  return [
    { title: "Net Worth — FiDance" },
    { name: "description", content: "Track total assets, liabilities, and net worth over time" },
  ];
}

export default function NetWorth() {
  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
        Track your total assets, liabilities, and equity over time.
      </p>

      <div className="kpi-grid" style={{ marginBottom: "var(--space-6)" }}>
        <div className="kpi-card">
          <div className="kpi-card__label">Total Assets</div>
          <div className="kpi-card__value kpi-card__value--positive">$0.00</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Total Liabilities</div>
          <div className="kpi-card__value kpi-card__value--negative">$0.00</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Net Worth</div>
          <div className="kpi-card__value">$0.00</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Assets</h2>
          </div>
          <div className="card__body">
            <div className="empty-state">
              <div className="empty-state__icon">🏡</div>
              <div className="empty-state__title">No asset values entered</div>
              <div className="empty-state__description">
                Enter your real estate value, vehicle value, and other assets.
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Liabilities</h2>
          </div>
          <div className="card__body">
            <div className="empty-state">
              <div className="empty-state__icon">📉</div>
              <div className="empty-state__title">No liabilities entered</div>
              <div className="empty-state__description">
                Enter your mortgage, student loans, auto loans, and other debts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
