import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AdminAppBar from './AdminAppBar';
import { AppBar, Box, Toolbar, IconButton, Menu, Container, MenuItem, useTheme, Typography } from '@mui/material';

function DefaultAppBar({ role, handleResetRoles }) {
  const theme = useTheme()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const pages = ['Our Website', 'Contact Us']

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleRoute = (page) => {
    if (page === 'Our Website') {
      window.open(`https://www.learn2playmusic.sg/`, '_blank')
    } else if (page === "Contact Us") {
      window.open(`https://www.learn2playmusic.sg/contact-us.html`, '_blank')
    }
  }

  return (
    <>
      {
        role === 'admin' ? <AdminAppBar handleResetRoles={handleResetRoles} />
          : role === "teacher" ? <TeacherAppBar handleResetRoles={handleResetRoles} />
            : role === "user" ? <UserAppBar handleResetRoles={handleResetRoles} />
              :
              <AppBar position="static" sx={{ bgcolor: theme.palette.background.paper }}>
                <Container maxWidth="xl" sx={{ width: 0.9 }}>
                  <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                      >
                        <MenuIcon />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                          display: { xs: 'block', md: 'none' },
                        }}
                      >
                        {pages.map((page) => (
                          <MenuItem key={page} onClick={() => handleRoute(page)}>
                            <Typography textAlign="center" >{page}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                    <IconButton disableRipple>
                      <img src="/logo.png" width="150px" />
                    </IconButton>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                      {pages.map((page) => (
                        <MenuItem key={page} onClick={() => handleRoute(page)}>
                          <Typography textAlign="center" >{page}</Typography>
                        </MenuItem>
                      ))}
                    </Box>
                  </Toolbar>
                </Container>
              </AppBar>
      }
    </>
  );
}

export default DefaultAppBar;
