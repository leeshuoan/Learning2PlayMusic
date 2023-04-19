import { Backdrop, Box, Card, CircularProgress, Container, Grid, Link, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../utils/CustomBreadcrumbs";

const UserReport = (userInfo) => {
  const metricMapping = {
    posture: "Posture",
    rhythm: "Rhythm",
    toneQuality: "Tone Quality",
    dynamicsControl: "Dynamics Control",
    articulation: "Articulation",
    sightReading: "Sight-Reading",
    practice: "Practice and Lesson Preparation",
    theory: "Theory",
    scales: "Scales & Arpeggios",
    aural: "Aural Skills",
    musicality: "Musicality & Artistry",
    performing: "Performing",
    enthusiasm: "Enthusiasm in Music Learning",
    punctuality: "Punctuality",
    attendance: "Attendance",
  };

  const theme = useTheme();
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { reportId } = useParams();
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({});
  const [report, setReport] = useState({ EvaluationList: {} });
  const [submitted, setSubmitted] = useState(false);
  const handleClose = () => setOpen(false);

  const getCourseAPI = fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getReportAPI = fetch(`${import.meta.env.VITE_API_URL}/course/report?courseId=${courseid}&studentId=${userInfo.userInfo.id}&reportId=${reportId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    Promise.all([getCourseAPI, getReportAPI])
      .then(async ([res1, res2]) => {
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        let courseData = {
          id: data1[0].SK.split("#")[1],
          name: data1[0].CourseName,
          timeslot: data1[0].CourseSlot,
          teacher: data1[0].TeacherName,
        };
        setCourse(courseData);
        setReport(data2[0]);
        setOpen(false);
      })
      .catch((error) => {
        setOpen(false);
      });
  }, []);

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs root="/home" links={[{ name: course.name, path: `/home/course/${courseid}/report` }]} breadcrumbEnding={report.Title} />

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
        {report.GoalsForNewTerm == "" ? (
          <Box sx={{ display: submitted ? "none" : "block" }}>
            <Card sx={{ py: 3, px: 5, mt: 2 }}>
              Teacher has not provided feedback for you yet, you can message your teacher to ask for feedback through the <Link onClick={() => navigate("/chat")}>chat</Link>
            </Card>
          </Box>
        ) : (
          <Box sx={{ display: submitted ? "none" : "block" }}>
            <Card sx={{ py: 3, px: 5, mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {report.Title}
              </Typography>
              <Grid container sx={{ mb: 1 }}>
                {Object.keys(report.EvaluationList).map((key, index) => {
                  return (
                    <Grid item xs={6} sm={4} md={3} key={key}>
                      <Typography variant="subsubtitle" sx={{ mt: 1.5 }}>
                        {metricMapping[key]}
                      </Typography>
                      <Typography variant="body2">{report.EvaluationList[key]}</Typography>
                    </Grid>
                  );
                })}
              </Grid>
              <Typography variant="subsubtitle">Goals</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {report.GoalsForNewTerm}
              </Typography>
              <Typography variant="subsubtitle">Additional Comments</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {report.AdditionalComments}
              </Typography>
            </Card>
          </Box>
        )}
      </Container>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default UserReport;
