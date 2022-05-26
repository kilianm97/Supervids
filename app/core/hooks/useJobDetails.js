import { useQuery } from "blitz"
import getJobDetails from "app/users/queries/getJobDetails"
export const useJobDetails = (uid) => {
  const [job] = useQuery(getJobDetails, uid, null)
  return job
}
