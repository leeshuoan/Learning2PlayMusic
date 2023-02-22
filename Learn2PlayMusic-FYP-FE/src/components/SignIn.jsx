import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify';
import { toast } from "react-toastify";
import { useTheme, Card, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Backdrop, CircularProgress } from "@mui/material";
import homebg from '../assets/homebg.png'

export default function SignIn({ userInfo, handleSetUserInfo }) {
  const theme = useTheme();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const routes = {
    Admin: "/admin",
    Teacher: "/teacher",
    User: "/home",
  }

  if (userInfo.role == 'Admin') {
    navigate(routes[userInfo.role])
  } else if (userInfo.role == 'Teacher') {
    navigate(routes[userInfo.role])
  } else if (userInfo.role == 'User') {
    navigate(routes[userInfo.role])
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleToggle();
    const data = new FormData(event.currentTarget);

    if (data.get("email") == "" || data.get("password") == "") {
      toast.error("Please fill in all fields");
      return;
    }

    Auth.signIn(data.get("email"), data.get("password"))
      .then((user) => {
        console.log(user)
        user.getSession((err, session) => {
          if (err) {
            console.log(err);
          }

          let groups = session.getIdToken().payload["cognito:groups"];
          let userRole = null
          if (groups.includes("Admins")) {
            userRole = "Admin";
          } else if (groups.includes("Teachers")) {
            userRole = "Teacher";
          } else if (groups.includes("Users")) {
            userRole = "User";
          }

          if (userRole != null) {
            let userInfo = {
              name: session.getIdToken().payload["custom:name"],
              role: userRole,
            };
            handleSetUserInfo(userInfo);
          }

          if (Object.keys(routes).includes(userRole)) {
            navigate(routes[userRole]);
            return;
          }

        })
      })
      .catch(err => {
        toast.error(err.message);
        handleClose();
      });
  }

  return (
    <div style={{ background: `linear-gradient(45deg, rgba(76,204,212,0.3) 0%, rgba(120,194,236,1) 50%, rgba(76,204,212,0.303046218487395) 100%)`, height: '100vh' }}> 
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Grid container justifyContent="flex-end">
          <Grid item xs={12} md={8}  sx={{ mt: 15, pr: 10, display: {xs: "none", md: "block"} }}>
            <Typography variant="h3" color="white" sx={{textAlign: { xs: 'center', sm: 'left'} }}>Learn2Play Beyond Classroom</Typography>
            <Typography variant="body1" color="white" sx={{textAlign: { xs: 'center', sm: 'left'} }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut distinctio fuga officia incidunt doloribus sed asperiores vitae dignissimos perspiciatis animi eaque, necessitatibus placeat laboriosam harum minima voluptate enim rem saepe.</Typography>
            <img src={homebg} alt="" />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 15 }}>
            <Card variant='contained'>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 5,
                }}>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}
                  onSubmit={handleSubmit}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <Grid container sx={{ pl: 1, mt: 1, mb: 2 }}>
                    <Grid item xs>
                      <Link onClick={() => { navigate("resetpassword") }} variant="body2" color="primary.dark">
                        Forgot password?
                      </Link>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained">
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </div>
  );
}
