import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify';
import { toast } from "react-toastify";
import { useTheme, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Backdrop, CircularProgress } from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {"Copyright © "}
      <Link color="inherit" href="#">
        Learn 2 Play Music Learning Management System
      </Link>{" "}
      {"."}
    </Typography>
  );
}

export default function SignIn({ handleSetUserInfo }) {
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
          let userRole = session.getIdToken().payload["userRole"];
          console.log(userRole)
          let userInfo = {
            "name": session.getIdToken().payload["name"],
            "role": userRole
          }
          handleSetUserInfo(userInfo);

          if (Object.keys(routes).includes(userRole)) {
            navigate(routes[userRole]);
            return;
          }

        })
      })
      .catch(err => {
        toast.error(err.message);
      });
  }

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          width: { xs: 1, sm: 0.9 }
        }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            py: 5
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
                <Link onClick={() => {navigate("resetpassword")}} variant="body2" color="primary.dark">
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
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
