import { Backdrop, Box, Button, Card, CircularProgress, Container, Divider, FormControlLabel, FormLabel, InputLabel, Radio, RadioGroup, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import celebration from "../../../../assets/celebration.png";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";
import TransitionModal from "../../../utils/TransitionModal";

const TeacherHomeworkOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const locate = useLocation();
  const { courseid } = useParams();
  const { homeworkId } = useParams();
  const [course, setCourse] = useState({});
  const [homework, setHomework] = useState({});
  const [homeworkFeedback, setHomeworkFeedback] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState("");
  const [grade, setGrade] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

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
  const getHomeworkAPI = request(`/course/homework?courseId=${courseid}&homeworkId=${homeworkId}`);
  const getHomeworkFeedbackAPI = request(`/course/homework/feedback?courseId=${courseid}&homeworkId=${homeworkId}&studentId=${locate.state.StudentId}`);

  useEffect(() => {
    async function fetchData() {
      const [data1, data2, data3] = await Promise.all([getCourseAPI, getHomeworkAPI, getHomeworkFeedbackAPI]);

      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      let formattedDueDate = new Date(data2.HomeworkDueDate).toLocaleDateString() + " " + new Date(data2.HomeworkDueDate).toLocaleTimeString();
      let formattedAssignedDate = new Date(data2.HomeworkAssignedDate).toLocaleDateString() + " " + new Date(data2.HomeworkAssignedDate).toLocaleTimeString();

      let homeworkData = {
        id: data2.SK.split("#")[1],
        name: data2.HomeworkTitle,
        description: data2.HomeworkDescription,
        dueDate: formattedDueDate,
        assignedDate: formattedAssignedDate,
      };
      setHomework(homeworkData);

      let homeworkFeedbackData = {
        attachment: data3.HomeworkAttachment,
        filename: data3.SubmissionFileName,
      };
      setHomeworkFeedback(homeworkFeedbackData);
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  var isButtonDisabled = comments === "" || grade === "";

  function buildRequestBody() {
    const requestBodyObject = {
      courseId: courseid,
      studentId: locate.state.StudentId,
      homeworkId: homeworkId,
      homeworkScore: parseInt(grade),
      teacherComments: comments,
    };
    return JSON.stringify(requestBodyObject);
  }

  const submit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/course/homework/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: buildRequestBody(),
    })
      .then((response) => {
        setSubmitted(true);
        setOpen(false);
      })
      .catch((error) => {
      });
  };

  return (
    <>
      <TransitionModal open={open} handleClose={handleClose}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Submit {locate.state.StudentName}'s Grade?
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
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={submit}>
            Yes
          </Button>
        </Box>
      </TransitionModal>

      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs
          root="/teacher"
          links={[
            { name: course.name, path: `/teacher/course/${courseid}/homework` },
            {
              name: homework.name,
              path: `/teacher/course/${courseid}/homework/${homeworkId}`,
            },
          ]}
          breadcrumbEnding="Grade"
        />

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

        <Box sx={{ display: submitted ? "none" : "block" }}>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="subsubtitle" sx={{ mt: 1 }}>
              {" "}
              STUDENT NAME{" "}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {" "}
              {locate.state.StudentName}{" "}
            </Typography>
            <Typography variant="subsubtitle">FILE SUBMISSION</Typography>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <a href={homeworkFeedback.attachment} target="_blank">
                  {homeworkFeedback.filename}
                </a>
              </Typography>
            </Typography>
            <Typography variant="subsubtitle" sx={{ mt: 1 }}>
              {" "}
              HOMEWORK CONTENT{" "}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {" "}
              {locate.state.HomeworkContent}{" "}
            </Typography>
            <Divider sx={{ my: 3 }} />
            <FormLabel>HOMEWORK SCORE</FormLabel>
            <RadioGroup name="score" row value={grade} onChange={handleGradeChange}>
              <FormControlLabel value="1" control={<Radio size="small" />} label="1 - Bad" />
              <FormControlLabel value="2" control={<Radio size="small" />} label="2 - Poor" />
              <FormControlLabel value="3" control={<Radio size="small" />} label="3 - Good" />
              <FormControlLabel value="4" control={<Radio size="small" />} label="4 - Very Good" />
              <FormControlLabel value="5" control={<Radio size="small" />} label="5 - Excellent" />
            </RadioGroup>
            <InputLabel id="additional-comments" sx={{ mt: 1 }}>
              {" "}
              ADDITIONAL COMMENTS{" "}
            </InputLabel>
            <TextField variant="outlined" rows={7} multiline fullWidth sx={{ mt: 1 }} value={comments} onChange={handleCommentsChange} />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  navigate(`/teacher/course/${courseid}/homework/${homeworkId}`);
                }}>
                Cancel
              </Button>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)} disabled={isButtonDisabled}>
                Submit Grade
              </Button>
            </Box>
          </Card>
        </Box>

        <Box sx={{ display: submitted ? "block" : "none" }}>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {homework.name}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src={celebration}></img>
            </Box>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Grade Submission Successful!
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button variant="contained" onClick={() => navigate(`/teacher/course/${courseid}/homework/${homeworkId}`)}>
                Back to Homework
              </Button>
            </Box>
          </Card>
        </Box>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => {
            setOpen(false);
          }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <br />
        <Loader open={isLoading} />
      </Container>
    </>
  );
};

export default TeacherHomeworkOverview;
