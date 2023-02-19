import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Button, Typography } from "@mui/material";
import ThemeProvider from "../../theme/index";
import { toast } from "react-toastify";

const ClassMaterialsTable = () => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "",
        id: "title",
        header: "Title",
      },
      {
        accessorKey: "",
        id: "type",
        header: "Type",
      },
      {
        accessorKey: "",
        id: "lessonDate",
        header: "Lesson Date",
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
              Class Materials
            </Typography>
          );
        }}></MaterialReactTable>
    </Box>
  );
};

export default ClassMaterialsTable;
