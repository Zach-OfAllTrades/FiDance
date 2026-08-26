import type { Route } from "./+types/savings-goals";

export function meta() {
  return [
    { title: "Savings Goals — FiDance" },
    { name: "description", content: "Track progress toward your savings goals" },
  ];
}

export default function SavingsGoals() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Set savings targets and track your progress.
        </p>
        <button className="btn btn--primary">+ New Goal</button>
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Your Goals</h2>
        </div>
        <div className="card__body">
          <div className="empty-state">
            <div className="empty-state__icon">🎯</div>
            <div className="empty-state__title">No savings goals</div>
            <div className="empty-state__description">
              Create goals like Emergency Fund, Vacation, or Home Renovation to track your savings progress.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
