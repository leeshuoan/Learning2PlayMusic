import { Box, Button, Card, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";

const ViewCourseAnnouncementForm = ({ userInfo }) => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { announcementId } = useParams();

  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({});
  const [date, setDate] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
  const getAnnouncementAPI = request(`/course/announcement?courseId=${courseid}&announcementId=${announcementId}`);

  useEffect(() => {
    async function fetchData() {
      const [data1, data2] = await Promise.all([getCourseAPI, getAnnouncementAPI]);

      console.log(data1[0]);
      console.log(data2);
      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      const data = await getAnnouncementAPI;
      const date = new Date(data[0].Date);
      const formattedDate = date.toLocaleDateString();
      setDate(formattedDate);
      setTitle(data[0].Title);
      setContent(data[0].Content);

      setOpen(false);
    }
    fetchData();
  }, []);

  // ========================================================================================================================
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      {/* breadcrumbs */}
      <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/announcement` }]} breadcrumbEnding="Announcement" />
      {/* body */}
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
              View Announcement
            </Typography>
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Title
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Post Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {date}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Content
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {content}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 1 }}>
                <Button
                  variant="outlined"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    navigate(`/teacher/course/${courseid}/announcement`);
                  }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(`/teacher/course/${courseid}/announcement/edit/${announcementId}`);
                  }}>
                  Edit
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Card>
      <Loader open={open} />
    </Container>
  );
};

export default ViewCourseAnnouncementForm;
