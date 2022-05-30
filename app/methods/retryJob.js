import { Router } from "blitz"

export default function retryJob(job, settings) {
  fetch(
    `http://${settings.apiAddress}${
      settings.apiPort != "-" ? ":" + settings.apiPort : ""
    }/api/v1/jobs/${job?.uid}`,
    {
      method: "PUT",
      headers: {
        "supervid-key": settings.apiKey,
        "supervid-secret": settings.apiSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: "queued" }),
    }
  )
    .then((res) => res.json())
    .then(() => {
      Router.reload(window.location.pathname)
    })
}
