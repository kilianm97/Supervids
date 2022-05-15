import isNotFinished from "app/methods/isNotFinished"

export default function calcDuration(job, formattedState) {
  const dateDiff = isNotFinished(formattedState, job)
    ? Date.now() - new Date(job?.updatedAt).getTime()
    : new Date(job?.events?.[4]?.time).getTime() - new Date(job?.createdAt).getTime()

  console.log(dateDiff / 1000)
  let seconds = Math.floor(dateDiff / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}
