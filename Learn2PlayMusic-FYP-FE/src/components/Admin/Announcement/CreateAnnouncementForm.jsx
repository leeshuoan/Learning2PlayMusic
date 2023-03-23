import { Box, Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateAnnouncementForm({ handleCloseModal, handleCloseModalSuccess }) {
  const theme = useTheme();
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAnnouncementTitleChange = (event) => {
    setAnnouncementTitle(event.target.value);
  };
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  const GAendpoint = `${import.meta.env.VITE_API_URL}/generalannouncement`;
  const submitForm = async (event) => {
    event.preventDefault();

    if (announcementTitle === "" || content === "") {
      toast.error("Please fill in all fields!");
      return;
    }
    const response = await fetch(GAendpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        announcementTitle: announcementTitle,
        content: content,
      }),
    });
    if (response.status == 200) {
      const data = await response.json();
      toast.success(`Announcement ${announcementTitle} added!`);
      handleCloseModalSuccess();
    } else {
      toast.error(`Announcement ${announcementTitle} failed to add!`);
      handleCloseModal();
    }
  };

  return (
    <form noValidate onSubmit={submitForm}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h5">Create new general announcement</Typography>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <TextField variant="outlined" required fullWidth label="Title" value={announcementTitle} onChange={handleAnnouncementTitleChange} autoFocus />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField variant="outlined" required fullWidth label="Content" autoComplete="email" value={content} onChange={handleContentChange} multiline />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "lightgrey",
            color: "black",
            boxShadow: theme.shadows[10],
            ":hover": { backgroundColor: "hovergrey" },
          }}
          onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Create
        </Button>
      </Box>
    </form>
  );
}
