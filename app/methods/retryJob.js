import { Router } from "blitz"

export default function retryJob(job) {
  fetch(`${process.env.BLITZ_PUBLIC_API_URL}api/v1/jobs/${job?.uid}`, {
    method: "PUT",
    headers: {
      "supervid-key": process.env.BLITZ_PUBLIC_API_KEY,
      "supervid-secret": process.env.BLITZ_PUBLIC_API_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state: "queued" }),
  })
    .then((res) => res.json())
    .then(() => {
      Router.reload(window.location.pathname)
    })
}
