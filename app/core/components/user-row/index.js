import { Suspense } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Row, Col } from "react-bootstrap"

export default function UserRow({ user, handleShowEdit, handleShowDelete }) {
  const TrashBtn = () => {
    const currentUser = useCurrentUser()
    if (currentUser?.id != user.id) {
      return (
        <span
          role="button"
          onClick={() => {
            handleShowDelete(user)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            className="bi bi-trash2"
            viewBox="0 0 16 16"
          >
            <path d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z" />
          </svg>
        </span>
      )
    }
  }

  return (
    <Row className="text-center justify-content-center align-items-center">
      <Col>{user.email}</Col>
      <Col>{user.createdAt.toLocaleString()}</Col>
      <Col>{user.lastLogin ? user.lastLogin.toLocaleString() : "-"}</Col>
      <Col>{user.notifications ? "Yes" : "No"}</Col>
      <Col>
        <span role="button" className="me-2 pe-auto" onClick={() => handleShowEdit(user)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="blue"
            className="bi bi-pencil"
            viewBox="0 0 16 16"
          >
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
          </svg>
        </span>
        <Suspense fallback="Loading...">
          <TrashBtn />
        </Suspense>
      </Col>
    </Row>
  )
}
