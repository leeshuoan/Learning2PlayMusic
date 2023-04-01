import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";

export default function UnenrolUserForm({ toUnEnrolCourse, toUnEnrolUser, handleClose }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const confirmUnenrolUserFromCourse = async () => {
    setOpen(true);
    let endpoint = `${import.meta.env.VITE_API_URL}/user/course?courseId=${toUnEnrolCourse.SK.split("#")[1]}&userId=${toUnEnrolUser.Username}`;
    let myInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(endpoint, myInit);
    let data = await res.json();
    if (res.status == 202) {
      toast.warning(toUnEnrolUser.Attributes.Name + " has already been unenrolled from " + toUnEnrolCourse.courseDetails);
    } else if (res.status == 400) {
      toast.error(data.message);
    } else if (res.status == 200) {
      toast.success(toUnEnrolUser.Attributes.Name + " successfully unenrolled from " + toUnEnrolCourse.courseDetails);
    }
    handleClose();
    setOpen(false);
    return;
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            Un-enrol the following user from course?
          </Typography>
          <Typography align="center" color="error" variant="subtitle1">
            Warning: This action cannot be undone and will remove all user data from the course forever.
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
          <Box>
            <b>Name:</b> {toUnEnrolUser && toUnEnrolUser.Attributes.Name}
          </Box>
          <Box>
            <b>Email:</b> {toUnEnrolUser && toUnEnrolUser.Attributes.email}
          </Box>
          <Box>
            <b>Course to be un-enrolled from:</b> {toUnEnrolCourse ? toUnEnrolCourse.CourseName + " on " + toUnEnrolCourse.CourseSlot : null}
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
            onClick={() => {
              handleClose();
            }}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ mr: 1 }} color="error" onClick={() => confirmUnenrolUserFromCourse()}>
            Un-enrol
          </Button>
        </Grid>
      </Grid>
      <Loader open={open} />
    </>
  );
}
