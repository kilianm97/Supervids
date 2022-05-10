import { Head } from "blitz"
import SideBar from "../components/sidebar"

const DashBoardLayout = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "supervids"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ display: "flex" }}>
        <SideBar />
        {children}
      </div>
    </>
  )
}

export default DashBoardLayout
