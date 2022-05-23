import db from "db"
export default async function getAllJobs(_ = null, { session }) {
  const settings = await db.settings.findFirst({
    where: {
      id: 1,
    },
    select: {
      id: true,
      apiAddress: true,
      apiKey: true,
      apiSecret: true,
    },
  })

  const jobs = await fetch(`http://${settings.apiAddress}/api/v1/jobs`, {
    headers: {
      "supervid-key": settings.apiKey,
      "supervid-secret": settings.apiSecret,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
  return jobs
}
