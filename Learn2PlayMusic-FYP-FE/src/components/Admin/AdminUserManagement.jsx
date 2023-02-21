import { useMemo, useState, useEffect } from 'react'
import { Box, Button, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Auth, API } from 'aws-amplify';

const AdminUserManagement = () => {
  const [data, setData] = useState([]);

  async function listUsers () {
    let apiName = 'AdminQueries';
    let path = '/listUsers';
    let myInit = {
      queryStringParameters: {
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    let users = await API.get(apiName, path, myInit);
    setData(users)
  }

  useEffect(() => {
    listUsers()
    console.log(data)
    return () => {
    }
  }, [])
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "",
        id: "userId",
        header: "User ID",
      },
      {
        accessorKey: "",
        id: "name",
        header: "Name",
      },
      {
        accessorKey: "",
        id: "createDate",
        header: "Creation Date",
      },
      {
        accessorKey: "",
        id: "role",
        header: "Role",
      },
      {
        accessorKey: "",
        id: "actions",
        header: "Actions",
      },
    ],
    []
  );

  return (
    <Box m={2}>
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{ density: "compact" }}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <Typography m={1} variant="h6">
              User Management
            </Typography>
          );
        }}></MaterialReactTable>
    </Box>
  )
}

export default AdminUserManagement