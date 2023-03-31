import { Box, Button, Card, Container, Divider, FormControlLabel, FormLabel, InputLabel, Link, Radio, RadioGroup, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";
import Loader from "../../../utils/Loader";

const TeacherHomeworkOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { homeworkId } = useParams();
  const [course, setCourse] = useState({});
  const [homework, setHomework] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState("");

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
    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);
  const getHomeworkAPI = request(`/course/homework?courseId=${courseid}&homeworkId=${homeworkId}`);

  useEffect(() => {
    async function fetchData() {
      const [data1, data2] = await Promise.all([getCourseAPI, getHomeworkAPI]);

      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      let formattedDueDate = new Date(data2.HomeworkDueDate).toLocaleDateString() + " " + new Date(data2.HomeworkDueDate).toLocaleTimeString();
      let formattedAssignedDate = new Date(data2.HomeworkAssignedDate).toLocaleDateString() + " " + new Date(data2.HomeworkAssignedDate).toLocaleTimeString();

      let homeworkData = {
        id: data2.SK.split("#")[1],
        name: data2.HomeworkName,
        description: data2.HomeworkDescription,
        dueDate: formattedDueDate,
        assignedDate: formattedAssignedDate,
      };
      setHomework(homeworkData);
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

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <CustomBreadcrumbs
          root="/teacher"
          links={[
            { name: course.name, path: `/teacher/course/${courseid}/homework` },
            { name: homework.name, path: `/teacher/course/${courseid}/homework/${homeworkId}` },
          ]}
          breadcrumbEnding="Grade"
        />

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
            <Typography variant="subsubtitle" sx={{ mt: 1 }}>
              STUDENT NAME
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              TOM
            </Typography>
            <Typography variant="subsubtitle">FILE SUBMISSION</Typography>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              <Link>file_submission.jpeg</Link>
            </Typography>
            <Typography variant="body">I think the answer is Piano. Piano has white keys</Typography>
            <Divider sx={{ my: 3 }} />
            <FormLabel>HOMEWORK SCORE</FormLabel>
            <RadioGroup name="score" row>
              <FormControlLabel value="bad" control={<Radio size="small" />} label="1 - Bad" />
              <FormControlLabel value="poor" control={<Radio size="small" />} label="2 - Poor" />
              <FormControlLabel value="good" control={<Radio size="small" />} label="3 - Good" />
              <FormControlLabel value="very good" control={<Radio size="small" />} label="4 - Very Good" />
              <FormControlLabel value="excellent" control={<Radio size="small" />} label="5 - Excellent" />
            </RadioGroup>
            <InputLabel id="additional-comments" sx={{ mt: 1 }}>
              ADDITIONAL COMMENTS
            </InputLabel>
            <TextField variant="outlined" rows={7} multiline fullWidth sx={{ mt: 1 }} value={comments} onChange={handleCommentsChange} />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  navigate(`/teacher/course/${courseid}/homework/${homeworkId}`);
                }}>
                Cancel
              </Button>
              <Button variant="contained">Grade</Button>
            </Box>
          </Card>
        </Box>
        <br />
        <Loader open={isLoading} />
      </Container>
    </>
  );
};

export default TeacherHomeworkOverview;
