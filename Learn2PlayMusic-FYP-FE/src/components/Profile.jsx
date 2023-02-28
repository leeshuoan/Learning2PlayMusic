import { useState, useEffect } from 'react'
import { useTheme, Container, Typography, Box, Avatar, CssBaseline, Button, TextField } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email';
import { Auth } from 'aws-amplify'

const Profile = (userInfo) => {
  const theme = useTheme()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(userInfo.userInfo.name || "")
  
  useEffect(() => {
    setName(userInfo.userInfo.name || "")
  }, [userInfo.userInfo.name])

  const editUser = () => {
    setEdit(true)
  }

  async function updateUser() {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, {
      'address': '105 Main St. New York, NY 10001'
    });
  }

  console.log(userInfo)
  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Container component="main" maxWidth="xs" sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: theme.shadows[10], width: { xs: 1, sm: 0.9 } }}>
          <CssBaseline />
          <Box sx={{ mt: 8, alignItems: "center", p: 1, py: 4, display: edit ? "none" : "block" }}>
            <Avatar sx={{ width: 56, height: 56, mb: 1 }}>T</Avatar>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              {userInfo.userInfo.name}<br />
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EmailIcon sx={{ mr: 0.5 }} /> {userInfo.userInfo.email}
            </Box>
            <Button variant="contained" sx={{ mt: 2 }} style={{ maxHeight: "30px" }} onClick={() => editUser()}>Edit Profile</Button>
          </Box>

          <Box sx={{ mt: 8, alignItems: "center", p: 1, py: 4, display: edit ? "block" : "none" }}>
            <Avatar sx={{ width: 56, height: 56, mb: 1 }}>T</Avatar>
            <Typography variant='subtitle1' sx={{ mb: 2 }}>
              Name
              <TextField fullWidth size="small" value={name} onChange={(newVal) => {setName(newVal.target.value)}}>
              </TextField>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ mr: 0.5 }} />
                {userInfo.userInfo.email}
            </Box>
            <Button variant="contained" sx={{ mr: 1 }} style={{ maxHeight: "30px" }} onClick={() => editUser()}>Save</Button>
            <Button variant="contained" sx={{ backgroundColor: "lightgrey", color: 'black', boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }} style={{ maxHeight: "30px" }} onClick={() => {setEdit(false)}}>Cancel</Button>
          </Box>
        </Container>
      </Container>
    </>
  )
}

export default Profile