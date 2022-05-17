import { useQuery } from "blitz"
import getAllUsers from "app/users/queries/getAllUsers"
export const useAllUsers = () => {
  const [users] = useQuery(getAllUsers, null)
  return users
}
