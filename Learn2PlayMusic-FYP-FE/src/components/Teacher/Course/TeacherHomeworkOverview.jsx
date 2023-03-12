import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme, Typography, Container, Card, Box, Divider, Link, Button, Breadcrumbs, Backdrop, IconButton, CircularProgress } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import MaterialReactTable from "material-react-table";

const TeacherHomeworkOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { homeworkId } = useParams();
  const [course, setCourse] = useState({});
  const [homework, setHomework] = useState({});
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
        assignedDate: formattedAssignedDate
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
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mt: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              navigate("/teacher");
            }}>
            <HomeIcon sx={{ mr: 0.5 }} />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => {
              navigate(`/teacher/course/${courseid}/homework`);
            }}>
            {course.name}
          </Link>
          <Typography color="text.primary">{homework.name}</Typography>
        </Breadcrumbs>

        <Card
          sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
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
              {homework.name} - Overview
            </Typography>
            <Typography variant="body2">
              {homework.description}
            </Typography>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-start" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  ASSIGNED DATE
                </Typography>
                <Typography variant="body2">{homework.assignedDate}</Typography>
              </Box>
              <Box sx={{ ml: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  DUE DATE
                </Typography>
                <Typography variant="body2">{homework.dueDate}</Typography>
              </Box>
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
              NUMBER OF SUBMISSIONS
            </Typography>
            <Typography variant="body2">0/1000 (0%)</Typography>
            <Divider sx={{ my: 3 }}></Divider>

            <MaterialReactTable columns={columns} data={data} enableHiding={false} enableFullScreenToggle={false} enableDensityToggle={false} initialState={{ density: "compact" }} renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
          </Card>
        </Box>


        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};

export default TeacherHomeworkOverview;
