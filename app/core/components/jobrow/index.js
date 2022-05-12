import { Link } from "blitz"
import { useEffect, useState } from "react"
import { Row, Col, Badge } from "react-bootstrap"
import clsx from "clsx"

import styles from "./styles.module.scss"

import calcDuration from "app/methods/calcDuration"
import getStatusColor from "app/methods/getStatusColor"
import formatState from "app/methods/formatState"
import isNotFinished from "app/methods/isNotFinished"
import retryJob from "app/methods/retryJob"

export default function JobRow({ job }) {
  const [formattedState, setFormattedState] = useState()

  useEffect(() => {
    setFormattedState(formatState(job))
  }, [job])

  return (
    <Row>
      <Col className={clsx(styles.cell, "col-2")}>{job.uid}</Col>
      <Col className="col-1">
        <Badge pill bg={getStatusColor(formattedState)}>
          {formattedState}
        </Badge>
      </Col>
      <Col>{new Date(job.createdAt).toLocaleString()}</Col>
      <Col>{new Date(job.updatedAt).toLocaleString()}</Col>
      <Col className="col-1">{calcDuration(job, formattedState)}</Col>
      <Col className="col-1">
        {isNotFinished(formattedState, job) && formattedState == "failed" ? (
          <button
            onClick={() => {
              retryJob(job)
            }}
          >
            Retry
          </button>
        ) : null}
        <Link href={`/jobs/${job.uid}`}>View</Link>
      </Col>
    </Row>
  )
}
