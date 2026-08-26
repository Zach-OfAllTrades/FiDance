import { Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";
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
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ Add Transaction</Button>}
      >
        <Text tone="muted">
          Track your variable spending across categories.
        </Text>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>All Transactions</Card.Title>
        </Card.Header>
        <Card.Body>
          <EmptyState
            icon="💳"
            title="No transactions yet"
            description="Add your first transaction to start tracking spending."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
