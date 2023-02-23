import React from 'react';
import HomeAppBar from './HomeAppBar';
import AdminAppBar from './AdminAppBar';
import TeacherAppBar from './TeacherAppBar';
import UserAppBar from './UserAppBar';

function DefaultAppBar({ userInfo, handleResetUserInfo }) {
  return (
    <>
      {
        userInfo.role === 'Admin' ? <AdminAppBar userInfo={userInfo} handleResetUserInfo={handleResetUserInfo} />
          : userInfo.role === "Teacher" ? <TeacherAppBar userInfo={userInfo} handleResetUserInfo={handleResetUserInfo} />
            : userInfo.role === "User" ? <UserAppBar userInfo={userInfo} handleResetUserInfo={handleResetUserInfo} />
              : <HomeAppBar handleResetUserInfo={handleResetUserInfo} />
      }
    </>
  );
}

export default DefaultAppBar;
