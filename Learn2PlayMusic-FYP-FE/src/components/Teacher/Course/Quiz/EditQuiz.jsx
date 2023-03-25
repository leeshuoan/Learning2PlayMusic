import { Backdrop, Box, Button, Card, CircularProgress, Container, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";

const EditQuiz = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { quizid } = useParams();
  const [course, setCourse] = useState({});
  const [quiz, setQuiz] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizMaxAttempts, setQuizMaxAttempts] = useState(1);
  const [visibility, setVisibility] = useState(true);

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // handle non-2xx HTTP status codes
      console.log(response);
      throw new Error(`${response}`);
    }

    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);
  const getQuizAPI = request(`/course/quiz?courseId=${courseid}&quizId=${quizid}`);

  useEffect(() => {
    async function fetchData() {
      let data1 = [];
      let data2 = [];
      try {
        [data1, data2] = await Promise.all([getCourseAPI, getQuizAPI]);
      } catch (error) {
        console.log(error);
      }

      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      let quizData = {
        quizMaxAttempts: data2.QuizMaxAttempts,
        quizDescription: data2.QuizDescription,
        quizTitle: data2.QuizTitle,
        visibility: data2.Visibility,
      };
      setQuiz(quizData); // for referencing when update
      console.log(quizData);
      // to fill up the form
      setQuizTitle(data2.QuizTitle);
      setQuizDescription(data2.QuizDescription);
      setQuizMaxAttempts(data2.QuizMaxAttempts);
      setVisibility(data2.Visibility);
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function editQuiz(e) {
    e.preventDefault();
    setIsLoading(true);
    // input validation
    if (quizTitle === "" || quizTitle === "" || quizMaxAttempts === "" || visibility === "") {
      toast.error("Please fill in all the required fields");
      setIsLoading(false);
      return;
    }
    if (quizTitle === quiz.quizTitle && quizDescription === quiz.quizDescription && quizMaxAttempts === quiz.quizMaxAttempts && visibility === quiz.visibility) {
      toast.error("Please make changes to the quiz before updating");
      setIsLoading(false);
      return;
    }
    if (quizMaxAttempts < 1) {
      toast.error("Max attempts must be at least 1");
      setIsLoading(false);
      return;
    }

    const updatedQuiz = {
      quizTitle: quizTitle,
      quizDescription: quizDescription,
      quizMaxAttempts: quizMaxAttempts,
      visibility: visibility,
      courseId: courseid,
      quizId: quizid,
    };
    const response = await fetch(`${import.meta.env.VITE_API_URL}/course/quiz`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuiz),
    });
    setIsLoading(false);

    if (response) {
      navigate(`/teacher/course/${courseid}/quiz`);
      toast.success("Quiz created successfully");
    }
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/quiz` }]} breadcrumbEnding="Edit Quiz" />
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

        <Box>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Edit Quiz
            </Typography>
            <form onSubmit={editQuiz}>
              <Box sx={{ mt: 1 }}>
                <Grid spacing={2} container>
                  <Grid item xs={12} sm={4} md={3}>
                    <InputLabel id="title-label">Title *</InputLabel>
                    <TextField id="title" value={quizTitle} onChange={() => setQuizTitle(event.target.value)} variant="outlined" required />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <InputLabel id="max-attempts-label">Max Attempts *</InputLabel>
                    <TextField id="max-attempts" type="number" value={quizMaxAttempts} onChange={() => setQuizMaxAttempts(event.target.value)} variant="outlined" required />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <InputLabel id="visible-label">Visbility *</InputLabel>
                    <Select labelId="visible-label" value={visibility} onChange={() => setVisibility(event.target.value)} required>
                      <MenuItem value={true}>Shown</MenuItem>
                      <MenuItem value={false}>Hidden</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <InputLabel id="description-label" sx={{ mt: 2 }}>
                  Description
                </InputLabel>
                <TextField value={quizDescription} onChange={() => setQuizDescription(event.target.value)} fullWidth multiline rows={3} />
              </Box>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    navigate(-1);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Edit Quiz
                </Button>
              </Box>
            </form>
          </Card>
        </Box>

        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};

export default EditQuiz;
