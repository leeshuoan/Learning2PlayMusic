import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";
import QuizQuestionChart from "./QuizQuestionChart";
const QuizSummary = (userInfo) => {
  const navigate = useNavigate();
  const green = "#4caf50";
  const red = "#b2102f";
  const { courseid } = useParams();
  const { quizId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState({});
  const [quiz, setQuiz] = useState({ QuizTitle: "" });
  const [quizQuestions, setQuizQuestions] = useState([]);
  let questionCounter = 0;

  // api calls
  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);
  const getQuizAPI = request(`/course/quiz?courseId=${courseid}&quizId=${quizId}`);
  const getQuizQuestionAPI = request(`/course/quiz/question?courseId=${courseid}&quizId=${quizId}`);

  useEffect(() => {
    async function fetchData() {
      let fetchedCourseData = [];
      let fetchedQuizData = [];
      let fetchedQuizQuestionData = [];

      try {
        [fetchedCourseData, fetchedQuizData, fetchedQuizQuestionData] = await Promise.all([getCourseAPI, getQuizAPI, getQuizQuestionAPI]);
      } catch (error) {
        console.log(error);
      }

      let courseData = {
        id: fetchedCourseData[0].SK.split("#")[1],
        name: fetchedCourseData[0].CourseName,
        timeslot: fetchedCourseData[0].CourseSlot,
        teacher: fetchedCourseData[0].TeacherName,
      };
      console.log(courseData);
      setCourse(courseData);

      let quizPerformance;
      let AverageScorePercent = fetchedQuizData.TotalScore == 0 || fetchedQuizData.NumberOfAttempts == 0 ? 0 : parseFloat(((fetchedQuizData.TotalScore / fetchedQuizData.NumberOfAttempts / fetchedQuizData.QuestionCount) * 100).toFixed(2));
      console.log(AverageScorePercent);
      if (AverageScorePercent == 0) {
        // edge case of everyone get 0
        quizPerformance = fetchedQuizData.NumberOfAttempts > 0 ? red : "";
      } else {
        // pass or fail color 
        quizPerformance = AverageScorePercent >= 50 ? green : red;
      }
      fetchedQuizData = { ...fetchedQuizData, quizPerformance, AverageScorePercent };
      setQuiz(fetchedQuizData);

      let questionsData = fetchedQuizQuestionData.map((q) => {
        let questionId = q.SK.split("Question#")[1];
        let percentCorrect = q.Correct == 0 || q.Attempts == 0 ? 0 : Math.round((q.Correct / q.Attempts) * 10000) / 100;
        let performance = percentCorrect == null ? "black" : percentCorrect >= 50 ? green : red;
        let optionsStats = q.Options.map((o) => {
          let name = o;
          let correct = q.Answer == o ? true : false;
          let percent = q.Attempts == 0 ? 0 : Math.round((q[o] / q.Attempts) * 10000) / 100;
          return { name, correct, percent };
        });
        return { ...q, questionId, percentCorrect, performance, optionsStats };
      });
      console.log(questionsData);
      setQuizQuestions(questionsData);
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/quiz` }]} breadcrumbEnding={quiz.QuizTitle + " Summary"} />
      {/* top bar ================================ */}
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
      {/* summary statistics ================================ */}
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h5">{quiz.QuizTitle}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="body1">
              <b>Quiz Description:</b> {quiz.QuizDescription == "" ? "No description provided" : quiz.QuizDescription}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography variant="body1">
              <b>Quiz Max Attempts:</b> {quiz.QuizMaxAttempts}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <Typography variant="body1">
              <b>Number of attempts:</b> {quiz.NumberOfAttempts == 0 ? "-" : quiz.NumberOfAttempts}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Typography variant="body1">
              <b>Quiz Average Score:</b> {quiz.quizPerformance == "" && quiz.AverageScorePercent == 0 ? "-" : <span style={{ color: quiz.quizPerformance }}>{quiz.AverageScorePercent}%</span>}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* question analytics ================================ */}
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h5">Questions</Typography>
          </Grid>
          {quizQuestions.map((question) => {
            questionCounter++;
            let questionImage = question.QuestionImage ? question.QuestionImage : null;
            return (
              <Grid item xs={12} sm={12} md={12}>
                <Accordion id={question.SK} key={question.SK} aria-controls={question.SK} sx={{ border: "1px solid rgba(0,0,0,0.05)", borderRadius: 4 }}>
                  {/* summary */}
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">
                      <b>Question {questionCounter}:</b>&nbsp;{question.Question}
                      <br />
                      <b>Question's Average Score:</b>&nbsp;
                      <span style={{ color: question.performance }}>
                        {question.Correct}/{question.Attempts}&nbsp;({question.percentCorrect}%)
                      </span>
                    </Typography>
                  </AccordionSummary>
                  {/* drop down */}
                  <AccordionDetails>
                    <Typography>{question.QuestionText}</Typography>
                    <QuizQuestionChart questionImage={questionImage} data={question.optionsStats}></QuizQuestionChart>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
        </Grid>
      </Card>
      <Card sx={{}}></Card>
      {/* navigation ================================ */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "left" }}>
        <Button
          variant="outlined"
          sx={{ color: "primary.main" }}
          onClick={() => {
            navigate(`/teacher/course/${courseid}/quiz`);
          }}>
          Back
        </Button>
      </Box>

      {/* Backdrop for loading */}
      <Loader open={isLoading} />
    </Container>
  );
};

export default QuizSummary;
