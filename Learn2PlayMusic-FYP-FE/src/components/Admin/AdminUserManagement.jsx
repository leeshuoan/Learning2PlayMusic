import { useMemo, useState } from 'react'
import { Box, Button, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";

const AdminUserManagement = () => {
  const [data, setData] = useState([]);

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