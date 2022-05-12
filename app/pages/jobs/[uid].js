import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { useParam } from "blitz"
import { useEffect, useState } from "react"
import { Container, Table, Badge } from "react-bootstrap"

import calcDuration from "app/methods/calcDuration"
import isNotFinished from "app/methods/isNotFinished"
import formatState from "app/methods/formatState"
import getStatusColor from "app/methods/getStatusColor"
import retryJob from "app/methods/retryJob"

export default function JobUID() {
  const [job, setJob] = useState([])
  const [formattedState, setFormattedState] = useState()

  const uid = useParam("uid")

  useEffect(() => {
    if (typeof uid != "undefined") {
      fetchJob()
    }
  }, [uid])

  useEffect(() => {
    setFormattedState(formatState(job))
  }, [job])

  const fetchJob = () => {
    fetch(`${process.env.BLITZ_PUBLIC_API_URL}api/v1/jobs/${uid}`, {
      headers: {
        "supervid-key": process.env.BLITZ_PUBLIC_API_KEY,
        "supervid-secret": process.env.BLITZ_PUBLIC_API_SECRET,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((job) => {
        setJob(job)
      })
  }

  return (
    <>
      <Container fluid>
        {isNotFinished(formattedState, job) && formattedState == "failed" ? (
          <button onClick={retryJob(job)}>Retry</button>
        ) : null}
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
      </Container>
      <Container fluid>
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

JobUID.getLayout = (page) => <DashBoardLayout title="JobUID">{page}</DashBoardLayout>
