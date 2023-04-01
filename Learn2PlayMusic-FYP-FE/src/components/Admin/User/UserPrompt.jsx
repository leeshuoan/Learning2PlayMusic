import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { API, Auth } from "aws-amplify";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "../../utils/Loader";

export default function UserPrompt({ selectedUser, handleClose, type }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  // delete user
  const confirmDeleteUser = async () => {
    setOpen(true);
    let apiName = "AdminQueries";
    let path = "/deleteUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: selectedUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    if (success.message) {
      toast.success("User deleted successfully");
      setOpen(false);
      handleClose();
    }
  };
  // enable user
  const confirmEnableUser = async () => {
    setOpen(true);
    let apiName = "AdminQueries";
    let path = "/enableUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: selectedUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    console.log(success);
    if (success.message) {
      toast.success("User enabled successfully");
      setOpen;
      handleClose();
    }
  };
  // disable user

  const confirmDisableUser = async () => {
    setOpen(true);
    let apiName = "AdminQueries";
    let path = "/disableUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: selectedUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    if (success.message) {
      toast.success("User disabled successfully");
      setOpen;
      handleClose();
    }
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            {type} User?
          </Typography>
          {type == "Delete" ? (
            <Typography align="center" color="error" variant="subtitle1">
              Warning: This action cannot be undone.
            </Typography>
          ) : (
            ""
          )}
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
          <Box>
            <b>Name:</b> {selectedUser && selectedUser.Attributes.Name}
          </Box>
          <Box>
            <b>Email:</b> {selectedUser && selectedUser.Attributes.email}
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
            onClick={() => {
              handleClose();
            }}>
            Cancel
          </Button>
          {type == "Delete" ? (
            <Button variant="contained" sx={{ mr: 1 }} color="error" onClick={() => confirmDeleteUser()}>
              {type}
            </Button>
          ) : type == "Enable" ? (
            <Button variant="contained" sx={{ mr: 1, color: "black" }} color="success" onClick={() => confirmEnableUser()}>
              {type}
            </Button>
          ) : (
            <Button variant="contained" sx={{ mr: 1 }} color="error" onClick={() => confirmDisableUser()}>
              {type}
            </Button>
          )}
        </Grid>
      </Grid>
      <Loader open={open} />
    </>
  );
}
