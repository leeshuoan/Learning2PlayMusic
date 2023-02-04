import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Unauthorized from '../Unauthorized'
import { Auth } from 'aws-amplify';

const PrivateRoutes = ({userType}) => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      console.log(user)
      user.getSession((err, session) => {
        setLoading(false)
        if (err) {
          console.log(err);
          setUserRole("home")
        }
        let userRole = session.getIdToken().payload["userRole"];
        setUserRole(userRole)
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
      {loading ? null : isAuth ? <Outlet /> : <Unauthorized userRole={userRole}/>}
    </>
  )
}

export default PrivateRoutes