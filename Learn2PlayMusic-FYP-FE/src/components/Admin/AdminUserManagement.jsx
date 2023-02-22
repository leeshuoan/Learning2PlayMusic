import { useMemo, useState, useEffect } from 'react'
import { Box, Button, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Auth, API } from 'aws-amplify';

const AdminUserManagement = () => {
  const [data, setData] = useState([]);

  const listUsers = async () => {
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
    let userData = users.Users

    for (let idx in userData) {
      for (let attributeIdx in userData[idx]['Attributes']) {
        if (userData[idx]['Attributes'][attributeIdx]['Name'] == 'email') {
          userData[idx]['Attributes'].Email = userData[idx]['Attributes'][attributeIdx]['Value']
        } else if (userData[idx]['Attributes'][attributeIdx]['Name'] == 'custom:name') {
          userData[idx]['Attributes'].Name = userData[idx]['Attributes'][attributeIdx]['Value']
        } else if (userData[idx]['Attributes'][attributeIdx]['Name'] == 'custom:role') {
          userData[idx]['Attributes'].Role = userData[idx]['Attributes'][attributeIdx]['Value']
        }
      }

      let date = new Date(userData[idx]['UserCreateDate'])
      let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      userData[idx]['UserCreateDate'] = formattedDate 
    } 
    setData(userData)
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