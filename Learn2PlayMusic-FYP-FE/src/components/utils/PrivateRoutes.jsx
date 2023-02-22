import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Unauthorized from '../Unauthorized'
import { Auth } from 'aws-amplify';

const PrivateRoutes = ({ userType }) => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({})

  const handleResetUserInfo = () => {
    setUserInfo({
      role: "home"
    })
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      user.getSession((err, session) => {
        if (err) {
          console.log(err);
          handleResetUserInfo()
        }

        let groups = session.getIdToken().payload["cognito:groups"];
        let userRole = null
        if (groups.includes("Admins")) {
          userRole = "Admin";
        } else if (groups.includes("Teachers")) {
          userRole = "Teacher";
        } else if (groups.includes("Users")) {
          userRole = "User";
        }

        if (userRole != null) {
          let userInfo = {
            name: session.getIdToken().payload['custom:name'],
            role: userRole,
          };
          setUserInfo(userInfo);
          setLoading(false)
        }

        if (userRole == userType) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      })
    }).catch((err) => {
      console.log(err)
      handleResetUserInfo()
      setLoading(false)
      setIsAuth(false)
    })
  }, [])

  return (
    <>
      {loading ? null
        : (isAuth && (userInfo.role == "Teacher")) ? <Outlet context={{ userInfo }} />
          : (isAuth && (userInfo.role == "User")) ? <Outlet context={{ userInfo }} />
            : (isAuth && (userInfo.role == "Admin")) ? <Outlet context={{ userInfo }} />
              : <Unauthorized userRole={userInfo.role} />}
    </>
  )
}

export default PrivateRoutes