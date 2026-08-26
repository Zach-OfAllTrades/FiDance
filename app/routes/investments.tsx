import { Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";

export function meta() {
  return [
    { title: "Investments — FiDance" },
    { name: "description", content: "Track investment portfolios and returns" },
  ];
}

export default function Investments() {
  return (
    <div>
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ Add Account</Button>}
      >
        <Text tone="muted">Track portfolio growth across all investment accounts.</Text>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Investment Accounts</Card.Title>
        </Card.Header>
        <Card.Body>
          <EmptyState
            icon="📈"
            title="No investment accounts"
            description="Add your retirement accounts, brokerage accounts, and savings accounts to track growth."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
