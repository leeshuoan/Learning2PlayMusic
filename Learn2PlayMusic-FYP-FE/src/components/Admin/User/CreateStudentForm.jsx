import { Button, Grid, TextField, Typography } from "@mui/material";
import { API, Auth } from "aws-amplify";
import * as React from "react";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import Loader from "../../utils/Loader";

export default function CreateStudentForm({ handleClose }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const role = "User";
  const [open, setOpen] = React.useState(false);

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
    setOpen(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get("email");
    var name = data.get("name");

    if (email === "" || name === "" || role === "") {
      console.log("Please fill in all fields");
      toast.error("Please fill in all fields");
      setOpen(false);
      handleClose();
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
        toast.success("User created successfully");
        setOpen(false);
        handleClose();
      }
    } catch (error) {
      setOpen(false);
      console.log(error.message);
      toast.error("Error creating user");
    }
  };
  return (
    <div>
      <form noValidate onSubmit={createNewUser}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center" variant="h4">
              Create new student
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField autoComplete="fname" name="name" variant="outlined" required fullWidth id="name" label="Name" value={name} onChange={handleNameChange} autoFocus />
          </Grid>

          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={email} onChange={handleEmailChange} />
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Create
        </Button>
      </form>
      <Loader open={open} />
    </div>
  );
}
