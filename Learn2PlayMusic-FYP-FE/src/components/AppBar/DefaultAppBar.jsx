import React from 'react';
import HomeAppBar from './HomeAppBar';
import AdminAppBar from './AdminAppBar';
import TeacherAppBar from './TeacherAppBar';
import Skeleton from '@mui/material/Skeleton';
import { AppBar, Box, Toolbar, IconButton, Container, MenuItem, useTheme } from '@mui/material';

function DefaultAppBar({ role, handleResetRoles }) {
  const theme = useTheme()

  return (
    <>
      {
        role === 'admin' ? <AdminAppBar handleResetRoles={handleResetRoles} />
          : role === "teacher" ? <TeacherAppBar handleResetRoles={handleResetRoles} />
            : role === "user" ? <UserAppBar handleResetRoles={handleResetRoles} />
              : role === "home" ? <HomeAppBar handleResetRoles={handleResetRoles} />
                :
                <AppBar position="static" sx={{ bgcolor: theme.palette.background.paper }}>
                  <Container maxWidth="xl">
                    <Toolbar disableGutters>
                      <IconButton disableRipple>
                        <img src="/SSSLogo1.png" width="70px" />
                      </IconButton>
                      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <MenuItem>
                          <Skeleton variant="rounded" width={150} height={40} />
                        </MenuItem>
                        <MenuItem>
                          <Skeleton variant="rounded" width={150} height={40} />
                        </MenuItem>
                        <MenuItem>
                          <Skeleton variant="rounded" width={150} height={40} />
                        </MenuItem>
                      </Box>
                      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <MenuItem>
                          <Skeleton variant="rounded" width={150} height={40} />
                        </MenuItem>
                      </Box>
                    </Toolbar>
                  </Container>
                </AppBar>
      }
    </>
  );
}

export default DefaultAppBar;
