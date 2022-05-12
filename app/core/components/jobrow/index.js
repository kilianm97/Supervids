import { Image, Link, Routes } from "blitz"
import { useEffect, useState } from "react"
import { Row, Col, Badge } from "react-bootstrap"
import clsx from "clsx"

import styles from "./styles.module.scss"

import calcDuration from "app/methods/calcDuration"
import getStatusColor from "app/methods/getStatusColor"
import formatState from "app/methods/formatState"

export default function JobRow(data) {
  const [formattedState, setFormattedState] = useState()

  useEffect(() => {
    setFormattedState(formatState(data.job))
  }, [data.job])

  return (
    <Row>
      <Col className={clsx(styles.cell, "col-2")}>{data.job.uid}</Col>
      <Col className="col-1">
        <Badge pill bg={getStatusColor(formattedState)}>
          {formattedState}
        </Badge>
      </Col>
      <Col>{new Date(data.job.createdAt).toUTCString()}</Col>
      <Col>{new Date(data.job.updatedAt).toUTCString()}</Col>
      <Col className="col-1">{calcDuration(data.job, formattedState)}</Col>
      <Col className="col-1">
        <Link href={`/jobs/${data.job.uid}`}>View</Link>
      </Col>
    </Row>
  )
}
