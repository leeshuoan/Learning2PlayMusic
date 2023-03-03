import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useTheme,
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Link,
  Breadcrumbs,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import QuizCard from "./QuizCard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import TransitionModal from "../../utils/TransitionModal";
import celebration from "../../../assets/celebration.png";

const UserQuiz = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { quizId } = useParams();
  const [course, setCourse] = useState({});
  const [quizTitle, setQuizTitle] = useState("");
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [questionsArray, setQuestionsArray] = useState([]);
  const theme = useTheme();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizMaxAttempt, setQuizMaxAttempt] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const getCourse = fetch(
    `${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // const getQuizAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz?courseId=${courseid}&studentId=${userInfo.userInfo.id}`, {
  const getQuizAPI = fetch(
    `${import.meta.env.VITE_API_URL
    }/course/quiz?courseId=${courseid}&studentId=1&quizId=${quizId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // const getQuizAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz?courseId=${courseid}&studentId=${userInfo.userInfo.id}`, {
  const getQuizQuestionAPI = fetch(
    `${import.meta.env.VITE_API_URL
    }/course/quiz/question?courseId=${courseid}&quizId=${quizId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  useEffect(() => {
    Promise.all([getCourse, getQuizAPI, getQuizQuestionAPI])
      .then(async ([res1, res2, res3]) => {
        const [data1, data2, data3] = await Promise.all([
          res1.json(),
          res2.json(),
          res3.json(),
        ]);

        let courseData = {
          id: data1[0].SK.split("#")[1],
          name: data1[0].CourseName,
          timeslot: data1[0].CourseSlot,
        };
        setCourse(courseData);

        setQuizTitle(data2.QuizTitle);
        setQuizAttempt(data2.QuizAttempt);
        setQuizMaxAttempt(data2.QuizMaxAttempt);

        data3.forEach((question) => {
          question["id"] = question.SK.split("Question#")[1];
        });
        setQuestionsArray(data3);

        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setOpen(false);
      });
  }, []);

  const handleOptionChange = (id, selectedOption) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions, [id]: selectedOption
    }));
  };

  const confirmSubmit = () => {
    setSubmitted(true);
  };

  return (
    <>
      <TransitionModal
        open={openModal}
        handleClose={() => { setOpenModal(false) }}>
        <Box sx={{ display: submitted ? "none" : "block" }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Submit your quiz?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "lightgrey",
                color: "black",
                boxShadow: theme.shadows[10],
                ":hover": { backgroundColor: "hovergrey" },
              }}
              onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => { confirmSubmit() }}>
              Yes
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: submitted ? "block" : "none" }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Submission Successful!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src={celebration}></img>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}>
            Score: {questionsArray.map((question) => {
              if (question.Answer === selectedOptions[question.id]) {
                return 1;
              }
              return 0;
            }).reduce((a, b) => a + b, 0)}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" sx={{ mt: 1 }}onClick={() => { navigate(`/home/course/${courseid}/quiz`) }}>Back to Quizzes</Button>
          </Box>
        </Box>
      </TransitionModal>

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
              navigate("/home");
            }}>
            <HomeIcon sx={{ mr: 0.5 }} />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => {
              navigate(`/home/course/${courseid}/quiz`);
            }}>
            {course.name}
          </Link>
          <Typography>{quizTitle}</Typography>
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
                Miss Felicia Ng
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                Teacher
              </Typography>
            </Box>
          </Box>
        </Card>
        <Box>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {quizTitle}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Attempt: {quizAttempt}/{quizMaxAttempt}
            </Typography>
            <Grid container spacing={3} >
              {questionsArray.map(({ Question, Options, Answer, id, QuestionImage }, index) => (
                <Grid key={index} item xs={12}>
                  <QuizCard
                    index={index + 1}
                    question={Question}
                    image={QuestionImage}
                    options={Options}
                    answer={Answer}
                    handleOptionChange={selectedOption => { handleOptionChange(id, selectedOption) }}
                  />
                </Grid>
              ))}
            </Grid>
            {/* on submit send the quiz results to backend */}
            {/* add a submit button */}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => { setOpenModal(true) }}
              disabled={questionsArray.length != Object.keys(selectedOptions).length}>
              SUBMIT QUIZ
            </Button>
          </Card>
        </Box>


        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};

export default UserQuiz;
