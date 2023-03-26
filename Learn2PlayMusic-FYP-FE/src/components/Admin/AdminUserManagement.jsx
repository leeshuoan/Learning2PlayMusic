import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Backdrop, Box, Button, CircularProgress, Grid, IconButton, Switch, Tooltip, Typography, useTheme } from "@mui/material";
import { API, Auth } from "aws-amplify";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TransitionModal from "../utils/TransitionModal";
import CreateUserForm from "./CreateUserForm";

const AdminUserManagement = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [open, setOpen] = useState(true);
  const [openEnrolUser, setOpenEnrolUser] = useState(false);
  const [toEnrolUser, setToEnrolUser] = useState("");
  const [toEnrolCourse, setToEnrolCourse] = useState("");
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openDisableUser, setOpenDisableUser] = useState(false);
  const [openEnableUser, setOpenEnableUser] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [toDisableUser, setToDisableUser] = useState("");
  const [toEnableUser, setToEnableUser] = useState("");
  const [toDeleteUser, setToDeleteUser] = useState("");
  const [roles, setRoles] = useState([]);

  const modalStyle = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderRadius: 2,
    p: 4,
  };
  // list groups
  const listGroups = async () => {
    let apiName = "AdminQueries";
    let path = "/listGroups";
    let myInit = {
      queryStringParameters: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
    };
    let groups = await API.get(apiName, path, myInit);
    var rs = [];
    for (let idx in groups.Groups) {
      let groupName = groups.Groups[idx].GroupName;
      console.log(groupName);
      rs.push(groupName.substr(0, groupName.length - 1));
    }
    setRoles(rs);
    console.log(rs);
  };

  const listUsers = async () => {
    let apiName = "AdminQueries";
    let path = "/listUsers";
    let myInit = {
      queryStringParameters: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
    };
    let users = await API.get(apiName, path, myInit);
    let userData = users.Users;

    for (let idx in userData) {
      for (let attributeIdx in userData[idx]["Attributes"]) {
        if (userData[idx]["Attributes"][attributeIdx]["Name"] == "email") {
          userData[idx]["Attributes"].Email = userData[idx]["Attributes"][attributeIdx]["Value"];
        } else if (userData[idx]["Attributes"][attributeIdx]["Name"] == "custom:name") {
          userData[idx]["Attributes"].Name = userData[idx]["Attributes"][attributeIdx]["Value"];
        } else if (userData[idx]["Attributes"][attributeIdx]["Name"] == "custom:role") {
          userData[idx]["Attributes"].Role = userData[idx]["Attributes"][attributeIdx]["Value"];
        }
      }
      userData[idx]["Enabled"] = userData[idx]["Enabled"] ? "Enabled" : "Disabled";
      userData[idx]["UserStatus"] = userData[idx]["UserStatus"] == "FORCE_CHANGE_PASSWORD" ? "Change Password" : "Confirmed";

      let date = new Date(userData[idx]["UserCreateDate"]);
      let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      userData[idx]["UserCreateDate"] = formattedDate;
    }
    console.log(userData);
    setData(userData);
  };

  const enrolUser = async (user) => {
    setOpenEnrolUser(true);
    setToEnrolUser(user);
    console.log(toEnrolUser.Attributes);
  };

  const confirmEnrolUser = async () => {
    let endpoint = `${import.meta.env.VITE_API_URL}//user/student/course?courseId=1&userId=1`;
    let myInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let response = await fetch(endpoint, myInit);
    if (response.ok) {
      toast.success("User enrolled successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setReloadData(!reloadData);
      setOpenEnrolUser(false);
    }
  };

  const disableUser = async (user) => {
    setOpenDisableUser(true);
    setToDisableUser(user);
    console.log(toDisableUser);
  };

  const confirmDisableUser = async () => {
    let apiName = "AdminQueries";
    let path = "/disableUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: toDisableUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    console.log(success);
    if (success.message) {
      toast.success("User disabled successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setReloadData(!reloadData);
      setOpenDisableUser(false);
    }
  };

  const enableUser = async (user) => {
    setOpenEnableUser(true);
    setToEnableUser(user);
    console.log(toEnableUser);
  };

  const confirmEnableUser = async () => {
    let apiName = "AdminQueries";
    let path = "/enableUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: toEnableUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    console.log(success);
    if (success.message) {
      toast.success("User enabled successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setReloadData(!reloadData);
      setOpenEnableUser(false);
    }
  };

  const deleteUser = async (user) => {
    setOpenDeleteUser(true);
    setToDeleteUser(user);
  };

  const confirmDeleteUser = async () => {
    let apiName = "AdminQueries";
    let path = "/deleteUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: toDeleteUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    if (success.message) {
      toast.success("User deleted successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setReloadData(!reloadData);
      setOpenDeleteUser(false);
    }
  };

  const createdUser = () => {
    setOpenCreateUser(false);
    setReloadData(!reloadData);
  };

  useEffect(() => {
    listUsers();
    listGroups();
    setOpen(false);
    return () => {};
  }, [reloadData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "Attributes.Name",
        id: "name",
        header: "Name",
        minSize: 100,
      },
      {
        accessorKey: "Attributes.Email",
        id: "email",
        header: "Email",
        minSize: 100,
      },
      {
        accessorKey: "Attributes.Role",
        id: "role",
        header: "Role",
        size: 30,
      },
      {
        accessorKey: "Enabled",
        id: "enabled",
        header: "Enabled",
        maxSize: 20,
        Cell: ({ cell, row }) => (
          <Tooltip title={row.original.Enabled == "Disabled" ? "Enable user" : "Disable user"} placement="bottom">
            <Switch
              color="success"
              checked={row.original.Enabled == "Enabled"}
              onChange={(event) => {
                if (event.target.checked) {
                  enableUser(row.original);
                } else {
                  disableUser(row.original);
                }
              }}></Switch>
          </Tooltip>
        ),
      },
      {
        accessorKey: "",
        id: "enrol",
        header: "Enrol",
        Cell: ({ cell, row }) =>
          row.original.Attributes.Role != "Admin" ? (
            <Tooltip title="Enrol user to course" placement="bottom">
              <IconButton
                variant="contained"
                color="info"
                disabled={row.original.Enabled == "Enabled" ? false : true}
                onClick={() => {
                  enrolUser(row.original);
                }}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          ) : null,
        maxSize: 20,
      },
      {
        accessorKey: "",
        id: "delete",
        header: "Delete",
        Cell: ({ cell, row }) => (
          <Tooltip title="Delete user forever" placement="bottom">
            <IconButton
              variant="contained"
              color="error"
              disabled={row.original.Enabled == "Enabled" ? true : false}
              onClick={() => {
                deleteUser(row.original);
              }}>
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
        ),
        maxSize: 20,
      },
    ],
    []
  );

  return (
    <Box m={2}>
      <TransitionModal open={openCreateUser} handleClose={() => setOpenCreateUser(false)} style={modalStyle}>
        {<CreateUserForm roles={roles} handleClose={() => createdUser()} />}
      </TransitionModal>
      <TransitionModal open={openDeleteUser} handleClose={() => setOpenDeleteUser(false)} style={modalStyle}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <CloseIcon
                sx={{ "&:hover": { cursor: "pointer" } }}
                onClick={() => {
                  setOpenDeleteUser(false);
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Typography align="center" variant="h5">
                Delete User?
              </Typography>
              <Typography align="center" color="error" variant="subtitle1">
                Warning: This action cannot be undone.
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <Box>Name: {toDeleteUser && toDeleteUser.Attributes.Name}</Box>
              <Box>Email: {toDeleteUser && toDeleteUser.Attributes.Email}</Box>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmDeleteUser()}>
                Delete
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                onClick={() => {
                  setOpenDeleteUser(false);
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </>
      </TransitionModal>
      <TransitionModal open={openEnableUser} handleClose={() => setOpenEnableUser(false)} style={modalStyle}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <CloseIcon
                sx={{ "&:hover": { cursor: "pointer" } }}
                onClick={() => {
                  setOpenEnableUser(false);
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Typography align="center" variant="h5">
                Enable User?
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <Box>Name: {toEnableUser && toEnableUser.Attributes.Name}</Box>
              <Box>Email: {toEnableUser && toEnableUser.Attributes.Email}</Box>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmEnableUser()}>
                Enable
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                onClick={() => {
                  setOpenEnableUser(false);
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </>
      </TransitionModal>
      <TransitionModal open={openDisableUser} handleClose={() => setOpenDisableUser(false)} style={modalStyle}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <CloseIcon
                sx={{ "&:hover": { cursor: "pointer" } }}
                onClick={() => {
                  setOpenDisableUser(false);
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Typography align="center" variant="h5">
                Disable User?
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <Box>Name: {toDisableUser && toDisableUser.Attributes.Name}</Box>
              <Box>Email: {toDisableUser && toDisableUser.Attributes.Email}</Box>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmDisableUser()}>
                Disable
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                onClick={() => {
                  setOpenDisableUser(false);
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </>
      </TransitionModal>
      <TransitionModal open={openEnrolUser} handleClose={() => setOpenEnrolUser(false)} style={modalStyle}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <CloseIcon
                sx={{ "&:hover": { cursor: "pointer" } }}
                onClick={() => {
                  setOpenEnrolUser(false);
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Typography align="center" variant="h5">
                Enrol User?
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <Box>Name: {toEnrolUser && toEnrolUser.Attributes.Name}</Box>
              <Box>Email: {toEnrolUser && toEnrolUser.Attributes.Email}</Box>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              {/* <Autocomplete
                disablePortal
                name="course"
                id="course"
                options={courses}
                isOptionEqualToValue={(option, value) => option.teacherId === value.teacherId}
                getOptionLabel={(option) => option.teacherName}
                renderInput={(params) => <TextField {...params} label="Teacher *" />}
                onChange={(event, newValue) => {
                  setSelectedTeacher(newValue);
                }}
              /> */}
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmEnrolUser()}>
                Enrol
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                onClick={() => {
                  setOpenEnrolUser(false);
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </>
      </TransitionModal>
      <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
        User Management
      </Typography>
      <MaterialReactTable
        enableHiding={false}
        enableFullScreenToggle={false}
        enableMultiRowSelection={true}
        enableRowSelection={true}
        enableDensityToggle={false}
        columns={columns}
        data={data}
        initialState={{ density: "compact" }}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenCreateUser(true);
                }}>
                Add User
              </Button>
            </Box>
          );
        }}
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: "grid",
              margin: "auto",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}>
            <Typography variant="body2">
              <b>User Creation Date:</b> {row.original.UserCreateDate}
            </Typography>
            <Typography variant="body2">
              <b>User Status:</b> {row.original.UserStatus}
            </Typography>
          </Box>
        )}></MaterialReactTable>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AdminUserManagement;
