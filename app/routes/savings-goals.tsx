import { Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";

export function meta() {
  return [
    { title: "Savings Goals — FiDance" },
    { name: "description", content: "Track progress toward your savings goals" },
  ];
}

export default function SavingsGoals() {
  return (
    <div>
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ New Goal</Button>}
      >
        <Text tone="muted">Set savings targets and track your progress.</Text>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Your Goals</Card.Title>
        </Card.Header>
        <Card.Body>
          <EmptyState
            icon="🎯"
            title="No savings goals"
            description="Create goals like Emergency Fund, Vacation, or Home Renovation to track your savings progress."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
