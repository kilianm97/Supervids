import { useQuery } from "blitz"
import getAllJobs from "app/users/queries/getAllJobs"
export const useAllJobs = () => {
  const [jobs] = useQuery(getAllJobs, null)
  return jobs
}
