import { useMemo, useState, useEffect } from "react";
import { useTheme, Box, Button, Typography, Grid } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Auth, API } from "aws-amplify";
import CreateUserForm from "./CreateUserForm";
import TransitionModal from "../utils/TransitionModal";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const AdminUserManagement = () => {
  const theme = useTheme()
  const [data, setData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openDisableUser, setOpenDisableUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [roles, setRoles] = useState([]);

  // list groups
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
    };
    let groups = await API.get(apiName, path, myInit);
    var rs = [];
    for (let idx in groups.Groups) {
      rs.push(groups.Groups[idx].GroupName);
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
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    let users = await API.get(apiName, path, myInit);
    let userData = users.Users;

    for (let idx in userData) {
      for (let attributeIdx in userData[idx]["Attributes"]) {
        if (userData[idx]["Attributes"][attributeIdx]["Name"] == "email") {
          userData[idx]["Attributes"].Email =
            userData[idx]["Attributes"][attributeIdx]["Value"];
        } else if (
          userData[idx]["Attributes"][attributeIdx]["Name"] == "custom:name"
        ) {
          userData[idx]["Attributes"].Name =
            userData[idx]["Attributes"][attributeIdx]["Value"];
        } else if (
          userData[idx]["Attributes"][attributeIdx]["Name"] == "custom:role"
        ) {
          userData[idx]["Attributes"].Role =
            userData[idx]["Attributes"][attributeIdx]["Value"];
        }
      }
      userData[idx]["Enabled"] = userData[idx]["Enabled"] ? "Enabled" : "Disabled";

      let date = new Date(userData[idx]["UserCreateDate"]);
      let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      userData[idx]["UserCreateDate"] = formattedDate;
    }
    setData(userData);
  };

  const disableUser = async (user) => {
    setOpenDisableUser(true)
    setSelectedUser(user)
    console.log(selectedUser)
  }

  const confirmDisableUser = async () => {
    let apiName = "AdminQueries";
    let path = "/disableUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
      body: {
        username: selectedUser.Username,
      }
    };
    let success = await API.post(apiName, path, myInit);
    console.log(success)
    if (success.message) {
      toast.success("User disabled successfully", {
        position: toast.POSITION.TOP_CENTER,
      })
      setReloadData(!reloadData)
      setOpenDisableUser(false)
    }
  }

  const createdUser = () => {
    setOpenCreateUser(false);
    setReloadData(!reloadData);
  };

  useEffect(() => {
    listUsers();
    listGroups();
    console.log(data);
    return () => { };
  }, [reloadData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "Attributes.Email",
        id: "email",
        header: "Email",
      },
      {
        accessorKey: "Attributes.Name",
        id: "name",
        header: "Name",
      },
      {
        accessorKey: "UserCreateDate",
        id: "createDate",
        header: "Creation Date",
      },
      {
        accessorKey: "Attributes.Role",
        id: "role",
        header: "Role",
      },
      {
        accessorKey: "Enabled",
        id: "enabled",
        header: "Enabled",
      },
      {
        accessorKey: "",
        id: "actions",
        header: "Actions",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
            <Button variant="contained">Enroll</Button>
            <Button variant="contained" onClick={() => { disableUser(row.original) }}>Disable</Button>
            <Button variant="contained">Delete</Button>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box m={2}>
      <TransitionModal
        open={openCreateUser}
        handleClose={() => setOpenCreateUser(false)}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          bgcolor: "background.paper",
          border: "1px solid #000",
          borderRadius: 2,
          p: 4,
        }}>
        {<CreateUserForm roles={roles} handleClose={() => createdUser()} />}
      </TransitionModal>
      <TransitionModal
        open={openDisableUser}
        handleClose={() => setOpenDisableUser(false)}
        style={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          border: "1px solid #000",
          borderRadius: 2,
          p: 4,
        }}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <CloseIcon sx={{ "&:hover": { cursor: "pointer" } }} onClick={() => { setOpenDisableUser(false) }} />
            </Grid>
            <Grid item xs={10}>
              <Typography align="center" variant="h5">
                Disable User?
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", flexDirection:  "column" }}>
              <Box>Name: {selectedUser && selectedUser.Attributes.Name}</Box>
              <Box>Email: {selectedUser && selectedUser.Attributes.Email}</Box>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmDisableUser()}>Disable</Button>
              <Button variant="contained" sx={{ backgroundColor: "lightgrey", color: 'black', boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }} onClick={() => { setOpenDisableUser(false) }}>Cancel</Button>
            </Grid>
          </Grid>
        </>
      </TransitionModal>
      <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
        User Management
      </Typography>
      <MaterialReactTable
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
              <Button variant="contained" onClick={() => { setOpenCreateUser(true) }}>
                Add User
              </Button>
            </Box>
          );
        }}></MaterialReactTable>
    </Box>
  );
};

export default AdminUserManagement;
