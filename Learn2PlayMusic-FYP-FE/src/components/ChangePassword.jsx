import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from 'aws-amplify';
import { toast } from "react-toastify";
import { useTheme, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Backdrop, CircularProgress } from "@mui/material";

export default function ChangePassword() {
  const theme = useTheme();
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("email") == "" || data.get("current-password") == "" || data.get("new-password") == "" || data.get("confirm-password") == "") {
      toast.error("Please fill in all fields");
      return;
    }

    if (data.get("new-password") != data.get("confirm-password")) {
      toast.error("Passwords do not match");
      return;
    }

    Auth.signIn(data.get("email"), data.get("current-password"))
      .then((user) => {
        console.log(user)
        Auth.completeNewPassword(user, data.get("new-password"))
          .then((user) => {
            toast.success("Password changed successfully");
            const role = user.challengeParam.userAttributes["custom:role"]
            console.log(role)
            navigate("/");
          }).catch((err) => {
            toast.error(err.message);
            console.log(err)
          })
      }).catch((err) => {
        toast.error(err.message);
        console.log(err)
      })
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
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
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Please change your password
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
                id="current-password"
                name="current-password"
                label="Current Password"
                type="password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="new-password"
                name="new-password"
                label="New Password"
                type="password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirm-password"
                name="confirm-password"
                label="Confirm New Password"
                type="password"
              />
              <Button
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
                variant="contained">
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </Container>
    </>
  );
}
