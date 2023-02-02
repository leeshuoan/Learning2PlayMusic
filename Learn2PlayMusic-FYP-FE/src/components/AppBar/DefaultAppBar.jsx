import Skeleton from '@mui/material/Skeleton';
import { AppBar, Box, Toolbar, IconButton, Container, MenuItem, useTheme, Typography } from '@mui/material';

function DefaultAppBar({ role, handleResetRoles }) {
  const theme = useTheme()

  const pages = ['Our Website', 'Contact Us']

  const handleRoute = (page) => {
    if (page === 'Our Website') {
      navigate(`https://www.learn2playmusic.sg/`)
    } else if (page === "Contact Us") {
      navigate(`https://www.learn2playmusic.sg/contact-us.html`)
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
                <Container maxWidth="xl">
                  <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton disableRipple>
                      <img src="/logo.png" width="150px" />
                    </IconButton>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                      {pages.map((page) => (
                        <MenuItem key={page} onClick={() => handleRoute(page)}>
                          <Typography textAlign="center" color="primary">{page}</Typography>
                        </MenuItem>
                      ))}
                    </Box>
                  </Toolbar>
                </Container>
              </AppBar>
      }
    </>
  )
}

export default DefaultAppBar