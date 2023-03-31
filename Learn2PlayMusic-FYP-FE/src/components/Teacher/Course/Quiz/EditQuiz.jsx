import { Backdrop, Box, Button, Card, CircularProgress, Container, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import EditQuizQuestion from "./EditQuizQuestion";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const EditQuiz = ({ userInfo }) => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { quizId } = useParams();
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
      options: ["", "", "", ""],
      answer: ""
    },
  ]);
  const [qnNumber, setQnNumber] = useState(2);

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`
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
      let data1 = [], data2 = [], data3 = [];
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

      let i = 1
      const quizQuestionData = data3.map((qn) => {
        return {
          qnId: qn.SK.split("Question#")[1],
          qnNumber: i++,
          question: qn.Question,
          questionOptionType: qn.QuestionOptionType,
          options: qn.Options,
          answer: qn.Answer,
          qnImage: qn.QuestionImage,
        };
      });
      setQuizQuestions(quizQuestionData);
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function createQuiz(e) {
    setIsLoading(true);

    e.preventDefault();
    console.log(quizQuestions);

    for (let i = 0; i < quizQuestions.length; i++) {
      console.log(quizQuestions[i].answer);
      if (quizQuestions[i].answer === "") {
        toast.error("Missing answer for question");
        setIsLoading(false);
        return;
      }
    }

    const newQuiz = {
      quizTitle: quizTitle,
      quizDescription: quizDescription,
      quizMaxAttempts: quizMaxAttempts,
      visibility: visibility,
      courseId: courseid,
    };
    let newQuizId = null;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/course/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuiz),
    });
    if (response.ok) {
      const responseData = await response.json();
      newQuizId = responseData.message.split("id").splice(1, 1).join().split(" ")[1];
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return;
    }

    let newQuizQuestions = [];
    for (let i = 0; i < quizQuestions.length; i++) {
      const newQuizQuestion = { ...quizQuestions[i], courseId: courseid, quizId: newQuizId };
      newQuizQuestions.push(newQuizQuestion);
    }

    try {
      console.log(newQuizQuestions);
      fetch(`${import.meta.env.VITE_API_URL}/course/quiz/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuizQuestions),
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("An unexpected error occurred during quiz creation");
      return;
    }

    if (response) {
      navigate(`/teacher/course/${courseid}/quiz`);
      toast.success("Quiz created successfully");
    }
  }

  const addQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        qnNumber: qnNumber,
        question: "",
        questionOptionType: "MCQ",
        options: [", '', '', '"],
        answer: "",
      },
    ]);
    setQnNumber(qnNumber + 1);
  };

  const handleQuestionChange = (qnInfo) => {
    const newQuizQuestions = quizQuestions.map((qn) => {
      console.log(qnInfo);
      if (qn.qnNumber === qnInfo.qnNumber) {
        return qnInfo;
      }
      return qn;
    });
    setQuizQuestions(newQuizQuestions);
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
              New Quiz
            </Typography>
            <form onSubmit={createQuiz}>
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
                console.log(question)
                return (
                  <>
                    <Card variant="outlined" sx={{ boxShadow: "none", mt: 3, p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Question {question.qnNumber}
                      </Typography>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={9}>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Box sx={{ mr: 2 }}>
                              {/* <Typography variant="subsubtitle" sx={{ mb: 1 }}>Question Image</Typography> */}
                              {question.qnImage && (
                                <img src={question.qnImage} height="100" width="100" />
                              )}
                            </Box>
                            <Box>
                              <Typography variant="subsubtitle">Question</Typography>
                              <Typography variant="body1">
                                {question.question}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <Typography variant="subsubtitle" sx={{ mb: 1 }}>Question Type</Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {question.questionOptionType == "multiple-choice" ? "Multiple Choice" : question.questionOptionType == "true-false" ? "True or False" : ""}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <Typography variant="subsubtitle" sx={{ mb: 1 }}>Question Answer</Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {question.answer}
                          </Typography>
                        </Grid>

                      <Grid item xs={12}>
                        {question.questionOptionType == "multiple-choice" && (
                          <Grid item xs={12} sm={12} md={12}>
                            <Typography variant="subsubtitle" sx={{ mb: 1 }}>Question Options</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {question.options.map((option, key) => {
                                return (
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="body1" sx={{ mr: 1 }}>
                                      {option}
                                    </Typography>
                                    {question.answer == option && (
                                      <CheckCircleOutlineIcon sx={{ color: "success.main" }} />
                                    )}
                                  </Box>
                                );
                              })}
                            </Typography>
                          </Grid>
                        )}
                        {question.questionOptionType == "true-false" && (
                          <Grid item xs={12} sm={12} md={12}>
                            <Typography variant="subsubtitle" sx={{ mb: 1 }}>Question Options</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                  True
                                </Typography>
                                {question.answer == "True" && (
                                  <CheckCircleOutlineIcon sx={{ color: "success.main" }} />
                                )}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                  False
                                </Typography>
                                {question.answer == "False" && (
                                  <CheckCircleOutlineIcon sx={{ color: "success.main" }} />
                                )}
                              </Box>
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                      </Grid>
                      <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
                        <Button variant="outlined" fullWidth sx={{ color: "primary.main" }} onClick={() => editQuestion(key)}>Edit Question</Button>
                        <Button variant="outlined" fullWidth color="error" sx={{ ml: 2,  color: "error.main" }} onClick={() => deleteQuestion(key)}>Delete Question</Button>
                      </Box>
                    </Card>
                  </>
                );
              })}
              <Button variant="outlined" color="success" fullWidth sx={{ color: "success.main", mt: 2 }} onClick={addQuestion}>
                Add Question
              </Button>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    navigate(`/teacher/course/${courseid}/quiz`);
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