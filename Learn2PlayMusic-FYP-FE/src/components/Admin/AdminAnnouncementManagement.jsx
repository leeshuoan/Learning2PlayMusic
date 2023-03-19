import { Backdrop, Box, Card, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

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
      {announcements.map((announcement) => (
        <Card sx={{ m: 1, p: 3 }}>
          <Typography variant="h6">{announcement.title}</Typography>
          <Typography variant="subtitle">{announcement.date}</Typography>
          <Typography variant="body1">{announcement.content}</Typography>
        </Card>
      ))}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default AdminAnnouncementManagement;
