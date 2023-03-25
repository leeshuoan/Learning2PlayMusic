import Visibility from "@mui/icons-material/Visibility";
import { Backdrop, Box, Card, CircularProgress, Container, TextField, MenuItem, Select, Typography, InputLabel, Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../utils/CustomBreadcrumbs";
import NewQuizQuestion from "./NewQuizQuestion";

const NewQuiz = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { userId } = useParams();
  const { reportId } = useParams();
  const [course, setCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizMaxAttempts, setQuizMaxAttempts] = useState(1);
  const [visibility, setVisibility] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([
    {
      qnNumber: 1,
      question: "",
      questionOptionType: "MCQ",
      options: {
        option1: "",
        option2: "",
        option3: "",
        option4: "",
      },
      answer: ""
    },
  ])
  const [qnNumber, setQnNumber] = useState(2);

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) { // handle non-2xx HTTP status codes
      console.log(response)
      throw new Error(`${response}`);
    }

    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);

  useEffect(() => {
    async function fetchData() {
      let data1 = [], data2 = [], data3 = [];
      try {
        [data1] = await Promise.all([getCourseAPI]);
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
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function createQuiz(e) {
    e.preventDefault();
    console.log(quizQuestions)
    const newQuiz = {
      quizTitle: quizTitle,
      quizDescription: quizDescription,
      quizMaxAttempts: quizMaxAttempts,
      visibility: visibility,
      courseId: courseid,
    }
    let newQuizId = null
    const response = await fetch(`${import.meta.env.VITE_API_URL}/course/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuiz),
    })
    if (response.ok) {
      const responseData = await response.json();
      newQuizId = responseData.message.split('id').splice(1, 1).join().split(' ')[1];
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return
    }

    for (let i = 0; i < quizQuestions.length; i++) {
      const newQuizQuestion = {...quizQuestions[i], courseId: courseid, quizId: newQuizId}
      console.log(newQuizQuestion)
      try {
        fetch(`${import.meta.env.VITE_API_URL}/course/quiz/question`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newQuizQuestion),
        })
      } catch (error) {
        console.log(error)
      }
    }

    if (response) {
      navigate(`/teacher/course/${courseid}/quiz`)
      toast.success("Quiz created successfully");

      console.log("error")
      toast.error("An unexpected error occurred during quiz creation")
    }
  }

  const addQuestion = () => {
    setQuizQuestions([...quizQuestions, {
      qnNumber: qnNumber,
      question: "",
      questionOptionType: "MCQ",
      options: {
        option1: "",
        option2: "",
        option3: "",
        option4: "",
      },
      answer: ""
    }])
    setQnNumber(qnNumber + 1)
  }

  const handleQuestionChange = (qnInfo) => {
    const newQuizQuestions = quizQuestions.map(qn => {
      console.log(qnInfo)
      if (qn.qnNumber === qnInfo.qnNumber) {
        return qnInfo;
      }
      return qn;
    })
    console.log(newQuizQuestions)
    setQuizQuestions(newQuizQuestions);
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/quiz` }]} breadcrumbEnding="New Quiz" />
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
              New Quiz
            </Typography>
            <form onSubmit={createQuiz}>
              <Box sx={{ mt: 1 }}>
                <Grid spacing={2} container >
                  <Grid item xs={12} sm={4} md={3}  >
                    <InputLabel id="title-label">Title *</InputLabel>
                    <TextField id="title" value={quizTitle} onChange={() => setQuizTitle(event.target.value)} variant="outlined" required />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} >
                    <InputLabel id="max-attempts-label">Max Attempts *</InputLabel>
                    <TextField id="max-attempts" type="number" value={quizMaxAttempts} onChange={() => setQuizMaxAttempts(event.target.value)} variant="outlined" required />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} >
                    <InputLabel id="visible-label">Visbility *</InputLabel>
                    <Select labelId="visible-label" value={visibility} onChange={() => setVisibility(event.target.value)} required>
                      <MenuItem value={true}>Shown</MenuItem>
                      <MenuItem value={false}>Hidden</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <InputLabel id="description-label" sx={{ mt: 2 }}>Description</InputLabel>
                <TextField value={quizDescription} onChange={() => setQuizDescription(event.target.value)} fullWidth multiline rows={3} />
              </Box>
              {quizQuestions.map((question, key) => {
                return (<NewQuizQuestion key={key} qnInfo={question} handleQuestionChange={handleQuestionChange} />)
              })}
              <Button variant="outlined" fullWidth sx={{ color: "primary.main", mt: 2 }} onClick={addQuestion}>Add Question</Button>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" type="submit">Create Quiz</Button>
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

export default NewQuiz;
