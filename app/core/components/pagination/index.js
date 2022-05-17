import { useRouter } from "blitz"
import { Button, Stack } from "react-bootstrap"

export default function Pagination({ max }) {
  const router = useRouter()
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="justify-content-center align-items-baseline mt-3"
    >
      <Button
        href={router.pathname}
        disabled={router.query.page ? (router.query.page <= 1 ? "disabled" : null) : "disabled"}
      >
        First
      </Button>
      <Button
        onClick={() => {
          router.query.page = parseInt(router.query.page) - 1
          router.push(router)
        }}
        disabled={router.query.page ? (router.query.page <= 1 ? "disabled" : null) : "disabled"}
      >
        Previous
      </Button>
      <p>
        Page {router.query.page ? parseInt(router.query.page) : 1} / {max}
      </p>
      <Button
        onClick={() => {
          router.query.page = router.query.page ? parseInt(router.query.page) + 1 : 2
          router.push(router)
        }}
        disabled={
          router.query.page
            ? router.query.page >= max
              ? "disabled"
              : null
            : max == 1
            ? "disabled"
            : ""
        }
      >
        Next
      </Button>
      <Button
        onClick={() => {
          router.query.page = max
          router.push(router)
        }}
        disabled={
          router.query.page
            ? router.query.page >= max
              ? "disabled"
              : null
            : max == 1
            ? "disabled"
            : ""
        }
      >
        Last
      </Button>
    </Stack>
  )
}
