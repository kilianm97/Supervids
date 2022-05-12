import { useRouter } from "blitz"
import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { useEffect, useState } from "react"
import { Container, Row, Col, Button, Stack } from "react-bootstrap"

import JobRow from "../../core/components/jobrow"

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [splittedJobs, setSplittedJobs] = useState([])

  const router = useRouter()

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    pagination()
  }, [splittedJobs, router.query.page])

  function pagination() {
    if (splittedJobs.length > 0) {
      if (router.asPath == router.route || router?.query?.page <= 1) {
        setJobs(splittedJobs[0])
      } else {
        if (router?.query?.page > splittedJobs.length) return
        setJobs(splittedJobs[router.query.page - 1])
      }
    }
  }

  function splitJobs(jobs) {
    const chunkSize = 10
    for (let i = 0; i < jobs.length; i += chunkSize) {
      setSplittedJobs((splittedJobs) => [...splittedJobs, jobs.slice(i, i + chunkSize)])
    }
  }

  const fetchJobs = () => {
    fetch(`${process.env.BLITZ_PUBLIC_API_URL}api/v1/jobs`, {
      headers: {
        "supervid-key": process.env.BLITZ_PUBLIC_API_KEY,
        "supervid-secret": process.env.BLITZ_PUBLIC_API_SECRET,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((jobs) => {
        splitJobs(jobs.reverse())
      })
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col className="col__head col-2">Uid</Col>
          <Col className="col__head col-1">State</Col>
          <Col className="col__head">CreatedAt</Col>
          <Col className="col__head">UpdatedAt</Col>
          <Col className="col__head col-1">Duration</Col>
          <Col className="col__head col-1">Action</Col>
        </Row>
        {jobs.map((job) => {
          return <JobRow key={job.uid} job={job} />
        })}
        <Stack direction="horizontal" gap={3} className="justify-content-center mt-3">
          <Button
            href={router.pathname}
            disabled={router.query.page ? (router.query.page <= 1 ? "disabled" : null) : "disabled"}
          >
            First
          </Button>
          <Button
            href={router.pathname + "/?page=" + (parseInt(router.query.page) - 1)}
            disabled={router.query.page ? (router.query.page <= 1 ? "disabled" : null) : "disabled"}
          >
            Previous
          </Button>
          <Button
            href={
              router.pathname +
              "/?page=" +
              (router.query.page ? parseInt(router.query.page) + 1 : 2)
            }
            disabled={
              router.query.page
                ? router.query.page >= splittedJobs.length
                  ? "disabled"
                  : null
                : ""
            }
          >
            Next
          </Button>
          <Button
            href={router.pathname + "/?page=" + splittedJobs.length}
            disabled={
              router.query.page
                ? router.query.page >= splittedJobs.length
                  ? "disabled"
                  : null
                : ""
            }
          >
            Last
          </Button>
        </Stack>
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

Jobs.getLayout = (page) => <DashBoardLayout title="Jobs">{page}</DashBoardLayout>
