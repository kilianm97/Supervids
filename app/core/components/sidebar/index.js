import { Link, Routes, useRouter } from "blitz"
import clsx from "clsx"

import styles from "./styles.module.scss"

export default function SideBar() {
  const router = useRouter()
  return (
    <div className={styles.sideBar}>
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
      </ul>
    </div>
  )
}
