export default function formatState(job) {
  let state = ""
  if (job.state == "render:dorender") {
    if (Math.abs(Date.now() - new Date(job?.createdAt).getTime()) / 1000 / 60 > 10) {
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

  return state
}
