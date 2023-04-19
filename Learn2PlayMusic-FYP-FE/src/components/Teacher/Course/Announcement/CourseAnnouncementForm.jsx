import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";
import ViewCourseAnnouncementForm from "./ViewCourseAnnouncement";

export default function CourseAnnouncementForm({ userInfo }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalAnnouncement, setOriginalAnnouncement] = useState({ title: "", content: "" });
  const [course, setCourse] = useState({ id: "", name: "", timeslot: "", teacher: "" });
  const endpoint = `${import.meta.env.VITE_API_URL}/course/announcement`;
  const { courseid } = useParams();
  const { announcementId } = useParams();
  const { type } = useParams();
  const headers = {
    "Content-Type": "application/json",
  };
  async function handleAddAnnouncement(title, content) {
    const body = JSON.stringify({
      courseId: courseid,
      content: content,
      title: title,
    });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: body,
    });

    return response;
  }
  async function handleEditAnnouncement(title, content) {
    const body = JSON.stringify({
      courseId: courseid,
      content: content,
      title: title,
      announcementId: announcementId,
    });
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: headers,
      body: body,
    });
    return response;
  }

  async function handleSubmit() {
    setOpen(true);
    if (title == "" || content == "") {
      toast.error("Please fill in all the fields!");
      setOpen(false);
      return;
    }
    if (type == "new") {
      var response = handleAddAnnouncement(title, content)
        .then((response) => response.json())
        .then((res) => {
          if (res.message.includes("SUCCESS")) {
            toast.success("Announcement added successfully!");
            navigate(`/teacher/course/${courseid}/announcement`);
          } else {
            toast.error(res.message);
            setOpen(false);
          }
        });
    } else {
      if (title == originalAnnouncement.title && content == originalAnnouncement.content) {
        toast.error("Please make changes to at least one field!");
        setOpen(false);
        return;
      }
      var response = handleEditAnnouncement(title, content)
        .then((response) => response.json())
        .then((res) => {
          if (res.message.includes("SUCCESS")) {
            toast.success("Announcement updated successfully!");
            navigate(`/teacher/course/${courseid}/announcement`);
          } else {
            toast.error(res.message);
            setOpen(false);
          }
        });
    }
    return;
  }

  useEffect(() => {
    async function fetchData() {
      fetch(`${import.meta.env.VITE_API_URL}/course/?courseId=${courseid}`, { method: "GET", headers: headers })
        .then((response) => {
          if (response.status == 404) {
            toast.error("Course not found!");
            navigate("/teacher");
            return;
          } else if (!response.ok) {
            toast.error("Something went wrong!");
            navigate("/teacher");
            return;
          }
          return response.json();
        })
        .then((res) => {
          (res);
          const courseData = {
            id: res[0].SK.split("#")[1],
            name: res[0].CourseName,
            timeslot: res[0].CourseSlot,
            teacher: res[0].TeacherName,
          };
          setCourse(courseData);
          setOpen(false);
        });
      if (type == "edit") {
        fetch(`${endpoint}?courseId=${courseid}&announcementId=${announcementId}`, { method: "GET", headers: headers })
          .then((response) => {
            if (response.status == 404) {
              toast.error("Announcement not found!");
              navigate(`/teacher/course/${courseid}/announcement`);
              return;
            } else if (!response.ok) {
              toast.error("Something went wrong!");
              navigate(`/teacher/course/${courseid}/announcement`);
              return;
            }
            return response.json();
          })
          .then((res) => {
            setOriginalAnnouncement({ title: res[0].Title, content: res[0].Content });
            setTitle(res[0].Title);
            setContent(res[0].Content);
            setOpen(false);
          })
          .catch((error) => {
            setOpen(false);
          });
      }
    }
    fetchData().then(() => {});
  }, []);
  if (type == "view") {
    return <ViewCourseAnnouncementForm userInfo={userInfo}></ViewCourseAnnouncementForm>;
  }
  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}` }]} breadcrumbEnding="Announcement" />
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
                {type != "edit" ? "New" : "Edit"} Announcement
              </Typography>

              <TextField
                required
                fullWidth
                id="title"
                label="Title"
                variant="outlined"
                value={title}
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
                value={content}
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
                    navigate(`/teacher/course/${courseid}`);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                  {type != "edit" ? "Post" : "Update"}
                </Button>
              </Box>
            </Container>
          </Box>
        </Card>
        <Loader open={open} />
      </Container>
    </>
  );
}
