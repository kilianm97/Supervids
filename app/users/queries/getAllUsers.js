import db from "db"
export default async function getCurrentUser(_ = null, { session }) {
  const users = await db.user.findMany({
    select: {
      id: true,
      createdAt: true,
      lastLogin: true,
      name: true,
      email: true,
      notifications: true,
    },
  })
  return users
}
