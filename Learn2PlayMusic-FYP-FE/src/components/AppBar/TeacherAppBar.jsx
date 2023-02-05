import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, MenuItem, useTheme, Avatar, Divider, ListItemIcon, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const TeacherAppBar = ({ userInfo, handleResetUserInfo }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const pages = ["Home", "Courses"]

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleResetUserInfo()
    Auth.signOut().then(() => {
      console.log("Signed out")
      navigate('/')
    }).catch((err) => console.log(err))
  };

  const handleRoute = (page) => {
    if (page === "Home") {
      navigate("/teacher")
    } else if (page === "Courses") {
      navigate("/teacher/courses")
    }
  }
  return (
    <>
      {
        <AppBar position="static" sx={{ bgcolor: theme.palette.background.paper }}>
          <Container maxWidth="xl" sx={{ width: 0.9 }}>
            <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>

              {/* MOBILE NAV */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
                  {/* {pages.map((page) => (
                    <MenuItem key={page} onClick={() => handleRoute(page)}>
                      <Typography textAlign="center" >{page}</Typography>
                    </MenuItem>
                  ))} */}
                  <MenuItem>NOTHING HERE YET</MenuItem>
                </Menu>
              </Box>

              <IconButton disableRipple>
              <img src="/l2pm_logo.png" width="150px" />
              </IconButton>

              {/* DESKTOP NAV */}
              {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <MenuItem sx={{ bgcolor: "background.paper" }} key={page} onClick={() => handleRoute(page)}>
                    <Typography textAlign="center" >{page}</Typography>
                  </MenuItem>
                ))}
              </Box> */}

              {/* USER MENU */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                  <Avatar sx={{ display: { xs: 'none', md: 'flex' }, width: 32, height: 32, bgcolor: "grey[100]" }}>
                    <NotificationsIcon />
                  </Avatar>
                  <Avatar sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, width: 32, height: 32, bgcolor: "grey[100]" }}>
                    <ChatIcon />
                  </Avatar>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 1 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>T</Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Avatar /> My account
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      }
    </>
  );
}

export default TeacherAppBar;