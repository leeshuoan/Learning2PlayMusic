import { Autocomplete, Box, Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";

export default function EnrolUserForm({ toEnrolUser, handleClose, displayText, userNameToIdMap, type }) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  // all courses -> as options for enroling users to course
  const [allCourses, setAllCourses] = useState([]);
  const [toEnrolCourse, setToEnrolCourse] = useState("");

  // single user  =============================================================
  const confirmEnrolUser = async () => {
    setOpen(true);
    if (toEnrolCourse == null) {
      toast.error("Please select a course");
      return;
    }
    const endpoint = `${import.meta.env.VITE_API_URL}/user/course?courseId=${toEnrolCourse.id}&userId=${toEnrolUser.Username}`;
    const myInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(endpoint, myInit);
    const data = await res.json();
    if (res.status == 202) {
      toast.warning(toEnrolUser.Attributes.Name + " has already been enrolled  in " + toEnrolCourse.courseDetails);
    } else if (res.status == 400) {
      toast.error(data.message);
    } else if (res.status == 200) {
      toast.success(toEnrolUser.Attributes.Name + " successfully enrolled in " + toEnrolCourse.courseDetails);
    }
    setToEnrolCourse("");
    setOpen(false);
    handleClose();
  };

  // multiple users ===========================================================
  const confirmEnrolMultipleUsers = async () => {
    setOpen(true);

    if (!toEnrolCourse) {
      toast.error("Please select a course");
      setOpen(false);
      return;
    }

    const endpoint = `${import.meta.env.VITE_API_URL}/user/course/enrol`;
    const myInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: toEnrolCourse.id,
        userIds: toEnrolUser.map((user) => user.Username),
      }),
    };
    let response;
    try {
      response = await fetch(endpoint, myInit);
    } catch (error) {
      toast.error("Something went wrong, try enrolling the users again!");
      setOpen(false);
      handleClose();
      return;
    }
    const data = await response.json();
    setOpen(false);

    if (response.status === 200 || (response.status === 202 && !data.alreadyEnrolled.length && !data.doesNotExist.length)) {
      toast.success("Successfully enrolled all the selected users");
    } else if (response.status === 202) {
      const { alreadyEnrolled, doesNotExist, enrolled } = data;

      if (alreadyEnrolled.length) {
        const alreadyEnrolledIds = alreadyEnrolled.map((user) => userNameToIdMap[user]).join(", ");
        toast.warning(`The following users are already enrolled in the course: ${alreadyEnrolledIds}`);
      }
      if (doesNotExist.length) {
        const doesNotExistIds = doesNotExist.map((user) => userNameToIdMap[user]).join(", ");
        toast.error(`The following users with the user IDs do not exist: ${doesNotExistIds}`);
      }
      if (enrolled.length) {
        const enrolledIds = enrolled.map((user) => userNameToIdMap[user]).join(", ");
        toast.success(`Successfully enrolled all these users: ${enrolledIds}`);
      }
    } else {
      toast.error(data.message);
    }

    // reset
    setToEnrolCourse("");
    handleClose();
  };

  // useEffect ===============================================================
  async function getCoursesAPI() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/course`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  useEffect(() => {
    async function fetchData() {
      const courses = await getCoursesAPI();
      console.log(courses);
      var fetchedCourses = courses.map((course) => {
        const id = course.SK.split("Course#")[1];
        const courseDetails = course.CourseName + " on " + course.CourseSlot;
        return { id, courseDetails };
      });
      setAllCourses(fetchedCourses);
    }
    fetchData();
    setOpen(false);
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            {type == "single" ? "Enrol User?" : "Enrol Multiple Users?"}
          </Typography>
        </Grid>
        {type == "single" ? (
          <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
            <Box>
              <b>Name:</b> {toEnrolUser && toEnrolUser.Attributes.Name}
            </Box>
            <Box>
              <b>Email:</b> {toEnrolUser && toEnrolUser.Attributes.email}
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
            <Box>
              <b>Name:</b> {displayText}
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "left", mt: 1 }}>
          <Autocomplete
            fullWidth
            disablePortal
            name="course"
            id="course"
            options={allCourses}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.courseDetails}
            renderInput={(params) => <TextField {...params} label="Course *" />}
            onChange={(event, newValue) => {
              setToEnrolCourse(newValue);
            }}
          />
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

          {type == "single" ? (
            <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmEnrolUser()}>
              Enrol
            </Button>
          ) : (
            <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmEnrolMultipleUsers()}>
              Enrol
            </Button>
          )}
        </Grid>

        <Loader open={open} />
      </Grid>
    </>
  );
}
