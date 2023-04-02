import React from "react";
import AdminAppBar from "./AdminAppBar";
import HomeAppBar from "./HomeAppBar";
import SuperAdminAppBar from "./SuperAdminAppBar";
import TeacherAppBar from "./TeacherAppBar";
import UserAppBar from "./UserAppBar";

function DefaultAppBar({ userInfo, handleResetUserInfo }) {
  if (userInfo.role === "Admin") {
    return <AdminAppBar userInfo={userInfo} handleResetUserInfo={handleResetUserInfo} />;
  } else if (userInfo.role === "Teacher") {
    return <TeacherAppBar userInfo={userInfo} handleResetUserInfo={handleResetUserInfo} />;
  } else if (userInfo.role === "User") {
    return <UserAppBar userInfo={userInfo} handleResetUserInfo={handleResetUserInfo} />;
  } else if (userInfo.role === "SuperAdmin") {
    return <SuperAdminAppBar userInfo={userInfo} handleResetUserInfo={handleResetUserInfo} />;
  } else {
    return <HomeAppBar handleResetUserInfo={handleResetUserInfo} />;
  }
}

export default DefaultAppBar;
