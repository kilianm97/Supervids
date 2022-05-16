import { useRouter } from "blitz"
import { Button, Stack, Form } from "react-bootstrap"

export default function JobFilter({ filterJob, jobs }) {
  const router = useRouter()

  function filter(event) {
    event.preventDefault()
    router.query.state = event.target.state.value

    if (event.target.createdAt.value != "") {
      router.query.createdAt = event.target.createdAt.value
    }

    if (event.target.updatedAt.value != "") {
      router.query.updatedAt = event.target.updatedAt.value
    }

    if (event.target.duration.value != "") {
      router.query.duration = event.target.duration.value
    }

    router.push(router)
    filterJob(jobs)
  }

  return (
    <Form
      onSubmit={filter}
      direction="horizontal"
      className="d-flex justify-content-center align-items-baseline mt-3"
    >
      <Form.Label htmlFor="state">state</Form.Label>
      <Form.Select name="state">
        <option value="all">All</option>
        <option value="queued">Queued</option>
        <option value="render:dorender">Processing</option>
        <option value="started">Picked</option>
        <option value="finished">Finished</option>
        <option value="failed">Failed</option>
        <option value="error">Error</option>
      </Form.Select>
      <Form.Label htmlFor="createdAt">createdAt</Form.Label>
      <Form.Control type="date" name="createdAt"></Form.Control>
      <Form.Label htmlFor="updatedAt">updatedAt</Form.Label>
      <Form.Control type="date" name="updatedAt"></Form.Control>
      <Form.Label htmlFor="duration">duration</Form.Label>
      <Form.Control name="duration" type="number" min="0" max="10"></Form.Control>
      <Button type="submit">Filter</Button>
    </Form>
  )
}
