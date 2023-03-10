import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "./theme/index";
import PrivateRoutes from "./components/utils/PrivateRoutes";
// Amplify setup
import aws_exports from "./aws-exports";
import { Amplify } from "aws-amplify";
import { Auth, Storage } from "aws-amplify";
// App components
import DefaultAppBar from "./components/AppBar/DefaultAppBar";
import SignIn from "./components/SignIn";
import ForgotPassword from "./components/ForgotPassword";
import NotFound from "./components/NotFound";
import TeacherHome from "./components/Teacher/TeacherHome";
import TeacherCourse from "./components/Teacher/TeacherCourse";
import UserHome from "./components/User/UserHome";
import UserCourse from "./components/User/UserCourse";
import Chat from "./components/Chat/Chat";
import Announcements from "./components/Announcements";
import UserClassMaterials from "./components/User/Course/UserClassMaterials";
import UserHomework from "./components/User/Course/UserHomework";
import UserReport from "./components/User/Course/UserReport";
import UserQuiz from "./components/User/Course/UserQuiz";
import AdminHome from "./components/Admin/AdminHome";
import Profile from "./components/Profile";
import UserHomeworkFeedback from "./components/User/Course/UserHomeworkFeedback";
import CourseAnnouncementForm from "./components/Teacher/CourseAnnouncementForm";

Amplify.configure(aws_exports);

function App() {
  const [userInfo, setUserInfo] = useState({});
  const [fetchUserInfo, setFetchUserInfo] = useState(false);

  const handleResetUserInfo = () => {
    setUserInfo({
      role: "home",
    });
  };

  const handleSetUserInfo = (userInfo) => {
    setUserInfo(userInfo);
  };

  const handleRefreshUserInfo = () => {
    setFetchUserInfo(!fetchUserInfo);
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        user.getSession((err, session) => {
          if (err) {
            console.log(err);
            handleResetUserInfo();
          }

          let groups = session.getIdToken().payload["cognito:groups"];
          let userRole = null;
          if (groups.includes("Admins")) {
            userRole = "Admin";
          } else if (groups.includes("Teachers")) {
            userRole = "Teacher";
          } else if (groups.includes("Users")) {
            userRole = "User";
          }

          if (userRole != null) {
            let userInfo = {
              id: session.getIdToken().payload.sub,
              name: session.getIdToken().payload["custom:name"],
              role: userRole,
              email: session.getIdToken().payload.email,
              profileImage: session.getIdToken().payload["custom:profileImage"],
            };
            console.log(userInfo);
            setUserInfo(userInfo);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        handleResetUserInfo();
      });
  }, [fetchUserInfo]);

  return (
    <div className="App">
      <ThemeProvider>
        <DefaultAppBar userInfo={userInfo} handleResetUserInfo={() => handleResetUserInfo()} />
        <ToastContainer />
        <Routes>
          <Route path="/">
            <Route index element={<SignIn userInfo={userInfo} handleSetUserInfo={handleSetUserInfo} />} />
          </Route>

          <Route path="admin" element={<PrivateRoutes userType="Admin"></PrivateRoutes>}>
            <Route index element={<AdminHome userInfo={userInfo} />} />
          </Route>

          <Route path="teacher" element={<PrivateRoutes userType="Teacher"></PrivateRoutes>}>
            <Route index element={<TeacherHome userInfo={userInfo} />} />
            <Route path="announcements" element={<Announcements userInfo={userInfo} />} />
            <Route path="course/:courseid">
              <Route index element={<TeacherCourse userInfo={userInfo} />} />
              <Route path="announcement/:type/:announcementId?" element={<CourseAnnouncementForm />} />
              <Route path=":category" element={<TeacherCourse userInfo={userInfo} />} />
              {/* <Route path="material/:materialId" element={<UserClassMaterials />} />
                <Route path="homework/:homeworkId" element={<UserHomework userInfo={userInfo} />} />
                <Route path="homework/:homeworkId/feedback" element={<UserHomeworkFeedback userInfo={userInfo} />} />
                <Route path="report/:reportId" element={<UserReport />} />
                <Route path="quiz/:quizId" element={<UserQuiz userInfo={userInfo}/>} />  */}
            </Route>
          </Route>

          <Route path="home" element={<PrivateRoutes userType="User"></PrivateRoutes>}>
            <Route index element={<UserHome userInfo={userInfo} />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="course/:courseid">
              <Route index element={<UserCourse userInfo={userInfo} />} />
              <Route path=":category" element={<UserCourse userInfo={userInfo} />} />
              <Route path="material/:materialId" element={<UserClassMaterials />} />
              <Route path="homework/:homeworkId" element={<UserHomework userInfo={userInfo} />} />
              <Route path="homework/:homeworkId/feedback" element={<UserHomeworkFeedback userInfo={userInfo} />} />
              <Route path="report/:reportId" element={<UserReport />} />
              <Route path="quiz/:quizId" element={<UserQuiz userInfo={userInfo} />} />
            </Route>
          </Route>

          <Route path="chat" element={<Chat userInfo={userInfo} />} />
          <Route path="profile" element={<Profile userInfo={userInfo} refreshUserInfo={handleRefreshUserInfo} />}></Route>
          <Route path="resetpassword" element={<ForgotPassword />}></Route>
          <Route path="*" element={<NotFound userRole={userInfo.role} />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
