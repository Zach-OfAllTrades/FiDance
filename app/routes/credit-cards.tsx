import { Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";
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
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ Add Credit Card</Button>}
      >
        <Text tone="muted">
          Track credit card balances, payments, interest, and available credit.
        </Text>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Credit Card Accounts</Card.Title>
        </Card.Header>
        <Card.Body>
          <EmptyState
            icon="🏦"
            title="No credit cards added"
            description="Add your credit cards to track debt, payments, and available credit."
          />
        </Card.Body>
      </Card>
    </div>
  );
}
