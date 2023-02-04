import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Unauthorized from '../Unauthorized'
// Amplify setup
import aws_exports from '../../aws-exports';
import { Amplify } from 'aws-amplify'
import { Auth } from 'aws-amplify';
Amplify.configure(aws_exports);

const PrivateRoutes = ({userType}) => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      console.log(user)
      user.getSession((err, session) => {
        setLoading(false)
        if (err) {
          console.log(err);
          setRole("home")
        }
        let userRole = session.getIdToken().payload["userRole"];
        console.log(userRole)
        console.log(userType)
        if (userRole == userType) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      })
    })
  }, [])

  return (
    <>
      {loading ? null : isAuth ? <Outlet /> : <Unauthorized/>}
    </>
  )
}

export default PrivateRoutes