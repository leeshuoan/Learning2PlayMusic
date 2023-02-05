import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Unauthorized from '../Unauthorized'
import { Auth } from 'aws-amplify';

const PrivateRoutes = ({userType}) => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      user.getSession((err, session) => {
        setLoading(false)
        if (err) {
          console.log(err);
          setUserInfo({
            role: "home"
          })
        }
        let userRole = session.getIdToken().payload["userRole"];
        setUserInfo({
          role: "home"
        })
        if (userRole == userType) {
          let userInfo = {
            "name": session.getIdToken().payload["name"],
            "role": userRole
          }
          console.log(userInfo)
          setUserInfo(userInfo)
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      })
    }).catch((err) => {
      console.log(err)
      setLoading(false)
      setIsAuth(false)
    })
  }, [])

  return (
    <>
      {loading ? null : isAuth&&(userInfo.role=="Teacher") ? <Outlet context={{ userInfo }} /> : <Unauthorized userRole={userRole}/>}
    </>
  )
}

export default PrivateRoutes