import { forwardRef } from "react"
import { Form } from "react-bootstrap"
import { useField } from "react-final-form"
export const LabeledTextField = forwardRef(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? Number // Converting `""` to `null` ensures empty values will be set to null in the DB
          : (v) => (v === "" ? null : v),
      ...fieldProps,
    })
    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
    return (
      <div {...outerProps}>
        <Form.Group className="mb-3">
          <Form.Label {...labelProps}>{label}</Form.Label>
          <Form.Control {...input} disabled={submitting} {...props} ref={ref} />
        </Form.Group>

        {touched && normalizedError && (
          <div
            role="alert"
            style={{
              color: "red",
            }}
          >
            {normalizedError}
          </div>
        )}

        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1rem;
          }
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            appearance: none;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    )
  }
)
export default LabeledTextField
