export default function isNotFinished(formattedState, job) {
  if (typeof formattedState != "undefined") {
    return typeof job?.events == "undefined" ? true : false
  }
}
