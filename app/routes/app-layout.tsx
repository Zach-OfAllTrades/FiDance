import { NavLink, Outlet, useLocation } from "react-router";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { to: "/", icon: "📊", label: "Dashboard" },
    ],
  },
  {
    label: "Money In & Out",
    items: [
      { to: "/transactions", icon: "💳", label: "Transactions" },
      { to: "/budgets", icon: "📋", label: "Budgets" },
      { to: "/fixed-expenses", icon: "🏠", label: "Fixed Expenses" },
      { to: "/income", icon: "💰", label: "Income" },
    ],
  },
  {
    label: "Debt & Assets",
    items: [
      { to: "/credit-cards", icon: "🏦", label: "Credit Cards" },
      { to: "/investments", icon: "📈", label: "Investments" },
      { to: "/savings-goals", icon: "🎯", label: "Savings Goals" },
    ],
  },
  {
    label: "Big Picture",
    items: [
      { to: "/net-worth", icon: "💎", label: "Net Worth" },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/categories", icon: "🏷️", label: "Categories" },
    ],
  },
];

// Map route paths to page titles
const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/fixed-expenses": "Fixed Expenses",
  "/credit-cards": "Credit Cards",
  "/investments": "Investments",
  "/income": "Income",
  "/net-worth": "Net Worth",
  "/savings-goals": "Savings Goals",
  "/categories": "Categories",
};

export default function AppLayout() {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "FiDance";

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">💃</div>
          <span className="sidebar__logo-text">FiDance</span>
        </div>

        <nav className="sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="sidebar__section-label">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                  }
                >
                  <span className="sidebar__link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            FiDance v1.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-content__header">
          <h1 className="main-content__title">{pageTitle}</h1>
        </header>
        <div className="main-content__body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
