import { Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";
import type { Route } from "./+types/budgets";

export function meta() {
  return [
    { title: "Budgets — FiDance" },
    { name: "description", content: "Set and track monthly budgets by category" },
  ];
}

export default function Budgets() {
  return (
    <div>
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ Set Budget</Button>}
      >
        <Text tone="muted">
          Set monthly budgets and track actual spending vs. planned.
        </Text>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Budget vs. Actual</Card.Title>
        </Card.Header>
        <Card.Body>
          <EmptyState
            icon="📋"
            title="No budgets configured"
            description="Create budgets for each spending category to track your progress."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
