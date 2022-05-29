import { resolver } from "blitz"
import db from "db"
import moment from "moment"
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
        failureTime: moment(failureTime, "HH:mm:ss").diff(moment().startOf("day"), "milliseconds"),
      },
    })
    return true
  }
)
