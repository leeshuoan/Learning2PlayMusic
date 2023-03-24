import { Backdrop, Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

export default function DeleteAnnouncementForm({ dateId, announcementTitle, content, handleCloseDeleteModal, handleCloseDeleteModalSuccess }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const GAendpoint = `${import.meta.env.VITE_API_URL}/generalannouncement?dateId=${dateId}`;
  async function handleDelete() {
    setOpen(true);
    let response;
    try {
      response = await fetch(GAendpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred!");
      setOpen(false);
      return;
    }
    setOpen(false);
    if (response.status == 200) {
      const data = await response.json();
      toast.success(`Announcement ${announcementTitle} deleted!`);
      handleCloseDeleteModalSuccess();
    } else {
      toast.error(`Announcement ${announcementTitle} failed to delete!`);
      handleCloseDeleteModal();
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Are you sure you want to delete this announcement?
      </Typography>
      <br></br>
      <Typography variant="h6">{announcementTitle}</Typography>
      <Typography variant="body">{content}</Typography>

      <br></br>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 3,
        }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "lightgrey",
            color: "black",
            boxShadow: theme.shadows[10],
            ":hover": { backgroundColor: "hovergrey" },
          }}
          onClick={handleCloseDeleteModal}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Yes
        </Button>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
