import { Link, useMutation } from "blitz"
import { useEffect, useState } from "react"
import { Row, Col, Badge } from "react-bootstrap"
import clsx from "clsx"

import styles from "./styles.module.scss"

import calcDuration from "app/methods/calcDuration"
import getStatusColor from "app/methods/getStatusColor"
import formatState from "app/methods/formatState"
import isNotFinished from "app/methods/isNotFinished"
import retry from "app/auth/mutations/retry"
import { useSettings } from "app/core/hooks/useSettings"

export default function JobRow({ job }) {
  const [formattedState, setFormattedState] = useState()
  const [retryMutation] = useMutation(retry)
  const settings = useSettings()

  useEffect(() => {
    setFormattedState(formatState(job, settings.failureTime))
  }, [job])

  return (
    <Row className="text-center align-items-center">
      <Col className={clsx(styles.cellId, "col-2")}>{job.uid}</Col>
      <Col className="col-2">
        <Badge pill bg={getStatusColor(formattedState)}>
          {formattedState}
        </Badge>
      </Col>
      <Col>{new Date(job.createdAt).toLocaleString()}</Col>
      <Col>{new Date(job.updatedAt).toLocaleString()}</Col>
      <Col className="col-1">{calcDuration(job, formattedState)}</Col>
      <Col className="col-1">
        {(isNotFinished(formattedState, job) && formattedState == "failed") ||
        (isNotFinished(formattedState, job) && formattedState == "error") ? (
          <a
            href=""
            onClick={() => {
              retryMutation(job)
            }}
            className="me-2 pe-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="red"
              className="bi bi-arrow-clockwise"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
              />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
          </a>
        ) : null}
        <Link href={`/jobs/${job.uid}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="blue"
            className="bi bi-info-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </Link>
      </Col>
    </Row>
  )
}
