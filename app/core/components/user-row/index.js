import { Row, Col, Button, Stack } from "react-bootstrap"

export default function UserRow({ user }) {
  return (
    <Row className="justify-content-center align-items-center">
      <Col>{user.email}</Col>
      <Col>{user.createdAt.toLocaleString()}</Col>
      <Col>
        {user.lastLogin ? user.lastLogin.toLocaleString() : user.createdAt.toLocaleString()}
      </Col>
      <Col>{user.notifications ? "Yes" : "No"}</Col>
      <Col>
        <Stack direction="horizontal" gap={3}>
          <Button>Edit</Button>
          <Button variant="danger">Delete</Button>
        </Stack>
      </Col>
    </Row>
  )
}
