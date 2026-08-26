import { Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";
import type { Route } from "./+types/fixed-expenses";

export function meta() {
  return [
    { title: "Fixed Expenses — FiDance" },
    { name: "description", content: "Track recurring bills and fixed monthly payments" },
  ];
}

export default function FixedExpenses() {
  return (
    <div>
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ Add Fixed Expense</Button>}
      >
        <Text tone="muted">
          Manage your recurring bills — mortgage, utilities, subscriptions, and more.
        </Text>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Monthly Fixed Expenses</Card.Title>
        </Card.Header>
        <Card.Body>
          <EmptyState
            icon="🏠"
            title="No fixed expenses set up"
            description="Add your recurring bills to track expected vs. actual payments each month."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
