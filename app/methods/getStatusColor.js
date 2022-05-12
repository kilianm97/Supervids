export default function getStatusColor(formattedState) {
  switch (formattedState) {
    case "picked":
      return "info"
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
