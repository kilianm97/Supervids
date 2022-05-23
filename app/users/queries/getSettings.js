import db from "db"
export default async function getSettings(_ = null, { session }) {
  if (!session.userId) return null
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
      failureTime: true,
    },
  })
  return settings
}
