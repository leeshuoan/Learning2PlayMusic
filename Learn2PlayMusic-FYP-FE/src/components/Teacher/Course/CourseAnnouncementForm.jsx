import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../utils/CustomBreadcrumbs";

export default function CourseAnnouncementForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [title, setTitle] = useState(state.title);
  const [content, setContent] = useState(state.content);
  var course = state.course;
  const endpoint = `${import.meta.env.VITE_API_URL}/course/announcement`;
  const { announcementId } = useParams();

  async function handleAddAnnouncement(title, content) {
    const body = JSON.stringify({
      courseId: course.id,
      content: content,
      title: title,
    });
    // add API Call here
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    return response;
  }
  async function handleEditAnnouncement(title, content) {
    const body = JSON.stringify({
      courseId: course.id,
      content: content,
      title: title,
      announcementId: announcementId,
    });
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    return response;
  }

  async function handleSubmit() {
    console.log(title);
    if (title == "" || content == "") {
      toast.error("Please fill in all the fields!");
      return;
    }
    if (state.title == "") {
      var response = handleAddAnnouncement(title, content)
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          if (res.message.includes("SUCCESS")) {
            toast.success("Announcement added successfully!");
            navigate(`/teacher/course/${course.id}/announcement`);
          } else {
            toast.error(res.message);
          }
        });
    } else {
      var response = handleEditAnnouncement(title, content)
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          if (res.message.includes("SUCCESS")) {
            toast.success("Announcement updated successfully!");
            navigate(`/teacher/course/${course.id}/announcement`);
          } else {
            toast.error(res.message);
          }
        });
    }
  }

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${course.id}` }]} breadcrumbEnding="Announcement" />
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" sx={{ color: "primary.main" }}>
              {course.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Timeslot: {course.timeslot}
            </Typography>
          </Box>
        </Box>
      </Card>
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Container maxWidth="xl">
            <Typography variant="h5" sx={{ color: "primary", mt: 3 }}>
              {state.title == "" ? "New" : "Edit"} Announcement
            </Typography>

            <TextField
              required
              fullWidth
              id="title"
              label="Title"
              variant="outlined"
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              sx={{ mt: 3 }}
            />

            <TextField
              required
              fullWidth
              id="content"
              label="Description"
              variant="outlined"
              defaultValue={content}
              multiline
              rows={10}
              onChange={(event) => {
                setContent(event.target.value);
              }}
              sx={{ mt: 3 }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 1 }}>
              <Button
                variant="outlined"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  navigate(`/teacher/course/${course.id}`);
                }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                {state.title == "" ? "Post" : "Update"}
              </Button>
            </Box>
          </Container>
        </Box>
      </Card>
    </Container>
  );
}
