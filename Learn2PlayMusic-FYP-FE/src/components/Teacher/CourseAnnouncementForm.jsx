import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Breadcrumbs,
  Card,
  Container,
  Typography,
  TextField,
  FormControl,
  Input,
  InputLabel,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useState } from "react";

export default function CourseAnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const course = state.course;

  function handleAddAnnouncement(title, content) {
    // add API Call here
    console.log(content);
    console.log(title);
  }
  function handleEditAnnouncement(title, content) {
    // add API Call here
    console.log(content);
    console.log(title);
  }

  const handleSubmit = () => {
    if (state.title == "") {
      handleAddAnnouncement(title, content);
    } else {
      handleEditAnnouncement(title, content);
    }
    setTitle("");
    setContent("");
    console.log(title, content);
    console.log(state);
    // navigate(`/teacher/course/${course.id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mt: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            navigate("/teacher");
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            navigate(`/teacher/course/${course.id}`);
          }}
        >
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
        <Box sx={{ display: "flex", alignItems: "center" }} component="form">
          <Box>
            <Typography variant="h5" sx={{ color: "primary" }}>
              {state.title == "" ? "New Announcement" : "Edit Announcement"}
            </Typography>

            <br></br>
            <FormControl fullWidth variant="standard">
              <InputLabel htmlFor="title">TITLE*</InputLabel>
              <Input
                id="title"
                defaultValue={state.title}
                onChange={() => {
                  setTitle(event.target.value);
                }}
              />
            </FormControl>
            <br></br>
            <br></br>
            <FormControl fullWidth variant="standard">
              <InputLabel htmlFor="description">DESCRIPTION*</InputLabel>
              <Input
                id="description"
                defaultValue={state.description}
                onChange={() => {
                  setContent(event.target.value);
                }}
              />
            </FormControl>

            <Button variant="contained" onClick={handleSubmit}>
              {state.title == "" ? "Add" : "Edit"}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
