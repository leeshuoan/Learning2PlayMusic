import { Box, Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";

export default function EditAnnouncementForm({ dateId, existingAnnouncementTitle, existingContent, handleCloseEditModal, handleCloseEditModalSuccess }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const [announcementTitle, setAnnouncementTitle] = useState(existingAnnouncementTitle);
  const [content, setContent] = useState(existingContent);

  const handleAnnouncementTitleChange = (event) => {
    setAnnouncementTitle(event.target.value);
  };
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  const GAendpoint = `${import.meta.env.VITE_API_URL}/generalannouncement?dateId=${dateId}`;
  const submitForm = async (event) => {
    setOpen(true);
    event.preventDefault();

    if (announcementTitle === "" || content === "") {
      setOpen(false);
      toast.error("Please fill in all fields!");
      return;
    }
    if (announcementTitle === existingAnnouncementTitle && content === existingContent) {
      setOpen(false);
      toast.error("Please make changes in at least one field!");
      return;
    }
    let response;
    try {
      response = await fetch(GAendpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          announcementTitle: announcementTitle,
          content: content,
        }),
      });
    } catch (error) {
      toast.error("An unexpected error occurred!");
      setOpen(false);
      return;
    }
    setOpen(false);
    if (response.status == 200) {
      const data = await response.json();
      toast.success(`Announcement ${announcementTitle} updated!`);
      handleCloseEditModalSuccess();
    } else {
      toast.error(`Announcement ${announcementTitle} failed to update!`);
      handleCloseEditModal();
    }
  };

  return (
    <form noValidate onSubmit={submitForm}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Update general announcement</Typography>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <TextField variant="outlined" required fullWidth label="Title" value={announcementTitle} onChange={handleAnnouncementTitleChange} />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField variant="outlined" required fullWidth label="Content" autoComplete="email" value={content} onChange={handleContentChange} multiline />
        </Grid>
      </Grid>

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
          onClick={handleCloseEditModal}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Update
        </Button>
      </Box>
      <Loader open={open} />
    </form>
  );
}
