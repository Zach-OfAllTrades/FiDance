import type { Route } from "./+types/credit-cards";

export function meta() {
  return [
    { title: "Credit Cards — FiDance" },
    { name: "description", content: "Track credit card balances, payments, and available credit" },
  ];
}

export default function CreditCards() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Track credit card balances, payments, interest, and available credit.
        </p>
        <button className="btn btn--primary">+ Add Credit Card</button>
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Credit Card Accounts</h2>
        </div>
        <div className="card__body">
          <div className="empty-state">
            <div className="empty-state__icon">🏦</div>
            <div className="empty-state__title">No credit cards added</div>
            <div className="empty-state__description">
              Add your credit cards to track debt, payments, and available credit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
