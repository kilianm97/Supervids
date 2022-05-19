import Layout from "app/core/layouts/Layout"
import { useRouter, Image } from "blitz"
import { useMutation } from "blitz"
import login from "app/auth/mutations/login"
import { LoginForm } from "app/auth/components/LoginForm"

import loginPicture from "app/assets/login-picture.jpg"
import S8Logo from "app/assets/superhuit.svg"

const LoginPage = () => {
  const router = useRouter()
  return (
    <div className="d-flex align-items-center vw-100 vh-100">
      <figure className="w-50 h-100 m-0 position-relative">
        <Image layout="fill" objectFit="cover" src={loginPicture} alt="appareil superhuit" />
      </figure>
      <div className="d-flex flex-column w-50 align-items-center">
        <Image src={S8Logo} alt="logo superhuit" />
        <h1 className="mt-3 mb-3">Login</h1>
        <LoginForm
          onSuccess={(_user) => {
            const next = router.query.next ? decodeURIComponent(router.query.next) : "/jobs"
            router.push(next)
          }}
        />
      </div>
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/jobs"

LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
