export default function formatState(job) {
  let state = ""
  if (job.state == "render:dorender") {
    if (Math.abs(Date.now() - new Date(job?.updatedAt).getTime()) / 1000 / 60 > 10) {
      state = "failed"
    } else {
      state = "processing"
    }
  }

  if (job.state == "queued") {
    state = "queued"
  }

  if (job.state == "started") {
    state = "picked"
  }

  if (job.state == "finished") {
    state = "finished"
  }

  if (job.state == "error") {
    state = "error"
  }

  return state
}
