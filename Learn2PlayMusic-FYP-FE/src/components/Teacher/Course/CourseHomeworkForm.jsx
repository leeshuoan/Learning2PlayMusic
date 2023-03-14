import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme, Typography, Container, Card, Box, TextField, Link, Button, Breadcrumbs, Backdrop, IconButton, CircularProgress } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CourseHomeworkForm = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [course, setCourse] = useState({});
  const [open, setOpen] = useState(true);
  dayjs.extend(customParseFormat);
  const [value, setValue] = useState(null);

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    }
    fetchData()
    setOpen(false)
  }, []);

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mt: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              navigate("/teacher");
            }}>
            <HomeIcon sx={{ mr: 0.5 }} />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => {
              navigate(`/teacher/course/${courseid}/homework`);
            }}>
            {course.name}
          </Link>
          <Typography color="text.primary">New Homework</Typography>
        </Breadcrumbs>

        <Card
          sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
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
            New Homework
          </Typography>
          <form noValidate>
            <TextField
              required
              fullWidth
              id="title"
              label="Title"
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <TextField
              label="Add Text"
              variant="outlined"
              rows={7}
              multiline
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker
                label="Due Date"
                value={value}
                onChange={(newValue) => {
                  console.log(newValue);
                  setValue(newValue);
                }}
                component={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" sx={{ color: "primary.main" }} onClick={() => {navigate(`/teacher/course/${courseid}/homework`)}}>
                Cancel
              </Button>
              <Button variant="contained" >
                Create
              </Button>
            </Box>
          </form>
        </Card>
      </Container>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default CourseHomeworkForm