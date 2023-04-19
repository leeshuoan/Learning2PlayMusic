import { Box, Button, Card, Container, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";
import NewQuizQuestion from "./NewQuizQuestion";

const NewQuiz = ({ userInfo }) => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [course, setCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizMaxAttempts, setQuizMaxAttempts] = useState(1);
  const [visibility, setVisibility] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([
    {
      questionNumber: 1,
      question: "",
      questionOptionType: "multiple-choice",
      options: ["", "", "", ""],
      answer: "",
    },
  ]);
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
      throw new Error(`${response}`);
    }

    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);

  useEffect(() => {
    async function fetchData() {
      let data1 = [],
        data2 = [],
        data3 = [];
      try {
        [data1] = await Promise.all([getCourseAPI]);
      } catch (error) {
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
    setIsLoading(true);

    e.preventDefault();

    // check the other fields
    let errorMsg = "";
    if (quizTitle === "") {
      errorMsg = "Please enter a quiz title.";
    }
    if (quizMaxAttempts === "") {
      errorMsg = "Please enter the max attempts for the quiz";
    }
    for (let i = 0; i < quizQuestions.length; i++) {
      if (quizQuestions[i].question === "") {
        errorMsg = "Please enter a question title for Question " + (i + 1) + ".";
      }
      //checkk if quizQuestions[i].options has empty string
      for (let j = 0; j < quizQuestions[i].options.length; j++) {
        if (quizQuestions[i].options[j].trim() == "") {
          errorMsg = "Please enter all options for the question.";
        }
      }
      if (quizQuestions[i].questionOptionType === "multiple-choice") {
        quizQuestions[i].options.map((option) => {
          return option.trim();
        });
        if (quizQuestions[i].options[0] === quizQuestions[i].options[1] || quizQuestions[i].options[0] === quizQuestions[i].options[2] || quizQuestions[i].options[0] === quizQuestions[i].options[3] || quizQuestions[i].options[1] === quizQuestions[i].options[2] || quizQuestions[i].options[1] === quizQuestions[i].options[3] || quizQuestions[i].options[2] === quizQuestions[i].options[3]) {
          errorMsg = "Please enter different options for the question.";
        }
      }
      if (quizQuestions[i].answer === "") {
        errorMsg = "Please select an answer for the question.";
      }
    }

    if (errorMsg !== "") {
      setIsLoading(false);
      toast.error(errorMsg);
      return;
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
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(newQuiz),
    });
    if (response.ok) {
      const responseData = await response.json();
      newQuizId = responseData.message.split("id").splice(1, 1).join().split(" ")[1];
    } else {
      toast.error(`Error: ${response.status} - ${response.statusText}, Please try again later.`);
      return;
    }
    let newQuizQuestions = [];
    for (let i = 0; i < quizQuestions.length; i++) {
      const { questionNumber, ...rest } = quizQuestions[i];
      const newQuizQuestion = { ...rest, courseId: courseid, quizId: newQuizId };
      newQuizQuestions.push(newQuizQuestion);
    }
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/course/quiz/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(newQuizQuestions),
      }).then((res) => {
        if (res.ok) {
          setIsLoading(false);
          toast.success("Quiz created successfully");
          navigate(`/teacher/course/${courseid}/quiz`);
        }
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("An unexpected error occurred during quiz creation");
      return;
    }
  }

  const addQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        questionNumber: questionNumber + 1,
        question: "",
        questionOptionType: "multiple-choice",
        options: [", '', '', '"],
        answer: "",
      },
    ]);
  };

  const handleQuestionChange = (qnInfo) => {
    const newQuizQuestions = quizQuestions.map((qn) => {
      if (qn.questionNumber === qnInfo.questionNumber) {
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
        </Card>

        <Box>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              New Quiz
            </Typography>
            <form onSubmit={createQuiz} noValidate>
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
                return <NewQuizQuestion key={key} questionNumber={questionNumber} qnInfo={question} handleQuestionChange={handleQuestionChange} />;
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
                  Create Quiz
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

export default NewQuiz;
