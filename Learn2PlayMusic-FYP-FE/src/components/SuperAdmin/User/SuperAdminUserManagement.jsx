import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, Button, Container, IconButton, Switch, Tooltip, Typography } from "@mui/material";
import { API, Auth } from "aws-amplify";
import MaterialReactTable from "material-react-table";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import Loader from "../../utils/Loader";

const TransitionModal = lazy(() => import("../../utils/TransitionModal"));
const CreateUserForm = lazy(() => import("./CreateUserForm"));
const UserPrompt = lazy(() => import("./UserPrompt"));

const SuperAdminUserManagement = (userInfo) => {
  // table data
  const [data, setData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  // loading screen
  const [open, setOpen] = useState(true);
  // create user
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [roles, setRoles] = useState([]);
  // diable user
  const [openDisableUser, setOpenDisableUser] = useState(false);
  const [toDisableUser, setToDisableUser] = useState("");
  // enable user
  const [openEnableUser, setOpenEnableUser] = useState(false);
  const [toEnableUser, setToEnableUser] = useState("");
  // delete user
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [toDeleteUser, setToDeleteUser] = useState("");

  function modalStyle(w) {
    return {
      position: "relative",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: w,
      bgcolor: "background.paper",
      borderRadius: 2,
      p: 4,
    };
  }
  const largeModalWidth = { xs: "90%", sm: "60%", md: "40%", lg: "40%", xl: "40%" };
  const smallModalWidth = { xs: "60%", sm: "40%", md: "30%", lg: "25%", xl: "20%" };

  // list groups ================================================================================================================================================================================================================================================================================
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
      rs.push(groupName.substr(0, groupName.length - 1));
    }
    setRoles(rs);
  };
  // list users ================================================================================================================================================================================================================================================================================

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
    let parsedUserData = [];
    userData.forEach((user) => {
      const userAttributes = user.Attributes.reduce((usr, { Name, Value }) => {
        if (Name.startsWith("custom:")) {
          let k = Name.split(":")[1];
          usr[k.charAt(0).toUpperCase() + k.slice(1)] = Value;
        } else {
          usr[Name] = Value;
        }
        return usr;
      }, {});
      console.log(userAttributes.Role);
      user.Attributes = userAttributes;
      user.Enabled = user.Enabled ? "Enabled" : "Disabled";
      user.UserStatus = user.UserStatus == "FORCE_CHANGE_PASSWORD" ? "Change Password" : "Confirmed";

      let date = new Date(user.UserCreateDate);
      let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      user.UserCreateDate = formattedDate;
      parsedUserData.push(user);
    });
    console.log(parsedUserData);
    setData(parsedUserData);
  };

  // disable user================================================================================================================================================================================================================================================================================
  const openDisableUserModal = async (user) => {
    setOpenDisableUser(true);
    setToDisableUser(user);
  };
  const disableUserSuccessClose = () => {
    setOpenDisableUser(false);
    setReloadData(!reloadData);
  };
  // enable user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const openEnableUserModal = async (user) => {
    setOpenEnableUser(true);
    setToEnableUser(user);
  };
  const enableUserSuccessClose = () => {
    setOpenEnableUser(false);
    setReloadData(!reloadData);
  };
  // delete user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const openDeleteUserModal = async (user) => {
    setOpenDeleteUser(true);
    setToDeleteUser(user);
  };
  const deleteUserSuccessClose = () => {
    setOpenDeleteUser(false);
    setReloadData(!reloadData);
  };
  // created user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const createUserSuccessClose = () => {
    setOpenCreateUser(false);
    setReloadData(!reloadData);
  };
  // useEffect ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  useEffect(() => {
    let start = new Date().getTime();
    Promise.all([listUsers(), listGroups()]).then(() => {
      setOpen(false);
      console.log("time taken to load users: " + (new Date().getTime() - start) / 1000 + "s");
    });

    return () => {};
  }, [reloadData]);

  // table columns ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const columns = useMemo(
    () => [
      {
        accessorKey: "Attributes.Name",
        id: "name",
        header: "Name",
        minSize: 100,
      },
      {
        accessorKey: "Attributes.email",
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
        Cell: ({ cell, row }) =>
          row.original.Attributes.Role != "SuperAdmin" ? (
            <Tooltip title={row.original.Enabled == "Disabled" ? "Enable user" : "Disable user"} placement="bottom">
              <Switch
                color="success"
                checked={row.original.Enabled == "Enabled"}
                onChange={(event) => {
                  if (event.target.checked) {
                    openEnableUserModal(row.original);
                  } else {
                    openDisableUserModal(row.original);
                  }
                }}></Switch>
            </Tooltip>
          ) : null,
      },
      {
        accessorKey: "",
        id: "delete",
        header: "Delete",
        Cell: ({ cell, row }) =>
          row.original.Attributes.Role != "SuperAdmin" ? (
            <Tooltip title="Delete user forever" placement="bottom">
              <span>
                <IconButton
                  variant="contained"
                  color="error"
                  disabled={row.original.Enabled == "Enabled" ? true : false}
                  onClick={() => {
                    openDeleteUserModal(row.original);
                  }}>
                  <DeleteForeverIcon />
                </IconButton>
              </span>
            </Tooltip>
          ) : null,
        maxSize: 20,
      },
    ],
    []
  );
  // end table columns ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Suspense fallback={<Loader open={open} />}>
        <Box m={2}>
          {/* create user ========================================================================================== */}
          <TransitionModal open={openCreateUser} handleClose={() => setOpenCreateUser(false)} style={modalStyle(largeModalWidth)}>
            <CreateUserForm roles={roles} handleClose={() => createUserSuccessClose()} />
          </TransitionModal>

          {/* delete user ========================================================================================== */}
          <TransitionModal open={openDeleteUser} handleClose={() => setOpenDeleteUser(false)} style={modalStyle(smallModalWidth)}>
            <UserPrompt type="Delete" selectedUser={toDeleteUser} handleClose={() => deleteUserSuccessClose()} />
          </TransitionModal>
          {/* enable user ========================================================================================== */}
          <TransitionModal open={openEnableUser} handleClose={() => setOpenEnableUser(false)} style={modalStyle(smallModalWidth)}>
            <UserPrompt type="Enable" selectedUser={toEnableUser} handleClose={() => enableUserSuccessClose()} />
          </TransitionModal>
          {/* disable user ========================================================================================== */}
          <TransitionModal open={openDisableUser} handleClose={() => setOpenDisableUser(false)} style={modalStyle(smallModalWidth)}>
            <UserPrompt type="Disable" selectedUser={toDisableUser} handleClose={() => disableUserSuccessClose()} />
          </TransitionModal>

          {/* main ========================================================================================== */}
          <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
            User Management
          </Typography>
          <MaterialReactTable
            enableHiding={false}
            enableFullScreenToggle={false}
            positionToolbarAlertBanner="bottom"
            enableDensityToggle={false}
            columns={columns}
            data={data}
            initialState={{
              density: "compact",
              sorting: [
                { id: "role", desc: false },
                { id: "name", desc: false },
              ],
            }}
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
            }}></MaterialReactTable>
          {/* foot note ==========================================================================================*/}
          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            <b>NOTE:</b>
          </Typography>
          <Typography variant="body2">
            1. User must be disabled before they can be deleted forever.
            <br />
            2. You cannot enable/disable yourself.
          </Typography>
        </Box>
        <Loader open={open} />
      </Suspense>
    </Container>
  );
};

export default SuperAdminUserManagement;
