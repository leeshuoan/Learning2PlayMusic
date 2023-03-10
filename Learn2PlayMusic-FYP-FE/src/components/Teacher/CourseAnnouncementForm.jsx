import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Button, Breadcrumbs, Card, Container, Typography, TextField, Link, Alert, Snackbar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useState } from "react";

export default function CourseAnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  var course = state.course;

  const closeAlert = () => {
    setAlert(false);
  };
  const openAlert = () => {
    setAlert(true);
  };

  async function handleAddAnnouncement(title, content) {
    // add API Call here
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        courseId: course.id,
        content: content,
        title: title,
      },
    });
    return response;
  }
  async function handleEditAnnouncement(title, content) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        courseId: course.id,
        content: content,
        title: title,
      },
    });
    return response;
  }

  async function handleSubmit() {
    if (title == "" || content == "") {
      openAlert();
      return;
    }
    if (state.title == "") {
      var response = await Promise(handleAddAnnouncement(title, content));
    } else {
      var response = await Promise(handleEditAnnouncement(title, content));
    }
    setTitle("");
    setContent("");

    if (response.status == 200) {
      navigate(`/teacher/course/${course.id}`);
    }
  }

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Snackbar open={alert} autoHideDuration={6000} onClose={closeAlert}>
        <Alert severity="error" sx={{ mt: 3 }} onClose={closeAlert}>
          <strong>Please fill in all the fields!</strong>
        </Alert>
      </Snackbar>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            navigate("/teacher");
          }}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            navigate(`/teacher/course/${course.id}`);
          }}>
          <Typography color="text.primary">{course.name}</Typography>
        </Link>
        <Typography color="text.primary">Announcement</Typography>
      </Breadcrumbs>
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
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Container maxWidth="xl">
            <Typography variant="h5" sx={{ color: "primary", mt: "10px" }}>
              {state.title == "" ? "New Announcement" : "Edit Announcement"}
            </Typography>
            <br></br>
            <TextField
              required
              fullWidth
              id="title"
              label="Title"
              variant="outlined"
              defaultValue={state.title}
              onChange={() => {
                setTitle(event.target.value);
              }}
            />
            <br></br>
            <br></br>
            <br></br>
            <TextField
              required
              fullWidth
              id="description"
              label="Description"
              variant="outlined"
              defaultValue={state.description}
              multiline
              rows={10}
              onChange={() => {
                setContent(event.target.value);
              }}
            />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mb: "5px" }}>
              {state.title == "" ? "Add" : "Edit"}
            </Button>
          </Container>
        </Box>
      </Card>
    </Container>
  );
}
