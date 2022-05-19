import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { Suspense } from "react"
import { useState } from "react"
import { Container, Row, Col, Modal, Button } from "react-bootstrap"
import UserRow from "../../core/components/user-row"
import { useAllUsers } from "app/core/hooks/useAllUsers"
import { useMutation, AuthenticationError } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import edituser from "app/auth/mutations/editUser"
import deleteuser from "app/auth/mutations/deleteUser"
import { Signup, EditUser, DeleteUser } from "app/auth/validations"

export default function Users() {
  const [signupMutation] = useMutation(signup)
  const [editMutation] = useMutation(edituser)
  const [deleteMutation] = useMutation(deleteuser)

  const [showSignup, setShowSignup] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState()

  const handleCloseSignUp = () => setShowSignup(false)
  const handleShowSignUp = () => setShowSignup(true)

  const handleCloseEdit = () => setShowEdit(false)
  const handleShowEdit = (user) => {
    setShowEdit(true)
    setSelectedUser(user)
  }

  const handleCloseDelete = () => setShowDelete(false)
  const handleShowDelete = (user) => {
    setShowDelete(true)
    setSelectedUser(user)
  }

  const AllUsers = ({ handleShowEdit, handleShowDelete }) => {
    const allUsers = useAllUsers()
    if (!allUsers) return
    return (
      <>
        {allUsers?.map((user) => {
          return (
            <UserRow
              key={user.id}
              user={user}
              handleShowEdit={handleShowEdit}
              handleShowDelete={handleShowDelete}
            />
          )
        })}
      </>
    )
  }

  return (
    <>
      <div className="d-flex flex-column w-100">
        <Button className="mx-auto mt-2" onClick={handleShowSignUp}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-person-plus-fill"
            viewBox="0 0 16 16"
          >
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path
              fillRule="evenodd"
              d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
            />
          </svg>
          <span className="ms-2">Add User</span>
        </Button>
        <Container fluid>
          <Row className="text-center">
            <Col className="col__head">Email</Col>
            <Col className="col__head">Created At</Col>
            <Col className="col__head">Last login</Col>
            <Col className="col__head">Notifications</Col>
            <Col className="col__head">Action</Col>
          </Row>
          <Suspense fallback="Loading...">
            <AllUsers handleShowEdit={handleShowEdit} handleShowDelete={handleShowDelete} />
          </Suspense>
          <Modal show={showSignup} onHide={handleCloseSignUp} backdrop="static" keyboard={false}>
            <Form
              schema={Signup}
              initialValues={{
                email: "",
                password: "",
                passwordConfirmation: "",
              }}
              onSubmit={async (values) => {
                try {
                  await signupMutation(values)
                  handleCloseSignUp()
                } catch (error) {
                  if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                    // This error comes from Prisma
                    return {
                      email: "This email is already being used",
                    }
                  } else {
                    return {
                      [FORM_ERROR]: error.toString(),
                    }
                  }
                }
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Add a new user</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <LabeledTextField name="email" label="Email" placeholder="Email" />
                <LabeledTextField
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                />
                <LabeledTextField
                  name="passwordConfirmation"
                  label="Confirm Password"
                  placeholder="Confirmation"
                  type="password"
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseSignUp}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Add User
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          <Modal show={showEdit} onHide={handleCloseEdit} backdrop="static" keyboard={false}>
            <Form
              schema={EditUser}
              initialValues={{
                email: selectedUser?.email,
                currentPassword: "",
                newPassword: "",
                passwordConfirmation: "",
              }}
              onSubmit={async (values) => {
                try {
                  await editMutation(values)
                  handleCloseEdit()
                } catch (error) {
                  if (error instanceof AuthenticationError) {
                    return {
                      currentPassword: "Password is not valid",
                    }
                  } else {
                    return {
                      [FORM_ERROR]: error.toString(),
                    }
                  }
                }
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit a user</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <LabeledTextField name="email" label="Email" disabled />
                <LabeledTextField
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Current Password"
                  type="password"
                />
                <LabeledTextField
                  name="newPassword"
                  label="New Password"
                  placeholder="New Password"
                  type="password"
                />
                <LabeledTextField
                  name="passwordConfirmation"
                  label="Confirm Password"
                  placeholder="Confirmation"
                  type="password"
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          <Modal show={showDelete} onHide={handleCloseDelete} backdrop="static" keyboard={false}>
            <Form
              schema={DeleteUser}
              initialValues={{
                id: selectedUser?.id,
              }}
              onSubmit={async (values) => {
                try {
                  handleCloseDelete()
                  await deleteMutation(values)
                } catch (error) {
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm user removal</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to remove <b>{selectedUser.email}</b>?
                <input type="hidden" value={selectedUser?.id} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDelete}>
                  Close
                </Button>
                <Button variant="danger" type="submit">
                  Remove
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
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
      </div>
    </>
  )
}

Users.getLayout = (page) => <DashBoardLayout title="Users">{page}</DashBoardLayout>
