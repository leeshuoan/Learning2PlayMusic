import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "./theme/index";
import PrivateRoutes from "./components/utils/PrivateRoutes";
// App components
import DefaultAppBar from "./components/AppBar/DefaultAppBar";
import SignIn from "./components/SignIn";
import TeacherHome from "./components/Teacher/TeacherHome";
import UserHome from "./components/User/UserHome";
import UserCourse from "./components/User/UserCourse";
import ChatBase from "./components/Chat/ChatBase";
// Amplify setup
import aws_exports from "./aws-exports";
import { Amplify } from "aws-amplify";
import { Auth } from "aws-amplify";
Amplify.configure(aws_exports);

function App() {
  const [userInfo, setUserInfo] = useState({});

  const handleResetUserInfo = () => {
    setUserInfo({
      role: "home",
    });
  };

  const handleSetUserInfo = (userInfo) => {
    setUserInfo(userInfo);
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user)
        user.getSession((err, session) => {
          if (err) {
            console.log(err);
            handleResetUserInfo();
          }
          let userRole = session.getIdToken().payload["userRole"];
          const roles = ["Admin", "Teacher", "User"];
          if (roles.includes(userRole)) {
            let userInfo = {
              name: session.getIdToken().payload["name"],
              role: userRole,
            };
            setUserInfo(userInfo);
          } else {
            handleResetUserInfo();
          }
        });
      })
      .catch((err) => {
        console.log(err);
        handleResetUserInfo();
      });
  }, []);

  return (
    <div className="App">
      <ThemeProvider>
        <DefaultAppBar
          userInfo={userInfo}
          handleResetUserInfo={() => handleResetUserInfo()}
        />
        <ToastContainer />
        <Routes>
          <Route path="/">
            <Route
              index
              element={<SignIn handleSetUserInfo={handleSetUserInfo} />}
            />
          </Route>
          <Route
            path="admin"
            element={<PrivateRoutes userType="Admin"></PrivateRoutes>}></Route>
          <Route
            path="teacher"
            element={<PrivateRoutes userType="Teacher"></PrivateRoutes>}>
            <Route index element={<TeacherHome userInfo={userInfo} />} />
            <Route path="chat" element={<ChatBase />} />
          </Route>
          <Route
            path="home"
            element={<PrivateRoutes userType="User"></PrivateRoutes>}>
            <Route index element={<UserHome userInfo={userInfo} />} />
            <Route path="course/:courseid" element={<UserCourse />} />
          </Route>

        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
