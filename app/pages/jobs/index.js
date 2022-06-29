import { useRouter } from "blitz"
import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import moment from "moment"

import JobRow from "../../core/components/job-row"
import Pagination from "app/core/components/pagination"
import JobFilter from "app/core/components/job-filter"

import formatState from "app/methods/formatState"
import calcDuration from "app/methods/calcDuration"

import { useAllJobs } from "app/core/hooks/useAllJobs"
import { useSettings } from "app/core/hooks/useSettings"

export default function Jobs() {
  const [formattedState, setFormattedState] = useState()
  const [splittedJobs, setSplittedJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])

  const jobsFetched = useAllJobs()
  const settings = useSettings()
  const router = useRouter()

  useEffect(() => {
    if (
      router.query.state ||
      router.query.createdAt ||
      router.query.updatedAt ||
      router.query.duration
    ) {
      filterJob(jobsFetched)
    } else {
      splitJobs(jobsFetched)
    }
  }, [router.query.state, router.query.createdAt, router.query.updatedAt, router.query.duration])

  useEffect(() => {
    pagination()
  }, [splittedJobs, router.query.page])

  function pagination() {
    if (splittedJobs.length > 0) {
      if (typeof router.query.page == "undefined" || router?.query?.page <= 1) {
        setFilteredJobs(splittedJobs[0])
      } else {
        if (router?.query?.page > splittedJobs.length) return
        setFilteredJobs(splittedJobs[router.query.page - 1])
      }
    } else {
      setFilteredJobs([])
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
            Math.abs(Date.now() - new Date(job?.updatedAt).getTime()) > settings.failureTime
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
          if (
            moment(new Date(router.query.createdAt)).format("L") ==
            moment(new Date(job.createdAt)).format("L")
          ) {
            return true
          }
        })
      }
      let updatedAtFilter = []
      if (typeof router.query.updatedAt != "undefined") {
        updatedAtFilter =
          createdAtFilter?.length > 0
            ? createdAtFilter?.filter((job) => {
                if (
                  moment(new Date(router.query.updatedAt)).format("L") ==
                  moment(new Date(job.updatedAt)).format("L")
                ) {
                  return true
                }
              })
            : stateFilter?.filter((job) => {
                if (
                  moment(new Date(router.query.updatedAt)).format("L") ==
                  moment(new Date(job.updatedAt)).format("L")
                ) {
                  return true
                }
              })
      }
      let durationFilter = []
      if (typeof router.query.duration != "undefined") {
        durationFilter =
          createdAtFilter?.length < 1 && updatedAtFilter.length < 1
            ? stateFilter?.filter((job) => {
                const hms = calcDuration(job, formatState(job, settings.failureTime))
                const [hours, minutes, seconds] = hms.split(":")
                const totalSeconds = +hours * 60 * 60 + +minutes * 60 + +seconds

                if (
                  totalSeconds * 1000 >
                  moment(router.query.duration, "HH:mm:ss").diff(
                    moment().startOf("day"),
                    "milliseconds"
                  )
                ) {
                  return true
                }
              })
            : updatedAtFilter?.length < 1
            ? createdAtFilter.filter((job) => {
                const hms = calcDuration(job, formatState(job, settings.failureTime))
                const [hours, minutes, seconds] = hms.split(":")
                const totalSeconds = +hours * 60 * 60 + +minutes * 60 + +seconds
                console.log(totalSeconds * 1000)

                if (
                  totalSeconds * 1000 >
                  moment(router.query.duration, "HH:mm:ss").diff(
                    moment().startOf("day"),
                    "milliseconds"
                  )
                ) {
                  return true
                }
              })
            : createdAtFilter < 1
            ? updatedAtFilter.filter((job) => {
                const hms = calcDuration(job, formatState(job, settings.failureTime))
                const [hours, minutes, seconds] = hms.split(":")
                const totalSeconds = +hours * 60 * 60 + +minutes * 60 + +seconds
                console.log(totalSeconds * 1000)

                if (
                  totalSeconds * 1000 >
                  moment(router.query.duration, "HH:mm:ss").diff(
                    moment().startOf("day"),
                    "milliseconds"
                  )
                ) {
                  return true
                }
              })
            : ""
      }

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
    setSplittedJobs([])
    if (jobs.length < 1) {
      setSplittedJobs([])
    } else {
      const chunkSize = 8
      for (let i = 0; i < jobs?.length; i += chunkSize) {
        setSplittedJobs((splittedJobs) => [...splittedJobs, jobs.slice(i, i + chunkSize)])
      }
    }
  }

  return (
    <>
      <Container fluid className="position-relative">
        <JobFilter filterJob={filterJob} jobs={jobsFetched}></JobFilter>
        <Row className="text-center">
          <Col className="col__head col-2">Uid</Col>
          <Col className="col__head col-2">State</Col>
          <Col className="col__head">Created At</Col>
          <Col className="col__head">Updated At</Col>
          <Col className="col__head col-1">Duration</Col>
          <Col className="col__head col-1">Action</Col>
        </Row>
        {filteredJobs.map((job) => {
          return <JobRow key={job.uid} job={job} />
        })}
        <div className="position-absolute bottom-0 start-50 translate-middle">
          <Pagination max={splittedJobs.length}></Pagination>
        </div>
      </Container>

      <style jsx global>{`
        .row {
          padding: 16px 8px;
        }
        .col__head {
          font-weight: bold;
        }
      `}</style>
    </>
  )
}

Jobs.suppressFirstRenderFlicker = true

Jobs.getLayout = (page) => <DashBoardLayout title="Jobs">{page}</DashBoardLayout>
