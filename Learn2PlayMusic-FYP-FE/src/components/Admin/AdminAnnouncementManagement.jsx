import { Backdrop, Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";

const AdminAnnouncementManagement = () => {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const theme = useTheme();
  const allGAendpoint = `${import.meta.env.VITE_API_URL}/generalannouncement`;
  // post (same endpoint as above) =>> body == {
  //   "announcementTitle": "string",
  //   "content": "string"
  // }
  // const oneGAendpoint = `${import.meta.env.VITE_API_URL}/generalannouncement/${date_id}`;
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        id: "title",
        header: "Title",
        size: 30,
      },
      {
        accessorKey: "date",
        id: "date",
        header: "Date",
      },
      {
        accessorKey: "content",
        id: "content",
        header: "Content",
      },
      // {
      //   accessorKey: "",
      //   id: "actions",
      //   header: "Actions",
      //   Cell: ({ cell, row }) => (
      //     <Box
      //       sx={{
      //         display: "flex",
      //         alignItems: "center",
      //         gap: "1rem",
      //       }}>
      //       <Button
      //         variant="contained"
      //         sx={{ display: row.original.Enabled == "Enabled" ? "block" : "none" }}
      //         onClick={() => {
      //           disableUser(row.original);
      //         }}>
      //         Disable
      //       </Button>
      //       <Button
      //         variant="contained"
      //         sx={{ display: row.original.Enabled == "Enabled" ? "none" : "block" }}
      //         onClick={() => {
      //           enableUser(row.original);
      //         }}>
      //         Enable
      //       </Button>
      //       <Button
      //         variant="contained"
      //         color="error"
      //         disabled={row.original.Enabled == "Enabled" ? true : false}
      //         onClick={() => {
      //           deleteUser(row.original);
      //         }}>
      //         Delete
      //       </Button>
      //     </Box>
      //   ),
      // },
    ],
    []
  );

  async function getAPI(endpoint) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
  useEffect(() => {
    getAPI(allGAendpoint).then((res) => {
      var fetchedData = res.map((announcement) => {
        const date = announcement.SK.split("#")[1].split("T")[0];
        const id = announcement.SK.split("#")[1];
        const content = announcement.Content;
        const title = announcement.AnnouncementTitle;
        return { id, date, content, title };
      });
      setAnnouncements(fetchedData);
      console.log(fetchedData);
    });
  }, []);
  return (
    <Box>
      <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
        Announcement Management
      </Typography>
      {/* {announcements.map((announcement) => (
        <Card sx={{ m: 1, p: 3 }}>
          <Typography variant="h6">{announcement.title}</Typography>
          <Typography variant="subtitle">{announcement.date}</Typography>
          <Typography variant="body1">{announcement.content}</Typography>
        </Card>
      ))} */}
      <MaterialReactTable
        enableHiding={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        columns={columns}
        data={announcements}
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
                  // change the 
                  setOpenCreateUser(true);
                }}>
                New Announcement
              </Button>
            </Box>
          );
        }}></MaterialReactTable>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default AdminAnnouncementManagement;
