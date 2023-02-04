import React from 'react';
import HomeAppBar from './HomeAppBar';
import AdminAppBar from './AdminAppBar';
import TeacherAppBar from './TeacherAppBar';

function DefaultAppBar({ role, handleResetRoles }) {
  return (
    <>
      {
        role === 'Admin' ? <AdminAppBar handleResetRoles={handleResetRoles} />
          : role === "Teacher" ? <TeacherAppBar handleResetRoles={handleResetRoles} />
            : role === "User" ? <UserAppBar handleResetRoles={handleResetRoles} />
              : <HomeAppBar handleResetRoles={handleResetRoles} />
      }
    </>
  );
}

export default DefaultAppBar;
