import { Link, Routes, useRouter, useMutation } from "blitz"
import logout from "app/auth/mutations/logout"
import { Button } from "react-bootstrap"
import clsx from "clsx"

import styles from "./styles.module.scss"

export default function SideBar() {
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()
  return (
    <div className={styles.sideBar}>
      <Button
        className="w-100 rounded-0"
        variant="danger"
        onClick={async () => {
          await logoutMutation()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-bar-left me-2"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"
          />
        </svg>
        <span>Logout</span>
      </Button>
      <ul className={styles.list}>
        <li
          className={clsx(
            styles.item,
            router.pathname == Routes.Jobs().pathname ? styles.active : null
          )}
        >
          <Link href={Routes.Jobs()}>Jobs</Link>
        </li>
        <li
          className={clsx(
            styles.item,
            router.pathname == Routes.Users().pathname ? styles.active : null
          )}
        >
          <Link href={Routes.Users()}>Users</Link>
        </li>
        <li
          className={clsx(
            styles.item,
            router.pathname == Routes.Settings().pathname ? styles.active : null
          )}
        >
          <Link href={Routes.Settings()}>Settings</Link>
        </li>
      </ul>
    </div>
  )
}
