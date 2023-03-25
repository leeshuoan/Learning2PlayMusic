import { Backdrop, Box, Button, Card, CircularProgress, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";

const ViewCourseMaterialsForm = () => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { materialid } = useParams();

  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({});
  const [date, setDate] = useState(null);
  const [embeddedLink, setEmbeddedLink] = useState("");
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [s3Url, setS3Url] = useState(""); // s3 link

  // todo : handle when there is already an s3 link for the material

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
  const getMaterialAPI = request(`/course/material?courseId=${courseid}&materialId=${materialid}`);

  useEffect(() => {
    //  the page is not rendering properly when the data is fetched in the useEffect, help me fix this

    async function fetchData() {
      const [data1, data2] = await Promise.all([getCourseAPI, getMaterialAPI]);

      console.log(data1[0]);
      console.log(data2);
      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      let fetchedDate = data2.MaterialLessonDate.split("T")[0];
      setTitle(data2.MaterialTitle);
      setEmbeddedLink(data2.MaterialLink);
      console.log(data2.MaterialLink);
      setS3Url(data2.MaterialAttachment);
      setFileName(data2.MaterialAttachmentFileName);
      setDate(fetchedDate);
      console.log(fetchedDate);
    }
    fetchData().then(() => {
      setOpen(false);
    });
  }, []);

  // ========================================================================================================================
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      {/* breadcrumbs */}
      <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/material` }]} breadcrumbEnding="Class Materials" />
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
              New Class Material
            </Typography>

            {/* view */}

            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Title
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {date}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Attachment
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {embeddedLink != "" ? (
                  <a href={"//" + embeddedLink} target="_blank">
                    {embeddedLink}
                  </a>
                ) : (
                  <a href={s3Url} target="_blank">
                    {fileName}
                  </a>
                )}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 1 }}>
                <Button
                  variant="outlined"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    navigate(`/teacher/course/${courseid}/material`);
                  }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(`/teacher/course/${courseid}/material/edit/${materialid}`);
                  }}>
                  Edit
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Card>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default ViewCourseMaterialsForm;