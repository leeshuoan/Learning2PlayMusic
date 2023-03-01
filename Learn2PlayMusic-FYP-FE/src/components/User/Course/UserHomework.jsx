import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useTheme,
  Typography,
  Container,
  Card,
  Box,
  TextField,
  Link,
  Button,
  Breadcrumbs,
  Backdrop,
  IconButton,
  CircularProgress,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/Upload";
import TransitionModal from "../../utils/TransitionModal";
import celebration from "../../../assets/celebration.png";

const UserHomework = () => {
  const homework = {
    id: 1,
    title: "Homework 1",
    assignedDate: "1 feb 2023, 23:59pm ",
    dueDate: "10 feb 2023, 23:59pm",
  };

  const theme = useTheme();
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { homeworkId } = useParams();
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");
  const handleClose = () => setOpen(false);

  const handleTextFieldChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  var isButtonDisabled = textFieldValue === "" && file === null;

  const submit = () => {
    setSubmitted(true);
    setOpen(false);
  };

  const fileUploaded = (e) => {
    setFile(e.target.files[0].name);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let courseData = {
          id: data[0].SK.split("#")[1],
          name: data[0].CourseName,
          timeslot: data[0].CourseSlot,
        };
        setCourse(courseData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

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
              navigate(`/home/course/${courseid}/homework`);
            }}>
            {course.name}
          </Link>
          <Typography color="text.primary">Homework</Typography>
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

        <Box sx={{ display: submitted ? "none" : "block" }}>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {homework.title}
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed
              delectus nostrum non rerum ut temporibus maiores totam molestias,
              quas unde eius officiis repellat, illum repudiandae earum,
              consectetur dicta facere ipsam.
            </Typography>
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
                component="label">
                ADD A FILE
                <input
                  hidden
                  accept="*"
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
                  style={{ textDecoration: "underline" }}>
                  <IconButton onClick={handleRemoveFile}>
                    <ClearIcon />
                  </IconButton>

                  {file}
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
              sx={{ mt: 4 }}
              value={textFieldValue}
              onChange={handleTextFieldChange}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => setOpen(true)}
              disabled={isButtonDisabled}>
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
                onClick={() => navigate("/home/course/1/homework")}>
                Back to Homework
              </Button>
            </Box>
          </Card>
        </Box>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => { setOpen(false) }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};

export default UserHomework;
