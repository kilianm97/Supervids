import { Image, Link, Routes } from "blitz"
import { Row, Col, Badge } from "react-bootstrap"
import clsx from "clsx"

import styles from "./styles.module.scss"

export default function JobRow(data) {
  const getStatusColor = () => {
    switch (data.job.state) {
      case "picked":
        return "light"
        break
      case "queued":
        return "warning"
        break
      case "processing":
        return "light"
        break
      case "failed":
        return "danger"
        break
      case "finished":
        return "success"
        break
    }
  }

  const calcDuration = () => {
    const dateDiff =
      (new Date(data?.job?.events?.[4]?.time).getTime() -
        new Date(data?.job?.createdAt).getTime()) /
      1000
    const mins = (dateDiff % 3600) / 60
    return mins.toFixed(2)
  }

  return (
    <Row>
      <Col className={clsx(styles.cell, "col-2")}>{data.job.uid}</Col>
      <Col className="col-1">
        <Badge pill bg={getStatusColor()}>
          {data.job.state}
        </Badge>
      </Col>
      <Col>{new Date(data.job.createdAt).toUTCString()}</Col>
      <Col>{new Date(data.job.updatedAt).toUTCString()}</Col>
      <Col className="col-1">{calcDuration()}</Col>
      <Col className="col-1">
        <Link href={`/jobs/${data.job.uid}`}>View</Link>
      </Col>
    </Row>
  )
}
