import { useState, useEffect } from 'react'
import { useTheme, Container, Typography, Box, Avatar, CssBaseline, Button, TextField, Badge, Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import { Auth, Storage } from 'aws-amplify'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Profile = (userInfo) => {
  const theme = useTheme()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(userInfo.userInfo.name || "")
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const navigate = useNavigate()

  console.log(userInfo)
  const back = () => {
    if (userInfo.userInfo.role == "Teacher")
      navigate('/teacher')
    else if (userInfo.userInfo.role == "Admin")
      navigate('/admin')
    else
      navigate('/home')
    return;
  }

  useEffect(() => {
    setName(userInfo.userInfo.name || "")
    console.log(userInfo.userInfo.profileImage)
    if (userInfo.userInfo.profileImage != "none") {
      Storage.get(userInfo.userInfo.profileImage, { level: "protected" }).then((res) => {
        setImage(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [userInfo.userInfo.name])

  const fileUploaded = (e) => {
    const newImage = e.target.files[0]
    setFile(newImage)
    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
  }

  const editUser = () => {
    setEdit(false)
    Storage.put(file.name, file, {
      level: "protected",
      contentType: file.type,
    }).then((res) => {
      Auth.currentAuthenticatedUser().then((user) => {
        return Auth.updateUserAttributes(user, {
          'custom:profileImage': res.key
        }).then((res) => {
          console.log(res)
          userInfo.refreshUserInfo()
        }).catch((err) => {
          console.log(err)
        })
      })
      toast.success("Profile updated successfully")
    }).catch((err) => {
      console.log(err)
    })


  }

  console.log(userInfo)
  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
          <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={back}>
            <HomeIcon sx={{ mr: 0.5 }} />
            Home
          </Link>
          <Typography color="text.primary">Profile</Typography>
        </Breadcrumbs>
        <Container component="main" maxWidth="xs" sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: theme.shadows[10], width: { xs: 1, sm: 0.9 } }}>
          <CssBaseline />
          <Box sx={{ mt: 4, alignItems: "center", p: 1, py: 4, display: edit ? "none" : "block" }}>
            <Avatar sx={{ width: 80, height: 80, mb: 1 }} src={image}></Avatar>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              {userInfo.userInfo.name}<br />
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EmailIcon sx={{ mr: 0.5 }} /> {userInfo.userInfo.email}
            </Box>
            <Button variant="contained" sx={{ mt: 2 }} style={{ maxHeight: "30px" }} onClick={() => { setEdit(true) }}>Edit Profile</Button>
          </Box>

          <Box sx={{ mt: 4, alignItems: "center", p: 1, py: 4, display: edit ? "block" : "none" }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{ cursor: "pointer" }}
              // onClick={}
              badgeContent={
                <Box sx={{ background: theme.palette.background.paper, borderRadius: "3px", px: 0.5, boxShadow: theme.shadows[3], display: "flex", alignItems: "center" }}>
                  <EditIcon fontSize='8px' sx={{ mr: 0.5 }} />
                  <Typography variant='subsubtitle'>Edit</Typography>
                </Box>
              }
              component="label"
            >
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={fileUploaded}
              />
              <Avatar sx={{ width: 80, height: 80, mb: 1 }} src={image}></Avatar>
            </Badge>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              {userInfo.userInfo.name}<br />
            </Typography>
            {/* <Typography variant='subtitle1' sx={{ mb: 2 }}>
              Name
              <TextField fullWidth size="small" value={name} onChange={(newVal) => {setName(newVal.target.value)}}>
              </TextField>
            </Typography> */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ mr: 0.5 }} />
              {userInfo.userInfo.email}
            </Box>
            <Button variant="contained" sx={{ mr: 1 }} style={{ maxHeight: "30px" }} onClick={() => editUser()}>Save</Button>
            <Button variant="contained" sx={{ backgroundColor: "lightgrey", color: 'black', boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }} style={{ maxHeight: "30px" }} onClick={() => { setEdit(false) }}>Cancel</Button>
          </Box>
        </Container>
      </Container>
    </>
  )
}

export default Profile