import db from "db"

export default async function retry(job) {
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
  ).then((res) => res.json())
}
