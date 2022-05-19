import { resolver, SecurePassword } from "blitz"
import db from "db"

export default resolver.pipe(async ({ id }) => {
  const user = await db.user.delete({
    where: {
      id: id,
    },
  })

  return user
})
