import { useMemo, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Auth, API } from "aws-amplify";
import CreateUserForm from "./CreateUserForm";
import TransitionModal from "../utils/TransitionModal";

const AdminUserManagement = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

      let date = new Date(userData[idx]["UserCreateDate"]);
      let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      userData[idx]["UserCreateDate"] = formattedDate;
    }
    setData(userData);
  };

  useEffect(() => {
    listUsers();
    console.log(data);
    return () => {};
  }, []);

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
        open={open}
        handleClose={handleClose}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}>
        {<CreateUserForm handleClose={handleClose} />}
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
              <Button variant="contained" onClick={handleOpen}>
                Add User
              </Button>
            </Box>
          );
        }}></MaterialReactTable>
    </Box>
  );
};

export default AdminUserManagement;
