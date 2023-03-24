import { Box, Button, Typography, useTheme } from "@mui/material";
import { toast } from "react-toastify";

export default function DeleteAnnouncementForm({ dateId, announcementTitle, content, handleCloseDeleteModal, handleCloseDeleteModalSuccess }) {
  const theme = useTheme();
  const GAendpoint = `${import.meta.env.VITE_API_URL}/generalannouncement?dateId=${dateId}`;
  async function handleDelete() {
    const response = await fetch(GAendpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    </Box>
  );
}
