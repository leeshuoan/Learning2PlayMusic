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
import ChangePassword from "./components/ChangePassword";
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
import AdminAnnouncementManagement from "./components/Admin/Announcement/AdminAnnouncementManagement";
import AdminEnrolmentManagement from "./components/Admin/Enrolment/AdminEnrolmentManagement";
import AdminUserManagement from "./components/Admin/User/AdminUserManagement";
// super admin
import SuperAdminAnnouncementManagement from "./components/SuperAdmin/Announcement/SuperAdminAnnouncementManagement";
import SuperAdminCourseManagement from "./components/SuperAdmin/Course/SuperAdminCourseManagement";
import SuperAdminEnrolmentManagement from "./components/SuperAdmin/Enrolment/SuperAdminEnrolmentManagement";
import SuperAdminHome from "./components/SuperAdmin/SuperAdminHome";
import SuperAdminUserManagement from "./components/SuperAdmin/User/SuperAdminUserManagement";

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
import QuizSummary from "./components/Teacher/Course/Quiz/QuizSummary";
import BaseProgressReport from "./components/Teacher/Course/Report/BaseProgressReport";
import TeacherCourse from "./components/Teacher/TeacherCourse";
import TeacherHome from "./components/Teacher/TeacherHome";

Amplify.configure(aws_exports);

const App = () => {
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
          if (groups.includes("SuperAdmins")) {
            userRole = "SuperAdmin";
          } else if (groups.includes("Teachers")) {
            userRole = "Teacher";
          } else if (groups.includes("Users")) {
            userRole = "User";
          } else if (groups.includes("Admins")) {
            userRole = "Admin";
          }

          if (userRole != null) {
            let userInfo = {
              id: session.getIdToken().payload.sub,
              name: session.getIdToken().payload["custom:name"],
              role: userRole,
              email: session.getIdToken().payload.email,
              profileImage: session.getIdToken().payload["custom:profileImage"],
              token: session.getIdToken().jwtToken,
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
            <Route path="students" element={<AdminUserManagement userInfo={userInfo} />} />
            <Route path="announcements" element={<AdminAnnouncementManagement userInfo={userInfo} />} />
            <Route path="enrolments" element={<AdminEnrolmentManagement userInfo={userInfo} />} />
          </Route>

          <Route path="superadmin" element={<PrivateRoutes userType="SuperAdmin"></PrivateRoutes>}>
            <Route index element={<SuperAdminHome userInfo={userInfo} />} />
            <Route path="users" element={<SuperAdminUserManagement userInfo={userInfo} />} />
            <Route path="announcements" element={<SuperAdminAnnouncementManagement userInfo={userInfo} />} />
            <Route path="courses" element={<SuperAdminCourseManagement userInfo={userInfo} />} />
            <Route path="enrolments" element={<SuperAdminEnrolmentManagement userInfo={userInfo} />} />
          </Route>

          <Route path="teacher" element={<PrivateRoutes userType="Teacher"></PrivateRoutes>}>
            <Route index element={<TeacherHome userInfo={userInfo} />} />
            <Route path="announcements" element={<Announcements userInfo={userInfo} />} />
            <Route path="course/:courseid">
              <Route index element={<TeacherCourse userInfo={userInfo} />} />
              <Route path=":category" element={<TeacherCourse userInfo={userInfo} />} />
              <Route path="announcement/:type/:announcementId?" element={<CourseAnnouncementForm userInfo={userInfo} />} />
              <Route path="material/:type/:materialid?" element={<CourseMaterialsForm userInfo={userInfo} />} />
              <Route path="material/view/:materialid?" element={<ViewCourseMaterialsForm userInfo={userInfo} />} />
              <Route path="material/new" element={<NewCourseMaterialsForm userInfo={userInfo} />} />
              <Route path="material/edit/:materialid?" element={<EditCourseMaterialsForm userInfo={userInfo} />} />
              <Route path="homework/new" element={<NewHomeworkForm userInfo={userInfo} />} />
              <Route path="homework/:homeworkId" element={<TeacherHomeworkOverview userInfo={userInfo} />} />
              <Route path="homework/edit/:homeworkId" element={<EditHomeworkForm userInfo={userInfo} />} />
              <Route path="homework/grade/:homeworkId/:userId" element={<TeacherGradeHomework userInfo={userInfo} />} />
              <Route path="report/:userId" element={<BaseProgressReport userInfo={userInfo} />} />
              <Route path="report/:userId/:reportId" element={<BaseProgressReport />} />
              <Route path="quiz/new" element={<NewQuiz userInfo={userInfo} />} />
              <Route path="quiz/edit/:quizId" element={<EditQuiz userInfo={userInfo} />} />
              <Route path="quiz/summary/:quizId" element={<QuizSummary userInfo={userInfo} />} />
            </Route>
          </Route>

          <Route path="home" element={<PrivateRoutes userType="User"></PrivateRoutes>}>
            <Route index element={<UserHome userInfo={userInfo} />} />
            <Route path="announcements" element={<Announcements userInfo={userInfo} />} />
            <Route path="course/:courseid">
              <Route index element={<UserCourse userInfo={userInfo} />} />
              <Route path=":category" element={<UserCourse userInfo={userInfo} />} />
              <Route path="material/:materialId" element={<UserClassMaterials userInfo={userInfo} />} />
              <Route path="homework/:homeworkId" element={<UserHomework userInfo={userInfo} />} />
              <Route path="homework/:homeworkId/feedback" element={<UserHomeworkFeedback userInfo={userInfo} />} />
              <Route path="report/:reportId" element={<UserReport userInfo={userInfo} />} />
              <Route path="quiz/:quizId" element={<UserQuiz userInfo={userInfo} />} />
            </Route>
          </Route>

          <Route element={<PrivateRoutes userType={["User", "Teacher", "Admin", "SuperAdmin"]}></PrivateRoutes>}>
            <Route path="chat" element={<Chat userInfo={userInfo} />} />
            <Route path="chat/:chatId" element={<Chat userInfo={userInfo} />} />
            <Route path="profile" element={<Profile userInfo={userInfo} refreshUserInfo={handleRefreshUserInfo} />}></Route>
          </Route>

          <Route path="changepassword" element={<ChangePassword />}></Route>
          <Route path="resetpassword" element={<ForgotPassword />}></Route>
          <Route path="*" element={<NotFound userRole={userInfo.role} />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
