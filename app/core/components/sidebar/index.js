import { Image, Link, Routes } from "blitz"

import styles from "./styles.module.scss"

export default function SideBar() {
  return (
    <div className={styles.sideBar}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link href={Routes.jobsList()}>Jobs</Link>
        </li>
      </ul>
    </div>
  )
}
