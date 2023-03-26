import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import PrivateRoutes from "./components/utils/PrivateRoutes";
import ThemeProvider from "./theme/index";
// Amplify setup
import { Amplify, Auth } from "aws-amplify";
import aws_exports from "./aws-exports";
// App components
// general
import Announcements from "./components/Announcements";
import DefaultAppBar from "./components/AppBar/DefaultAppBar";
import Chat from "./components/Chat/Chat";
import ForgotPassword from "./components/ForgotPassword";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
// user
import UserClassMaterials from "./components/User/Course/UserClassMaterials";
import UserHomework from "./components/User/Course/UserHomework";
import UserHomeworkFeedback from "./components/User/Course/UserHomeworkFeedback";
import UserQuiz from "./components/User/Course/UserQuiz";
import UserReport from "./components/User/Course/UserReport";
import UserCourse from "./components/User/UserCourse";
import UserHome from "./components/User/UserHome";
// admin
import AdminHome from "./components/Admin/AdminHome";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import AdminAnnouncementManagement from "./components/Admin/Announcement/AdminAnnouncementManagement";
import AdminCourseManagement from "./components/Admin/Course/AdminCourseManagement";

// teacher
import CourseAnnouncementForm from "./components/Teacher/Course/Announcement/CourseAnnouncementForm";
import EditHomeworkForm from "./components/Teacher/Course/Homework/EditHomeworkForm";
import NewHomeworkForm from "./components/Teacher/Course/Homework/NewHomeworkForm";
import TeacherGradeHomework from "./components/Teacher/Course/Homework/TeacherGradeHomework";
import TeacherHomeworkOverview from "./components/Teacher/Course/Homework/TeacherHomeworkOverview";
import CourseMaterialsForm from "./components/Teacher/Course/Materials/CourseMaterialsForm";
import EditCourseMaterialsForm from "./components/Teacher/Course/Materials/EditCourseMaterialsForm";
import NewCourseMaterialsForm from "./components/Teacher/Course/Materials/NewCourseMaterialsForm";
import ViewCourseMaterialsForm from "./components/Teacher/Course/Materials/ViewCourseMaterialsForm";
import EditQuiz from "./components/Teacher/Course/Quiz/EditQuiz";
import NewQuiz from "./components/Teacher/Course/Quiz/NewQuiz";
import BaseProgressReport from "./components/Teacher/Course/Report/BaseProgressReport";
import TeacherCourse from "./components/Teacher/TeacherCourse";
import TeacherHome from "./components/Teacher/TeacherHome";

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
            <Route path="users" element={<AdminUserManagement userInfo={userInfo} />} />
            <Route path="announcements" element={<AdminAnnouncementManagement />} />
            <Route path="courses" element={<AdminCourseManagement />} />
            {/* <Route path=":category" element={<AdminHome userInfo={userInfo} />} /> */}
          </Route>

          <Route path="teacher" element={<PrivateRoutes userType="Teacher"></PrivateRoutes>}>
            <Route index element={<TeacherHome userInfo={userInfo} />} />
            <Route path="announcements" element={<Announcements userInfo={userInfo} />} />
            <Route path="course/:courseid">
              <Route index element={<TeacherCourse userInfo={userInfo} />} />
              <Route path=":category" element={<TeacherCourse userInfo={userInfo} />} />
              <Route path="announcement/:type/:announcementId?" element={<CourseAnnouncementForm />} />
              <Route path="material/:type/:materialid?" element={<CourseMaterialsForm />} />
              <Route path="material/view/:materialid?" element={<ViewCourseMaterialsForm />} />
              <Route path="material/new" element={<NewCourseMaterialsForm />} />
              <Route path="material/edit/:materialid?" element={<EditCourseMaterialsForm />} />
              <Route path="homework/new" element={<NewHomeworkForm />} />
              <Route path="homework/:homeworkId">
                <Route index element={<TeacherHomeworkOverview />} />
                <Route path="edit" element={<EditHomeworkForm />} />
                <Route path="grade/:userId" element={<TeacherGradeHomework />} />
              </Route>
              <Route path="report/:userId" element={<BaseProgressReport />} />
              <Route path="report/:userId/:reportId" element={<BaseProgressReport />} />
              <Route path="quiz/new" element={<NewQuiz userInfo={userInfo} />} />
              <Route path="quiz/edit/:quizId" element={<EditQuiz userInfo={userInfo} />} />
            </Route>
          </Route>

          <Route path="home" element={<PrivateRoutes userType="User"></PrivateRoutes>}>
            <Route index element={<UserHome userInfo={userInfo} />} />
            <Route path="announcements" element={<Announcements userInfo={userInfo} />} />
            <Route path="course/:courseid">
              <Route index element={<UserCourse userInfo={userInfo} />} />
              <Route path=":category" element={<UserCourse userInfo={userInfo} />} />
              <Route path="material/:materialId" element={<UserClassMaterials />} />
              <Route path="homework/:homeworkId" element={<UserHomework userInfo={userInfo} />} />
              <Route path="homework/:homeworkId/feedback" element={<UserHomeworkFeedback userInfo={userInfo} />} />
              <Route path="report/:reportId" element={<UserReport userInfo={userInfo} />} />
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
