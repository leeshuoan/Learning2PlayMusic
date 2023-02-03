import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify';
import { useTheme, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, } from "@mui/material";

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

export default function SignIn({ handleSetRole }) {
  const theme = useTheme();
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    Auth.signIn(data.get("email"), data.get("password"))
      .then((user) => {
        console.log(user)
        user.getSession((err, session) => {
          if (err) {
            console.log(err);
          }
          console.log(session.getIdToken().payload);
          if (session.getIdToken().payload["userRole"] == "Admin") {
            handleSetRole("admin");
            navigate("/admin");
            return;
          }
        })
      })
      .catch(err => console.log(err));

    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: theme.shadows[10],
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
              <Link href="#" variant="body2" color="primary.dark">
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
  );
}
