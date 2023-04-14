import { Box, Button, Card, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";

const ViewCourseMaterialsForm = ({ userInfo }) => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { materialid } = useParams();

  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({});
  const [courseMaterial, setCourseMaterial] = useState({
    MaterialLink: "",
    MaterialLessonDate: "",
    MaterialType: "",
    MaterialAttachment: "",
    MaterialTitle: "",
    MaterialAttachmentFileName: "",
  });

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
    async function fetchData() {
      const [data1, data] = await Promise.all([getCourseAPI, getMaterialAPI]);
      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      var dateObj = new Date(data.MaterialLessonDate);
      const materialData = {
        MaterialLessonDate: `${dateObj.toLocaleDateString()}`,
        MaterialLink: data.MaterialLink,
        MaterialType: data.MaterialType,
        MaterialAttachment: data.MaterialAttachment,
        MaterialTitle: data.MaterialTitle,
        MaterialAttachmentFileName: data.MaterialAttachmentFileName,
      };
      setCourseMaterial(materialData);
      console.log(courseData);
      console.log(materialData);
    }
    fetchData().then(() => setOpen(false));
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
              View Class Material
            </Typography>

            {/* view */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Title
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {courseMaterial.MaterialTitle}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {courseMaterial.MaterialLessonDate}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Attachment
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {courseMaterial.MaterialType != "PDF" ? (
                  <a href={courseMaterial.MaterialLink} target="_blank">
                    {courseMaterial.MaterialLink}
                  </a>
                ) : (
                  <a href={courseMaterial.MaterialAttachment} target="_blank">
                    {courseMaterial.MaterialAttachmentFileName}
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
      <Loader open={open} />
    </Container>
  );
};

export default ViewCourseMaterialsForm;
