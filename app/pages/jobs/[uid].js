import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { useParam } from "blitz"
import { useEffect, useState } from "react"
import { Container, Table, Row, Col, Badge, Button } from "react-bootstrap"

import calcDuration from "app/methods/calcDuration"
import isNotFinished from "app/methods/isNotFinished"
import formatState from "app/methods/formatState"
import getStatusColor from "app/methods/getStatusColor"
import retryJob from "app/methods/retryJob"

import { useSettings } from "app/core/hooks/useSettings"

export default function JobUID() {
  const [job, setJob] = useState([])
  const [formattedState, setFormattedState] = useState()

  const uid = useParam("uid")
  const settings = useSettings()

  useEffect(() => {
    if (typeof uid != "undefined") {
      fetchJob()
    }
  }, [uid])

  useEffect(() => {
    setFormattedState(formatState(job))
  }, [job])

  const fetchJob = () => {
    fetch(
      `http://${settings.apiAddress}${
        settings.apiPort != "-" ? ":" + settings.apiPort : ""
      }/api/v1/jobs/${uid}`,
      {
        headers: {
          "supervid-key": settings.apiKey,
          "supervid-secret": settings.apiSecret,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((job) => {
        setJob(job)
      })
  }

  return (
    <>
      <div className="d-flex flex-column w-100">
        <div className="d-flex align-items-center px-4">
          <Button variant="dark" className="mt-2" href="/jobs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            <span className="ms-2">Back</span>
          </Button>
          {(isNotFinished(formattedState, job) && formattedState == "failed") ||
          (isNotFinished(formattedState, job) && formattedState == "error") ? (
            <Button
              variant="danger"
              className="mx-auto mt-2"
              onClick={() => {
                retryJob(job)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-clockwise"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
              <span className="ms-2">Reload</span>
            </Button>
          ) : null}
        </div>
        <Container fluid>
          <Row>
            <Col>
              <Table responsive>
                <tbody>
                  <tr>
                    <td>Uid</td>
                    <td>{job?.uid}</td>
                  </tr>
                  <tr>
                    <td>State</td>
                    <td>
                      <Badge pill bg={getStatusColor(formattedState)}>
                        {formattedState}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>Created at</td>
                    <td>{new Date(job?.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Updated at</td>
                    <td>{new Date(job?.updatedAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Duration</td>
                    <td>{calcDuration(job, formattedState)}</td>
                  </tr>
                  <tr>
                    <td>Assets</td>
                    <td>{`${job?.jobAssets?.firstname} ${job?.jobAssets?.lastname}`}</td>
                  </tr>
                  <tr>
                    <td>Data</td>
                    <td>{job?.jobData?.contactId}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <Table responsive>
                <tbody>
                  <tr>
                    <td>Created by</td>
                    <td>{job?.createdBy}</td>
                  </tr>
                  <tr>
                    <td>Rendered at</td>
                    <td>
                      {isNotFinished(formattedState, job)
                        ? "-"
                        : new Date(job?.events?.[0]?.time).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Encoded at</td>
                    <td>
                      {isNotFinished(formattedState, job)
                        ? "-"
                        : new Date(job?.events?.[1]?.time).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Uploaded at</td>
                    <td>
                      {isNotFinished(formattedState, job)
                        ? "-"
                        : new Date(job?.events?.[2]?.time).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Processed at</td>
                    <td>
                      {isNotFinished(formattedState, job)
                        ? "-"
                        : new Date(job?.events?.[3]?.time).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td>Done at</td>
                    <td>
                      {isNotFinished(formattedState, job)
                        ? "-"
                        : new Date(job?.events?.[4]?.time).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>

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

JobUID.getLayout = (page) => <DashBoardLayout title="JobUID">{page}</DashBoardLayout>
