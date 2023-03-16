import { Backdrop, Box, Button, Card, CircularProgress, Container, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../utils/CustomBreadcrumbs";

const StudentProgressReport = () => {
  const metrics = {
    posture: "Posture",
    rhythm: "Rhythm",
    toneQuality: "Tone Quality",
    dynamicsControl: "Dynamic Control",
    articulation: "Articulation",
    sightReading: "Sight Reading",
    practice: "Reading",
    theory: "Theory",
    scales: "Scales",
    aural: "Aural",
    musicality: "Musicality",
    performing: "Performing",
    enthusiasm: "Enthusiasm",
    punctuality: "Punctuality",
    attendance: "Attendance",
  };
  const performance = ["Poor", "Weak", "Satisfactory", "Good", "Excellent", "N.A"];

  const theme = useTheme(); 
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { userId } = useParams();
  const { reportId } = useParams();
  const [course, setCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(reportId == undefined ? "none" : reportId);
  const [goals, setGoals] = useState();
  const [comments, setComments] = useState();
  const [progressReports, setProgressReports] = useState([]);
  const [studentName, setStudentName] = useState();
  const [selectedReport, setSelectedReport] = useState({});

  const handleGoalsChange = (event) => {
    setGoals(event.target.value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) { // handle non-2xx HTTP status codes
      console.log(response)
      throw new Error(`${response}`);
    }

    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);
  const getReportAPI = request(`/course/report?courseId=${courseid}&studentId=${userId}`);
  const getClassListAPI = request(`/course/classlist?courseId=${courseid}`);

  useEffect(() => {
    async function fetchData() {
      let data1 = [], data2 = [], data3 = [];
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

      const reportData = data2.map((report) => {
        const ReportId = report.SK.split("Report#")[1]
        const Available = new Date(report.AvailableDate) > new Date() ? false : true;
        if (reportId == ReportId) {
          setSelectedReport(report);
        }
        return { ...report, ReportId, Available };
      })
      setProgressReports(reportData)

      const studentData = data3.filter((student) => student.studentId == userId);
      setStudentName(studentData[0].studentName);
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "StudentName",
        id: "studentName",
        header: "Student Name",
      },
      {
        accessorKey: "SubmissionDate",
        id: "submissionDate",
        header: "SubmissionDate",
      },
      {
        accessorKey: "Score",
        id: "score",
        header: "Score",
      },
      {
        accessorKey: "ReviewDate",
        id: "reviewDate",
        header: "Review Date",
      },
    ],
    [course]
  );

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const selectReport  = (report) => {
    setSelectedReport(report);
    navigate(`/teacher/course/${courseid}/report/${userId}/${report.ReportId}`)
  }

  return (
    <>
      {console.log(selectedReport)}
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
            <Typography variant="body2">{ studentName }</Typography>
            <FormControl sx={{ mt: 3, mb: 1 }}>
              <InputLabel id="progress-report">Progress Report</InputLabel>
              <Select labelId="progress-report" id="progress-report" value={selected} label="progress-report" onChange={handleChange}>
                {selected === "none" && (
                  <MenuItem value="none" disabled>
                    Select Progress Report
                  </MenuItem>
                )}
                {progressReports.map((report, key) => {
                  return <MenuItem selected={report.ReportId == reportId} value={report.ReportId} key={key} onClick={() => selectReport(report)}>{report.Title}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <Box display={ selectedReport.Available && reportId != undefined ? "block" : "none"}>
              <Divider sx={{ my: 2 }} />
              {Object.keys(metrics).map((metric, key) => (
                <Box key={key}>
                  <FormLabel>{metrics[metric]}</FormLabel>
                  <RadioGroup name={metric} sx={{ mb: 1 }} row>
                    {performance.map((performance, key) => (
                      <FormControlLabel value={performance} key={key} control={<Radio size="small" />} label={performance} />
                    ))}
                  </RadioGroup>
                </Box>
              ))}
              <InputLabel id="goals-for-the-new-term" sx={{ mt: 2 }}>
                Goals for the New Term
              </InputLabel>
              <TextField variant="outlined" rows={7} multiline fullWidth sx={{ mt: 1, mb: 2 }} value={goals} onChange={handleGoalsChange} />
              <InputLabel id="additional-comments">Additional Comments</InputLabel>
              <TextField variant="outlined" rows={7} multiline fullWidth sx={{ mt: 1 }} value={comments} onChange={handleCommentsChange} />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Submit
                </Button>
              </Box>
            </Box>
            <Box display={ (Object.keys(selectedReport).length !== 0) && !selectedReport.Available && reportId != undefined ? "block" : "none"}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, color: "grey" }}>
                Not Available Yet
              </Typography>
            </Box>
          </Card>
        </Box>
        <br />

        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};

export default StudentProgressReport;
