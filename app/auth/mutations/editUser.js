import { resolver, SecurePassword } from "blitz"
import db from "db"
import { EditUser } from "app/auth/validations"

export default resolver.pipe(resolver.zod(EditUser), async ({ email, newPassword }, ctx) => {
  const hashedPassword = await SecurePassword.hash(newPassword.trim())
  const user = await db.user.update({
    where: {
      email: email,
    },
    data: {
      hashedPassword,
    },
  })

  return user
})
