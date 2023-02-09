import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify';
import { toast } from "react-toastify";
import { useTheme, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Backdrop, CircularProgress } from "@mui/material";

export default function ForgotPassword({ handleSetUserInfo }) {
  const theme = useTheme();
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [nextStage, setNextStage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (nextStage) {
      if (data.get("code") == "" || data.get("password") == "") {
        toast.error("Please fill in all fields");
        return;
      }
    } else if (data.get("email") == "") {
      toast.error("Please fill in all fields");
      return;
    }

    if (nextStage) {
      Auth.forgotPasswordSubmit(username, data.get("code"), data.get("password"))
        .then((data) => {
          console.log(data)
          toast.success("Password has been successfully changed");
          navigate("/")
        })
        .catch(err => {
          console.log(err)
          toast.error(err.message);
        });
      return;
    }

    Auth.forgotPassword(data.get("email"))
      .then((res) => {
        console.log(res)
        toast.success("Code has been successfully sent to email");
        setUsername(data.get("email"))
        setNextStage(true)
      })
      .catch(err => {
        if (err.message == "Username/client id combination not found.") {
          toast.error("Email not found");
        } else {
          toast.error(err.message);
        }
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
            alignItems: "center",
            p: 2,
            py: 5,
          }}>
          <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
            Forgot Password
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
              sx={{ display: nextStage ? "none" : "block" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Code"
              name="code"
              autoComplete="code"
              autoFocus
              sx={{ display: nextStage ? "block" : "none" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="New Password"
              type="password"
              autoComplete="new-password"
              sx={{ display: nextStage ? "block" : "none" }}
            />
            <Grid container sx={{ pl: 1, mt: 1, mb: 2 }}>
              <Grid item xs>
                <Link onClick={() => { navigate("/") }} variant="body2" color="primary.dark">
                  Return to Login
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
