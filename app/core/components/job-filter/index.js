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
      <Form.Control
        type="date"
        name="createdAt"
        placeholder="dd/mm/yyyy"
        pattern="(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)"
      ></Form.Control>
      <Form.Label htmlFor="updatedAt">updatedAt</Form.Label>
      <Form.Control
        type="date"
        name="updatedAt"
        placeholder="dd/mm/yyyy"
        pattern="(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)"
      ></Form.Control>
      <Form.Label htmlFor="duration">duration</Form.Label>
      <Form.Control name="duration" type="number" min="0" max="10"></Form.Control>
      <Button type="submit">Filter</Button>
    </Form>
  )
}
