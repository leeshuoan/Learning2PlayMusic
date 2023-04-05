import ClearIcon from "@mui/icons-material/Clear";
import UploadIcon from "@mui/icons-material/Upload";
import { Backdrop, Box, Button, Card, CircularProgress, Container, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import celebration from "../../../assets/celebration.png";
import CustomBreadcrumbs from "../../utils/CustomBreadcrumbs";
import TransitionModal from "../../utils/TransitionModal";

const UserHomework = (userInfo) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { homeworkId } = useParams();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [base64Attachment, setBase64Attachment] = useState("");
  const [course, setCourse] = useState({});
  const [homework, setHomework] = useState({});
  const [studentHomeworkFeedback, setStudentHomeworkFeedback] = useState({});
  const [hasPastSubmission, setHasPastSubmission] = useState(false)
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");
  const handleClose = () => setOpen(false);

  // file handling
  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(null, reader.result);
    reader.onerror = (error) => callback(error, null);
  };

  const fileUploaded = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    fileToBase64(e.target.files[0], (err, result) => {
      if (result) {
        setBase64Attachment(result);
      }
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName(null);
    setBase64Attachment("");
  };

  // helper functions
  function buildRequestBody() {
    const requestBodyObject = {
      courseId: courseid,
      studentId: userInfo.userInfo.id,
      homeworkId: homeworkId,
      homeworkAttachment: base64Attachment,
      homeworkContent: textFieldValue,
    };
    return JSON.stringify(requestBodyObject);
  }

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
  const getHomeworkFeedbackAPI = request(`/course/homework/feedback?courseId=${courseid}&homeworkId=${homeworkId}`); // reverse engineer, check if student is in the response, to determine if he/she has submitted hw before
  const getStudentHomeworkFeedbackAPI = request(`/course/homework/feedback?courseId=${courseid}&homeworkId=${homeworkId}&studentId=${userInfo.userInfo.id}`);

  useEffect(() => {
    async function fetchData() {
      const [data1, data2, data3, data4] = await Promise.all([getCourseAPI, getHomeworkAPI, getHomeworkFeedbackAPI, getStudentHomeworkFeedbackAPI]);

      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      let formattedDueDate =
        new Date(data2.HomeworkDueDate).toLocaleDateString() +
        " " +
        new Date(data2.HomeworkDueDate).toLocaleTimeString();
      let formattedAssignedDate =
        new Date(data2.HomeworkAssignedDate).toLocaleDateString() +
        " " +
        new Date(data2.HomeworkAssignedDate).toLocaleTimeString();

      let homeworkData = {
        id: data2.SK.split("#")[1],
        title: data2.HomeworkTitle,
        description: data2.HomeworkDescription,
        dueDate: formattedDueDate,
        assignedDate: formattedAssignedDate,
      };
      setHomework(homeworkData);

      data3.forEach((hwFeedback) => {
        var currentStudentId = hwFeedback.SK.split("Student#")[1].split("Homework#")[0]
        if (currentStudentId == userInfo.userInfo.id) {
          setHasPastSubmission(true);

          let studentHomeworkFeedback = {
            attachment: data4.HomeworkAttachment,
            submissionFileName: data4.SubmissionFileName
          };
          setStudentHomeworkFeedback(studentHomeworkFeedback);
        }
      });

    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);
  const handleTextFieldChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  var isButtonDisabled = textFieldValue === "" && file === null;

  const submit = () => {

    fetch(`${import.meta.env.VITE_API_URL}/course/homework/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: buildRequestBody(),
    })
      .then((response) => {
        console.log(response);
        setSubmitted(true);
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };

  return (
    <>
      <TransitionModal open={open} handleClose={handleClose}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Submit your homework?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "lightgrey",
              color: "black",
              boxShadow: theme.shadows[10],
              ":hover": { backgroundColor: "hovergrey" },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={submit}>
            Yes
          </Button>
        </Box>
      </TransitionModal>

      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs
          root="/home"
          links={[
            { name: course.name, path: `/home/course/${courseid}/homework` },
          ]}
          breadcrumbEnding={homework.title}
        />

        <Card
          sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}
        >
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

        <Box sx={{ display: submitted ? "none" : "block" }}>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {homework.title}
            </Typography>
            <Typography variant="body2">{homework.description}</Typography>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-start" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  ASSIGNED DATE
                </Typography>
                <Typography variant="body2">{homework.assignedDate}</Typography>
              </Box>
              <Box sx={{ ml: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  DUE DATE
                </Typography>
                <Typography variant="body2">{homework.dueDate}</Typography>
              </Box>
            </Box>
            {hasPastSubmission ? (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 0.5 }}>FILE SUBMISSION</Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <a
                      href={studentHomeworkFeedback.attachment}
                      target="_blank"
                    >
                      {studentHomeworkFeedback.submissionFileName}
                    </a>
                  </Typography>
                </Typography>
              </>
            ) : (
              ""
            )}
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 0.5 }}>
              UPLOAD FILE
            </Typography>
            {file == null ? (
              <Button
                variant="contained"
                sx={{
                  mb: 1,
                  backgroundColor: "lightgrey",
                  color: "black",
                  boxShadow: "none",
                  ":hover": { backgroundColor: "hovergrey" },
                }}
                component="label"
              >
                ADD A FILE
                <input
                  hidden
                  accept="application/pdf, image/*"
                  multiple
                  type="file"
                  onChange={fileUploaded}
                />
              </Button>
            ) : (
              // remove button to upload after uploading one file
              <></>
            )}

            {file ? (
              <div>
                <Typography
                  variant="body2"
                  style={{ textDecoration: "underline" }}
                >
                  <IconButton onClick={handleRemoveFile}>
                    <ClearIcon />
                  </IconButton>

                  {file.name}
                </Typography>
              </div>
            ) : (
              <Typography variant="body2">No file uploaded yet</Typography>
            )}

            <br />
            <TextField
              label="Add Text"
              variant="outlined"
              rows={7}
              multiline
              fullWidth
              sx={{ mt: 1 }}
              value={textFieldValue}
              onChange={handleTextFieldChange}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => setOpen(true)}
              disabled={isButtonDisabled}
            >
              <UploadIcon />
              SUBMIT
            </Button>
          </Card>
        </Box>

        <Box sx={{ display: submitted ? "block" : "none" }}>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {homework.title}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src={celebration}></img>
            </Box>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Submission Successful!
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/home/course/${course.id}/homework`)}
              >
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
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};

export default UserHomework;
