import React from 'react'
import { useTheme, Container, Typography, Box, Avatar, CssBaseline, Button } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email';

const Profile = (userInfo) => {
  const theme = useTheme()

  console.log(userInfo)
  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Container component="main" maxWidth="xs" sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: theme.shadows[10], width: { xs: 1, sm: 0.9 } }}>
          <CssBaseline />
          <Box sx={{ mt: 8, alignItems: "center", p: 1, py: 4, }}>
            <Avatar sx={{ width: 56, height: 56, mb: 1 }}>T</Avatar>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              {userInfo.userInfo.name}<br />
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EmailIcon sx={{ mr: 0.5 }} /> {userInfo.userInfo.email}
            </Box>
            <Button variant="contained" sx={{ mt: 1 }} style={{ maxHeight: "30px" }}>Edit Profile</Button>
          </Box>
        </Container>
      </Container>
    </>
  )
}

export default Profile