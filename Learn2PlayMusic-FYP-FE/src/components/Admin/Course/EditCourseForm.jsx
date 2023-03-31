import { Autocomplete, Box, Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";

export default function EditCourseForm({ courseId, ogCourseName, ogTimeSlot, ogTeacherName, ogTeacherId, handleCloseEditModal, handleCloseEditModalSuccess }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const [courseName, setCourseName] = useState(ogCourseName);
  const [day, setDay] = useState(ogTimeSlot.split(" ")[0]);
  const [hour, setHour] = useState(ogTimeSlot.split(" ")[1].toUpperCase());
  const [selectedTeacher, setSelectedTeacher] = useState({
    teacherId: ogTeacherId,
    teacherName: ogTeacherName,
  });
  const [teachers, setTeachers] = useState([]);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hoursOfDay = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM"];

  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  };

  const courseEndpoint = `${import.meta.env.VITE_API_URL}/course`;
  const teacherListEndpoint = `${import.meta.env.VITE_API_URL}/user/teacher`;
  const submitForm = async (event) => {
    setOpen(true);

    event.preventDefault();
    // validation
    if (courseName === "" || day === "" || hour === "" || selectedTeacher === "") {
      toast.error("Please fill in all fields!");
      setOpen(false);
      return;
    }
    if (courseName == ogCourseName && day == ogTimeSlot.split(" ")[0] && hour == ogTimeSlot.split(" ")[1].toUpperCase() && selectedTeacher.teacherId == ogTeacherId) {
      toast.error("Please make changes to at least one field!");
      setOpen(false);
      return;
    }
    // request body building
    let requestBody = { courseId: courseId };

    if (courseName != ogCourseName) {
      requestBody.courseName = courseName;
    }
    if (day != ogTimeSlot.split(" ")[0] || hour != ogTimeSlot.split(" ")[1].toUpperCase()) {
      requestBody.courseSlot = day + " " + hour;
    }
    if (selectedTeacher.teacherId != ogTeacherId) {
      requestBody.teacherId = selectedTeacher.teacherId;
    }
    console.log(requestBody);
    let response;
    try {
      response = await fetch(courseEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      toast.error("An unexpected error occurred!");
      setOpen(false);
      return;
    }
    setOpen(false);
    if (response.status == 200) {
      const data = await response.json();
      toast.success(`Course ${courseName} updated!`);
      handleCloseEditModalSuccess();
    } else {
      toast.error(`Course ${courseName} failed to update!`);
      handleCloseEditModal();
    }
    return;
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await fetch(teacherListEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setTeachers(data);
    };
    fetchTeachers();
  }, []);

  return (
    <form noValidate onSubmit={submitForm}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h5">Edit course</Typography>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <TextField variant="outlined" required fullWidth label="Course Name" value={courseName} onChange={handleCourseNameChange} autoFocus />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <Autocomplete
            disablePortal
            name="day"
            id="day"
            options={daysOfWeek}
            defaultValue={ogTimeSlot.split(" ")[0]}
            renderInput={(params) => <TextField {...params} label="Day *" />}
            onChange={(event, newValue) => {
              setDay(newValue);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <Autocomplete
            disablePortal
            name="hour"
            id="hour"
            options={hoursOfDay}
            defaultValue={ogTimeSlot.split(" ")[1].toUpperCase()}
            renderInput={(params) => <TextField {...params} label="Timing *" />}
            onChange={(event, newValue) => {
              setHour(newValue);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <Autocomplete
            disablePortal
            name="teacher"
            id="teacher"
            options={teachers}
            defaultValue={selectedTeacher}
            isOptionEqualToValue={(option, value) => option.teacherId === value.teacherId}
            getOptionLabel={(option) => option.teacherName}
            renderInput={(params) => <TextField {...params} label="Teacher *" />}
            onChange={(event, newValue) => {
              setSelectedTeacher(newValue);
            }}
          />
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
          Create
        </Button>
      </Box>
      <Loader open={open} />
    </form>
  );
}
