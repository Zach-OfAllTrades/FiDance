import { Card, EmptyState, StatGrid, Text } from "@zach-ofalltrades/juice";

export function meta() {
  return [
    { title: "Net Worth — FiDance" },
    { name: "description", content: "Track total assets, liabilities, and net worth over time" },
  ];
}

export default function NetWorth() {
  return (
    <div>
      <Text tone="muted" style={{ marginBottom: "var(--space-6)" }}>
        Track your total assets, liabilities, and equity over time.
      </Text>

      <StatGrid style={{ marginBottom: "var(--space-6)" }}>
        <StatGrid.Card label="Total Assets" value="$0.00" tone="positive" />
        <StatGrid.Card label="Total Liabilities" value="$0.00" tone="negative" />
        <StatGrid.Card label="Net Worth" value="$0.00" />
      </StatGrid>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        <Card>
          <Card.Header>
            <Card.Title>Assets</Card.Title>
          </Card.Header>
          <Card.Body>
            <EmptyState
              icon="🏡"
              title="No asset values entered"
              description="Enter your real estate value, vehicle value, and other assets."
            />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Liabilities</Card.Title>
          </Card.Header>
          <Card.Body>
            <EmptyState
              icon="📉"
              title="No liabilities entered"
              description="Enter your mortgage, student loans, auto loans, and other debts."
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
