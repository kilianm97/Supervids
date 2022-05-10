import { BlitzPage, usePaginatedQuery, useRouterQuery, useRouter, Routes, Router } from "blitz"
import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"

import JobRow from "../core/components/jobrow"

export default function JobsList() {
  const [jobs, setJobs] = useState([])

  const router = useRouter()

  useEffect(() => {
    if (router.asPath !== Router.route) {
      fetchJobs()
    }
  }, [router])

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
        if (!router.query.page || router.query.page <= 1) {
          setJobs(jobs.reverse().slice(0, 10))
        } else {
          setJobs(jobs.reverse().slice(router.query.page * 10 - 10, router.query.page * 10))
        }
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

JobsList.getLayout = (page) => <DashBoardLayout title="JobsList">{page}</DashBoardLayout>
