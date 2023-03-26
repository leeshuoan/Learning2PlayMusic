import CloseIcon from "@mui/icons-material/Close";
import { Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { API, Auth } from "aws-amplify";
import * as React from "react";
import { toast } from "react-toastify";
import uuid from "react-uuid";

export default function CreateUserForm({ roles, handleClose }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const createNewUser = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get("email");
    var name = data.get("name");
    var role = data.get("role");

    if (email === "" || name === "" || role === "") {
      console.log("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    var password = uuid(); //  randomly generate cause will immediately call for reset password
    let apiName = "AdminQueries";
    let path = "/createUser";
    let myInit = {
      queryStringParameters: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: email,
        password: password,
        email: email,
        name: name,
        role: role,
      },
    };
    console.log(myInit);
    try {
      let success = await API.post(apiName, path, myInit);
      if (success.message) {
        toast.success("User created successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        handleClose();
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error creating user");
    }
  };
  return (
    <div>
      <form noValidate onSubmit={createNewUser}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <CloseIcon sx={{ "&:hover": { cursor: "pointer" } }} onClick={() => handleClose()} />
          </Grid>
          <Grid item xs={10}>
            <Typography align="center" variant="h4">
              Create new user
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField autoComplete="fname" name="name" variant="outlined" required fullWidth id="name" label="Name" value={name} onChange={handleNameChange} autoFocus />
          </Grid>

          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={email} onChange={handleEmailChange} />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="roleLabel">Role</InputLabel>
            <Select labelId="roleLabel" id="role" name="role" value={role} onChange={handleRoleChange} fullWidth>
              {roles.map((r) =>
                r === "Student" ? (
                  <MenuItem key={"User"} value={"User"}>
                    {"Student"}
                  </MenuItem>
                ) : (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                )
              )}
            </Select>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Create
        </Button>
      </form>
    </div>
  );
}
