import db from "db"
export default async function getJobDetails(input) {
  const settings = await db.settings.findFirst({
    where: {
      id: 1,
    },
    select: {
      id: true,
      apiAddress: true,
      apiPort: true,
      apiKey: true,
      apiSecret: true,
    },
  })

  const job = await fetch(
    `http://${settings.apiAddress}${
      settings.apiPort != "-" ? ":" + settings.apiPort : ""
    }/api/v1/jobs/${input}`,
    {
      headers: {
        "supervid-key": settings.apiKey,
        "supervid-secret": settings.apiSecret,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json())
  return job
}
