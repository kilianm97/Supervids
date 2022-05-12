import DashBoardLayout from "app/core/layouts/DashBoardLayout"
import { useParam } from "blitz"
import { useEffect, useState } from "react"
import { Container, Table, Badge } from "react-bootstrap"

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
    formatState()
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

  const calcDuration = () => {
    const dateDiff = isFailed()
      ? (Date.now() - new Date(job?.createdAt).getTime()) / 1000
      : (new Date(job?.events?.[4]?.time).getTime() - new Date(job?.createdAt).getTime()) / 1000
    const mins = (dateDiff % 3600) / 60
    return mins.toFixed(2)
  }

  const formatState = () => {
    if (job.state == "render:dorender") {
      if (Math.abs(Date.now() - new Date(job?.createdAt).getTime()) / 1000 / 60 > 10) {
        setFormattedState("failed")
      } else {
        setFormattedState("processing")
      }
    }

    if (job.state == "started") {
      setFormattedState("picked")
    }

    if (job.state == "finished") {
      setFormattedState("finished")
    }
  }

  const getStatusColor = () => {
    switch (formattedState) {
      case "picked":
        return "light"
        break
      case "queued":
        return "secondary"
        break
      case "processing":
        return "warning"
        break
      case "failed":
        return "danger"
        break
      case "finished":
        return "success"
        break
    }
  }

  const isFailed = () => {
    if (typeof formattedState != "undefined") {
      return formattedState == "failed" ? true : false
    }
  }

  return (
    <>
      <Container fluid>
        <Table responsive>
          <tbody>
            <tr>
              <td>Uid</td>
              <td>{job?.uid}</td>
            </tr>
            <tr>
              <td>State</td>
              <td>
                <Badge pill bg={getStatusColor()} text={formattedState == "picked" ? "dark" : null}>
                  {formattedState}
                </Badge>
              </td>
            </tr>
            <tr>
              <td>Created at</td>
              <td>{new Date(job?.createdAt).toUTCString()}</td>
            </tr>
            <tr>
              <td>Updated at</td>
              <td>{new Date(job?.updatedAt).toUTCString()}</td>
            </tr>
            <tr>
              <td>Duration</td>
              <td>{calcDuration()}</td>
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
              <td>{isFailed() ? "-" : new Date(job?.events?.[0]?.time).toUTCString()}</td>
            </tr>
            <tr>
              <td>Encoded at</td>
              <td>{isFailed() ? "-" : new Date(job?.events?.[1]?.time).toUTCString()}</td>
            </tr>
            <tr>
              <td>Uploaded at</td>
              <td>{isFailed() ? "-" : new Date(job?.events?.[2]?.time).toUTCString()}</td>
            </tr>
            <tr>
              <td>Processed at</td>
              <td>{isFailed() ? "-" : new Date(job?.events?.[3]?.time).toUTCString()}</td>
            </tr>
            <tr>
              <td>Done at</td>
              <td>{isFailed() ? "-" : new Date(job?.events?.[4]?.time).toUTCString()}</td>
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
