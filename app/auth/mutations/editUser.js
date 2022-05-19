import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { EditUser } from "app/auth/validations"

export default resolver.pipe(
  resolver.zod(EditUser),
  async ({ email, newPassword, currentPassword }, ctx) => {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    })

    await SecurePassword.verify(user.hashedPassword, currentPassword)

    const hashedPassword = await SecurePassword.hash(newPassword.trim())
    await db.user.update({
      where: {
        email: email,
      },
      data: {
        hashedPassword,
      },
    })

    return user
  }
)
