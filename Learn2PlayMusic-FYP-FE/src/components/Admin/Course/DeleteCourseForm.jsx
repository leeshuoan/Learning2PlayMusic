import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { toast } from "react-toastify";

export default function DeleteCourseForm({ courseId, courseName, timeSlot, teacherName, handleCloseDeleteModal, handleCloseDeleteModalSuccess }) {
  const theme = useTheme();
  const courseEndpoint = `${import.meta.env.VITE_API_URL}/course?courseId=${courseId}`;
  async function handleDelete() {
    const response = await fetch(courseEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      const data = await response.json();
      toast.success(`Course ${courseName} deleted!`);
      handleCloseDeleteModalSuccess();
    } else {
      toast.error(`Course ${courseName} failed to delete!`);
      handleCloseDeleteModal();
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Are you sure you want to delete this course permanently?
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <Typography variant="body1">
            <b>Course Name:</b> {courseName}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <Typography variant="body1">
            <b>Time Slot:</b> {timeSlot}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <Typography variant="body1">
            <b>Teacher: </b>
            {teacherName}
          </Typography>
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
          onClick={handleCloseDeleteModal}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </>
  );
}
