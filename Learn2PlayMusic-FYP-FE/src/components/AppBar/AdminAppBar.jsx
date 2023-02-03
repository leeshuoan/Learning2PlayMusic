import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const AdminAppBar = ({ handleResetRoles }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const pages = ["AdminTemp"]

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    handleResetRoles()
    Auth.signOut().then(() => {
      console.log("Signed out")
      navigate('/')
    }).catch((err) => console.log(err))
  };

  const handleRoute = (page) => {
  }
  return (
    <>
      {
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
                  <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Log Out</Typography>
                </MenuItem>
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
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Log Out</Typography>
                </MenuItem>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      }
    </>
  );
}

export default AdminAppBar;