import { recursiveFormatZodErrors, useRouter } from "blitz"
import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"

import JobRow from "../../core/components/job-row"
import Pagination from "app/core/components/pagination"
import JobFilter from "app/core/components/job-filter"
import formatState from "app/methods/formatState"
import calcDuration from "app/methods/calcDuration"

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [formattedState, setFormattedState] = useState()
  const [splittedJobs, setSplittedJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])

  const router = useRouter()

  useEffect(() => {
    fetchJobs()
  }, [router.query])

  useEffect(() => {
    pagination()
  }, [splittedJobs, router.query.page])

  function pagination() {
    if (splittedJobs.length > 0) {
      if (typeof router.query.page == "undefined" || router?.query?.page <= 1) {
        setJobs(splittedJobs[0])
        setFilteredJobs(splittedJobs[0])
      } else {
        if (router?.query?.page > splittedJobs.length) return
        setJobs(splittedJobs[router.query.page - 1])
        setFilteredJobs(splittedJobs[router.query.page - 1])
      }
    }
  }

  function filterJob(jobs) {
    if (
      typeof router.query.state != "undefined" ||
      typeof router.query.createdAt != "undefined" ||
      typeof router.query.updatedAt != "undefined" ||
      typeof router.query.duration != "undefined"
    ) {
      let stateFilter = jobs?.filter((job) => {
        if (router?.query?.state == "all") {
          return true
        }
        if (router.query.state == "failed") {
          if (
            job.state == "render:dorender" &&
            Math.abs(Date.now() - new Date(job?.updatedAt).getTime()) / 1000 / 60 > 10
          ) {
            return true
          }
        }
        if (router.query.state == job.state) {
          return true
        }
      })
      let createdAtFilter = []
      if (typeof router.query.createdAt != "undefined") {
        createdAtFilter = stateFilter?.filter((job) => {
          if (new Date(router.query.createdAt) < new Date(job.createdAt)) {
            return true
          }
        })
      }
      let updatedAtFilter = []
      if (typeof router.query.updatedAt != "undefined") {
        updatedAtFilter =
          createdAtFilter?.length > 0
            ? createdAtFilter?.filter((job) => {
                if (new Date(router.query.updatedAt) < new Date(job.updatedAt)) {
                  return true
                }
              })
            : stateFilter?.filter((job) => {
                if (new Date(router.query.updatedAt) < new Date(job.updatedAt)) {
                  return true
                }
              })
      }
      let durationFilter = []
      if (typeof router.query.duration != "undefined") {
        durationFilter =
          createdAtFilter?.length < 1 && updatedAtFilter.length < 1
            ? stateFilter?.filter((job) => {
                setFormattedState(formatState(job))
                const hms = calcDuration(job, formattedState)
                const [hours, minutes, seconds] = hms.split(":")
                const totalSeconds = +hours * 60 * 60 + +minutes * 60 + +seconds

                if (totalSeconds > router.query.duration * 60) {
                  return true
                }
              })
            : updatedAtFilter?.length < 1
            ? createdAtFilter.filter((job) => {
                setFormattedState(formatState(job))
                const hms = calcDuration(job, formattedState)
                const [hours, minutes, seconds] = hms.split(":")
                const totalSeconds = +hours * 60 * 60 + +minutes * 60 + +seconds

                if (totalSeconds > router.query.duration * 60) {
                  return true
                }
              })
            : createdAtFilter < 1
            ? updatedAtFilter.filter((job) => {
                setFormattedState(formatState(job))
                const hms = calcDuration(job, formattedState)
                const [hours, minutes, seconds] = hms.split(":")
                const totalSeconds = +hours * 60 * 60 + +minutes * 60 + +seconds

                if (totalSeconds > router.query.duration * 60) {
                  return true
                }
              })
            : ""
      }
      console.log(stateFilter)

      if (createdAtFilter.length < 1 && updatedAtFilter.length < 1 && durationFilter.length < 1) {
        splitJobs(stateFilter)
      } else if (
        createdAtFilter.length > 0 &&
        updatedAtFilter.length < 1 &&
        durationFilter.length < 1
      ) {
        splitJobs(createdAtFilter)
      } else if (
        createdAtFilter.length > 0 &&
        updatedAtFilter.length > 0 &&
        durationFilter.length < 1
      ) {
        splitJobs(updatedAtFilter)
      } else if (
        createdAtFilter.length > 0 &&
        updatedAtFilter.length > 0 &&
        durationFilter.length > 0
      ) {
        splitJobs(durationFilter)
      } else if (
        createdAtFilter.length < 1 &&
        updatedAtFilter.length > 0 &&
        durationFilter.length > 0
      ) {
        splitJobs(durationFilter)
      } else if (
        createdAtFilter.length > 0 &&
        updatedAtFilter.length < 1 &&
        durationFilter.length > 0
      ) {
        splitJobs(durationFilter)
      } else if (
        createdAtFilter.length < 1 &&
        updatedAtFilter.length < 1 &&
        durationFilter.length > 0
      ) {
        splitJobs(durationFilter)
      } else if (
        createdAtFilter.length < 1 &&
        updatedAtFilter.length > 0 &&
        durationFilter.length < 1
      ) {
        splitJobs(updatedAtFilter)
      }
    } else {
      splitJobs(jobs)
    }
  }

  function splitJobs(jobs) {
    const chunkSize = 10
    setSplittedJobs([])
    for (let i = 0; i < jobs?.length; i += chunkSize) {
      setSplittedJobs((splittedJobs) => [...splittedJobs, jobs.slice(i, i + chunkSize)])
    }
    pagination()
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
        jobs = jobs.reverse()
        filterJob(jobs)
        setJobs(jobs)
      })
  }

  return (
    <>
      <Container fluid>
        <JobFilter filterJob={filterJob} jobs={jobs}></JobFilter>
        <Row>
          <Col className="col__head col-2">Uid</Col>
          <Col className="col__head col-1">State</Col>
          <Col className="col__head">CreatedAt</Col>
          <Col className="col__head">UpdatedAt</Col>
          <Col className="col__head col-1">Duration</Col>
          <Col className="col__head col-1">Action</Col>
        </Row>
        {filteredJobs.map((job) => {
          return <JobRow key={job.uid} job={job} />
        })}
        <Pagination max={splittedJobs.length}></Pagination>
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
