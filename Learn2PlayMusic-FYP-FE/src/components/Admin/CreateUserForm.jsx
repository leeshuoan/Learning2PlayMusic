import * as React from "react";
import {
  Typography,
  Button,
  Grid,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Auth, API } from "aws-amplify";
import uuid from "react-uuid";

export default function CreateUserForm({ handleClose }) {
  const USERPOOLID = "ap-southeast-1_WMzch8no8";
  // const ROLES = ["Student", "Teacher", "Admin", "SuperAdmin"]; // change with roles from API "ListGroups"
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [roles, setRoles] = React.useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const listGroups = async () => {
    let apiName = "AdminQueries";
    let path = "/listGroups";
    let myInit = {
      queryStringParameters: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
      body: {
        userPoolId: USERPOOLID,
      },
    };
    let groups = await API.get(apiName, path, myInit);
    var roles = [];
    for (let idx in groups.Groups) {
      roles = [...roles, groups.Groups[idx].GroupName];
    }

    setRoles(roles);
    console.log(roles);
  };

  const createNewUser = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get("email");
    var name = data.get("name");
    var role = data.get("role");

    if (email === "" || name === "" || role === "") {
      console.log("Please fill in all fields");
      return;
    }

    var username = uuid();
    var password = uuid(); //  randomly generate cause will immediately call for reset password
    let apiName = "AdminQueries";
    let path = "/createUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
      body: {
        userPoolId: USERPOOLID,
        username: username,
        password: password,
        email: email,
        name: name,
        role: role,
      },
    };
    console.log(myInit);
    try {
      let users = await API.post(apiName, path, myInit);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    listGroups();
  }, []);

  return (
    <div>
      <form noValidate onSubmit={createNewUser}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <CloseIcon onClick={() => handleClose()} />
          </Grid>
          <Grid item xs={10}>
            <Typography align="center" variant="h4">
              <b>Create new user</b>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="fname"
              name="name"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Name"
              value={name}
              onChange={handleNameChange}
              autoFocus
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="roleLabel">Role</InputLabel>
            <Select
              labelId="roleLabel"
              id="role"
              name="role"
              value={role}
              onChange={handleRoleChange}
              fullWidth>
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
          Sign Up
        </Button>
      </form>
    </div>
  );
}
