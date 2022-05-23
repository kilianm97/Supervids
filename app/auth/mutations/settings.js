import { resolver, hash256 } from "blitz"
import db from "db"
import { Settings } from "app/auth/validations"

export default resolver.pipe(
  resolver.zod(Settings),
  async ({ id, apiAddress, apiPort, apiKey, apiSecret, failureTime }, ctx) => {
    await db.settings.update({
      where: {
        id: id,
      },
      data: {
        apiAddress,
        apiPort,
        apiKey,
        apiSecret: apiSecret,
        failureTime,
      },
    })
    return true
  }
)
