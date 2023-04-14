import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";

const NewHomeworkForm = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [course, setCourse] = useState({});
  const [open, setOpen] = useState(true);
  dayjs.extend(customParseFormat);
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");
  const [value, setValue] = useState(null);

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);

  useEffect(() => {
    async function fetchData() {
      const [data1] = await Promise.all([getCourseAPI]);

      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);
      setOpen(false);
    }
    fetchData();
  }, []);

  const createHomework = (e) => {
    e.preventDefault();
    setOpen(true);
    if (homeworkTitle == "") {
      toast.error("Please fill in the title!");
      setOpen(false);
      return;
    }
    if (homeworkDescription == "") {
      toast.error("Please fill in the description!");
      setOpen(false);
      return;
    }

    if (value == null) {
      toast.error("Please select a due date!");
      setOpen(false);
      return;
    }

    if (new Date(value.toISOString()) < new Date()) {
      toast.error("Due date cannot be in the past!");
      setOpen(false);
      return;
    }
    const newHomework = {
      homeworkTitle: homeworkTitle,
      homeworkDescription: homeworkDescription,
      homeworkDueDate: value.add(1, "day").toISOString(),
      homeworkAssignedDate: new Date().toISOString(),
      courseId: courseid,
    };
    console.log(newHomework);
    const res = fetch(`${import.meta.env.VITE_API_URL}/course/homework`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHomework),
    });
    if (res) {
      toast.success("Homework created successfully!");
      setOpen(false);
      navigate(`/teacher/course/${courseid}/homework`);
    } else {
      setOpen(false);
      toast.error("An unexpected error occured during homework creation");
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/homework` }]} breadcrumbEnding="New Homework" />
        <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <Typography variant="h5" sx={{ color: "primary.main" }}>
                {course.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Date: {course.timeslot}
              </Typography>
            </Box>
          </Box>
        </Card>
        <Card sx={{ py: 3, px: 5, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            New Homework
          </Typography>
          <form onSubmit={createHomework}>
            <TextField id="title" label="Title*" variant="outlined" value={homeworkTitle} onChange={() => setHomeworkTitle(event.target.value)} sx={{ mt: 2 }} />
            <TextField id="description" label="Description*" variant="outlined" rows={7} value={homeworkDescription} onChange={() => setHomeworkDescription(event.target.value)} multiline fullWidth sx={{ mt: 2, mb: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date *"
                value={value}
                onChange={(newValue) => {
                  console.log(newValue);
                  setValue(newValue);
                }}
                component={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  navigate(`/teacher/course/${courseid}/homework`);
                }}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Create
              </Button>
            </Box>
          </form>
        </Card>
        <Loader open={open} />
      </Container>
    </>
  );
};

export default NewHomeworkForm;
