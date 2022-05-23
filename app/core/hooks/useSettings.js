import { useQuery } from "blitz"
import getSettings from "app/users/queries/getSettings"
export const useSettings = () => {
  const [settings] = useQuery(getSettings, null)
  return settings
}
