import isNotFinished from "app/methods/isNotFinished"

export default function calcDuration(job, formattedState) {
  const dateDiff = isNotFinished(formattedState, job)
    ? (Date.now() - new Date(job?.createdAt).getTime()) / 1000 / 60
    : (new Date(job?.events?.[4]?.time).getTime() - new Date(job?.createdAt).getTime()) / 1000 / 60
  return Math.abs(dateDiff).toFixed(2)
}
