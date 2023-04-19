import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { API, Auth } from "aws-amplify";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";

export default function UserPrompt({ selectedUser, handleClose, type }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
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
          {type == "Enable" ? (
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
