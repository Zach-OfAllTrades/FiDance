import { Button, Card, EmptyState, Row, Text } from "@zach-ofalltrades/juice";

export function meta() {
  return [
    { title: "Income — FiDance" },
    { name: "description", content: "Track payroll and one-off income" },
  ];
}

export default function Income() {
  return (
    <div>
      <Row
        style={{ marginBottom: "var(--space-6)" }}
        actions={<Button variant="primary">+ Add Income</Button>}
      >
        <Text tone="muted">
          Track payroll deductions and one-off income (freelance, sales, gifts, refunds).
        </Text>
      </Row>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        <Card>
          <Card.Header>
            <Card.Title>Payroll</Card.Title>
          </Card.Header>
          <Card.Body>
            <EmptyState
              icon="📄"
              title="No payroll entries"
              description="Log your paychecks with full deduction breakdowns."
            />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Other Income</Card.Title>
          </Card.Header>
          <Card.Body>
            <EmptyState
              icon="💰"
              title="No other income"
              description="Track freelance earnings, reimbursements, gifts, and other one-off income."
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
