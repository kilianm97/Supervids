import { useRouter } from "blitz"
import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { Suspense } from "react"
import { Container, Row, Col } from "react-bootstrap"

import UserRow from "../../core/components/user-row"
import { useAllUsers } from "app/core/hooks/useAllUsers"

export default function Users() {
  const router = useRouter()

  const AllUsers = () => {
    const allUsers = useAllUsers()
    if (!allUsers) return
    return (
      <>
        {allUsers.map((user) => {
          return (
            <>
              <UserRow key={user.id} user={user} />
            </>
          )
        })}
      </>
    )
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col className="col__head">Email</Col>
          <Col className="col__head">Created At</Col>
          <Col className="col__head">Last login</Col>
          <Col className="col__head">Notifications</Col>
          <Col className="col__head">Action</Col>
        </Row>
        <Suspense fallback="Loading...">
          <AllUsers />
        </Suspense>
      </Container>

      <style jsx global>{`
        .row {
          padding: 16px 8px;
        }
        .row:nth-child(even) {
          background-color: #f8f9fa;
        }
        .col__head {
          font-weight: bold;
        }
      `}</style>
    </>
  )
}

Users.getLayout = (page) => <DashBoardLayout title="Users">{page}</DashBoardLayout>
