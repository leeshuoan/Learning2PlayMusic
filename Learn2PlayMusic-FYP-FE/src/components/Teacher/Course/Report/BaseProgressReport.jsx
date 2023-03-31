import { Box, Card, Container, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";
import StudentProgressReport from "./StudentProgressReport";

const BaseProgressReport = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { userId } = useParams();
  const { reportId } = useParams();
  const [course, setCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(reportId == undefined ? "none" : reportId);
  const [progressReports, setProgressReports] = useState([]);
  const [studentName, setStudentName] = useState();

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // handle non-2xx HTTP status codes
      console.log(response);
      throw new Error(`${response}`);
    }

    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);
  const getReportAPI = request(`/course/report?courseId=${courseid}&studentId=${userId}`);
  const getClassListAPI = request(`/course/classlist?courseId=${courseid}`);

  useEffect(() => {
    async function fetchData() {
      let data1 = [],
        data2 = [],
        data3 = [];
      try {
        [data1, data2, data3] = await Promise.all([getCourseAPI, getReportAPI, getClassListAPI]);
      } catch (error) {
        console.log(error);
      }

      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      console.log(data2);
      const reportData = data2.map((report) => {
        const ReportId = report.SK.split("Report#")[1];
        const Available = new Date(report.AvailableDate) > new Date() ? false : true;
        return { ...report, ReportId, Available };
      });
      setProgressReports(reportData);

      const studentData = data3.filter((student) => student.studentId == userId);
      setStudentName(studentData[0].studentName);
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/classlist` }]} breadcrumbEnding="Progress Report" />
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

        <Box>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Progress Report
            </Typography>
            <Typography variant="subsubtitle" sx={{ mb: 0.5 }}>
              STUDENT NAME
            </Typography>
            <Typography variant="body2">{studentName}</Typography>
            <FormControl sx={{ mt: 3, mb: 1 }}>
              <InputLabel id="progress-report">Progress Report</InputLabel>
              <Select labelId="progress-report" id="progress-report" value={selected} label="progress-report" onChange={handleChange}>
                {selected === "none" && (
                  <MenuItem value="none" disabled>
                    Select Progress Report
                  </MenuItem>
                )}
                {progressReports.map((report, key) => {
                  return (
                    <MenuItem selected={report.ReportId == reportId} value={report.ReportId} key={key} onClick={() => navigate(`/teacher/course/${courseid}/report/${userId}/${report.ReportId}`)}>
                      {report.Title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {progressReports.map((report, key) => {
              return (
                <Box sx={{ display: report.ReportId == reportId ? "block" : "none" }} key={key}>
                  <StudentProgressReport report={report} courseId={courseid} userId={userId} reportId={reportId} />
                </Box>
              );
            })}
          </Card>
        </Box>
        <br />

        <Loader open={isLoading} />
      </Container>
    </>
  );
};

export default BaseProgressReport;
