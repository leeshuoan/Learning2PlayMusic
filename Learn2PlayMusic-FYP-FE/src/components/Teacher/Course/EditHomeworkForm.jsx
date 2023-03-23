import { Backdrop, Box, Button, Card, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../utils/CustomBreadcrumbs";

const EditHomeworkForm = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { homeworkId } = useParams();
  const [course, setCourse] = useState({});
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(null);
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");
  dayjs.extend(customParseFormat);

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
  const getHomeworkFeedbackAPI = request(`/course/homework?courseId=${courseid}&homeworkId=${homeworkId}`);

  useEffect(() => {
    async function fetchData() {
      const [data1, data2] = await Promise.all([getCourseAPI, getHomeworkFeedbackAPI]);
      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);
      setHomeworkTitle(data2.HomeworkTitle);
      setHomeworkDescription(data2.HomeworkDescription);
      dayjs.extend(customParseFormat);
      setValue(dayjs(data2.HomeworkDueDate));
    }
    fetchData();
    setOpen(false);
  }, []);

  const updateHomework = async (e) => {
    e.preventDefault();
  }

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
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {course.teacher}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                Teacher
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ py: 3, px: 5, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Edit Homework
          </Typography>
          <form onSubmit={updateHomework}>
            <TextField required fullWidth id="title" label="Title" variant="outlined" value={homeworkTitle} onChange={(e) => setHomeworkTitle(e.target.value)} sx={{ mt: 2 }} />
            <TextField label="Add Text" variant="outlined" rows={7} value={homeworkDescription} onChange={(e) => setHomeworkDescription(e.target.value)} multiline fullWidth sx={{ mt: 2, mb: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date *"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                component={(params) => <TextField {...params} required fullWidth />}
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
              <Button variant="contained">Update</Button>
            </Box>
          </form>
        </Card>
      </Container>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default EditHomeworkForm;
