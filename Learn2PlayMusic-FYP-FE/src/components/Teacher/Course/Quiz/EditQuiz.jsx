import { Box, Button, Card, Container, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";
import EditQuizNewQuestion from "./EditQuizNewQuestion";
import EditQuizQuestion from "./EditQuizQuestion";

const EditQuiz = ({ userInfo }) => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { quizId } = useParams();
  const [course, setCourse] = useState({});
  const [disableEditQuizButton, setDisableEditQuizButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizMaxAttempts, setQuizMaxAttempts] = useState(1);
  const [visibility, setVisibility] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([
    {
      questionId: "",
      question: "",
      questionOptionType: "MCQ",
      options: ["", "", "", ""],
      answer: "",
    },
  ]);
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  let questionNumber = 0;

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
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
  const getQuizAPI = request(`/course/quiz?courseId=${courseid}&quizId=${quizId}`);
  const getQuizQuestionAPI = request(`/course/quiz/question?courseId=${courseid}&quizId=${quizId}`);

  useEffect(() => {
    async function fetchData() {
      let data1 = [],
        data2 = [],
        data3 = [];
      try {
        [data1, data2, data3] = await Promise.all([getCourseAPI, getQuizAPI, getQuizQuestionAPI]);
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

      setQuizTitle(data2.QuizTitle);
      setQuizDescription(data2.QuizDescription);
      setQuizMaxAttempts(data2.QuizMaxAttempts);
      setVisibility(data2.Visibility);

      const quizQuestionData = data3.map((qn) => {
        return {
          questionId: qn.SK.split("Question#")[1],
          question: qn.Question,
          questionOptionType: qn.QuestionOptionType,
          options: qn.Options,
          answer: qn.Answer,
          questionImage: qn.QuestionImage,
        };
      });
      setQuizQuestions(quizQuestionData);
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, [refreshData]);

  const handleRefreshData = () => {
    setRefreshData(!refreshData);
  };

  async function editQuiz(e) {
    setIsLoading(true);

    e.preventDefault();

    const newQuiz = {
      quizTitle: quizTitle,
      quizDescription: quizDescription,
      quizMaxAttempts: quizMaxAttempts,
      visibility: visibility,
      courseId: courseid,
      quizId: quizId,
    };
    console.log(newQuiz);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/course/quiz`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuiz),
    });
    if (response.ok) {
      navigate(`/teacher/course/${courseid}/quiz`);
      toast.success("Quiz edited successfully");
    } else {
      toast.error("Error occurred when editing quiz");
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return;
    }
  }

  const addQuestion = () => {
    questionNumber++;
    setOpenAddQuestion(true);
    setDisableEditQuizButton(true);
    return;
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

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
                    <Select labelId="visible-label" value={visibility} onChange={(e) => handleVisibilityChange(e)} required>
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
              {quizQuestions.map((question, key) => {
                questionNumber++;
                return <EditQuizQuestion key={key} questionNumber={questionNumber} question={question} userInfo={userInfo} handleRefreshData={handleRefreshData} handleDisableEditQuizButton={setDisableEditQuizButton} />;
              })}
              {openAddQuestion ? (
                <EditQuizNewQuestion setOpenAddQuestion={setOpenAddQuestion} handleRefreshData={handleRefreshData} handleDisableEditQuizButton={setDisableEditQuizButton} />
              ) : (
                <Button variant="outlined" color="success" fullWidth sx={{ color: "success.main", mt: 2 }} onClick={addQuestion}>
                  Add Question
                </Button>
              )}
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    navigate(`/teacher/course/${courseid}/quiz`);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={disableEditQuizButton}>
                  Edit Quiz
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
        <Loader open={isLoading} />
      </Container>
    </>
  );
};

export default EditQuiz;
