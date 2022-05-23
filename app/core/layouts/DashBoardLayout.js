import { Head } from "blitz"
import SideBar from "../components/sidebar"
import { Suspense } from "react"

const DashBoardLayout = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "supervids"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ display: "flex" }}>
        <SideBar />
        <Suspense>{children}</Suspense>
      </div>
    </>
  )
}

DashBoardLayout.authenticate = true

export default DashBoardLayout
