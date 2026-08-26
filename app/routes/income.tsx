import type { Route } from "./+types/income";

export function meta() {
  return [
    { title: "Income — FiDance" },
    { name: "description", content: "Track payroll and one-off income" },
  ];
}

export default function Income() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Track payroll deductions and one-off income (freelance, sales, gifts, refunds).
        </p>
        <button className="btn btn--primary">+ Add Income</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Payroll</h2>
          </div>
          <div className="card__body">
            <div className="empty-state">
              <div className="empty-state__icon">📄</div>
              <div className="empty-state__title">No payroll entries</div>
              <div className="empty-state__description">
                Log your paychecks with full deduction breakdowns.
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Other Income</h2>
          </div>
          <div className="card__body">
            <div className="empty-state">
              <div className="empty-state__icon">💰</div>
              <div className="empty-state__title">No other income</div>
              <div className="empty-state__description">
                Track freelance earnings, reimbursements, gifts, and other one-off income.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
