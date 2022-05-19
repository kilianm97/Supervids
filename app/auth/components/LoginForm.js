import { AuthenticationError, Link, useMutation, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

import { Button } from "react-bootstrap"
export const LoginForm = (props) => {
  const [loginMutation] = useMutation(login)
  return (
    <>
      <Form
        className="w-50 mx-auto"
        schema={Login}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error) {
            if (error instanceof AuthenticationError) {
              return {
                [FORM_ERROR]: "Sorry, those credentials are invalid",
              }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <Button className="w-100" type="submit">
          Login
        </Button>
      </Form>
    </>
  )
}
export default LoginForm
