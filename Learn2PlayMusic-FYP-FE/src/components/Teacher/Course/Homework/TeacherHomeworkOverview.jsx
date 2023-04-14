import { Box, Card, Container, Divider, Link, Typography, useTheme } from "@mui/material";
import MaterialReactTable from "material-react-table";
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
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const getCourseStudentsAPI = request(`/course/student?courseId=${courseid}`);
  const getHomeworkAPI = request(`/course/homework?courseId=${courseid}&homeworkId=${homeworkId}`);
  const getHomeworkFeedbackAPI = request(`/course/homework/feedback?courseId=${courseid}&homeworkId=${homeworkId}`);

  https: useEffect(() => {
    async function fetchData() {
      const [data1, data2, data3, data4] = await Promise.all([getCourseAPI, getHomeworkAPI, getHomeworkFeedbackAPI, getCourseStudentsAPI]);

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
        title: data2.HomeworkTitle,
        description: data2.HomeworkDescription,
        dueDate: formattedDueDate,
        assignedDate: formattedAssignedDate,
        totalSubmissions: data3.length,
        totalExpectedSubmissions: data4.length,
        percentageSubmission: +((data3.length / data4.length) * 100).toFixed(2),
      };
      setHomework(homeworkData);
      console.log(data3);

      const data = data3.map((homework) => {
        const studentId = homework.SK.split("#")[1].split("Homework")[0];
        const studentName = homework.StudentName;
        const homeworkScore = homework.HomeworkScore == 0 ? "-" : homework.HomeworkScore; // assuming that no students will get 0 (otherwise will need change db :/)
        const lastSubmissionDate = new Date(homework.LastSubmissionDate);
        const formattedLastSubmissionDate = `${lastSubmissionDate.toLocaleDateString()} ${lastSubmissionDate.toLocaleTimeString()}`;
        const reviewDate = !homework.ReviewDate ? null : new Date(homework.ReviewDate);
        const formattedReviewDate = reviewDate != null ? `${reviewDate.toLocaleDateString()} ${reviewDate.toLocaleTimeString()}` : "-";
        return {
          ...homework,
          LastSubmissionDate: formattedLastSubmissionDate,
          ReviewDate: formattedReviewDate,
          StudentId: studentId,
          StudentName: studentName,
          HomeworkScore: homeworkScore,
        };
      });
      setData(data);
      console.log(data);
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
        Cell: ({ cell, row }) => <Link onClick={() => navigate(`/teacher/course/${courseid}/homework/grade/${homeworkId}/${row.original.StudentId}`, { state: row.original })}>{row.original.StudentName}</Link>,
      },
      {
        accessorKey: "LastSubmissionDate",
        id: "submissionDate",
        header: "Submission Date",
      },
      {
        accessorKey: "HomeworkScore",
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
        <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/homework` }]} breadcrumbEnding={homework.title} />

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
        </Card>

        <Box>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {homework.title} - Overview
            </Typography>
            <Typography variant="body2">{homework.description}</Typography>
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
            <Typography variant="body2">
              {homework.totalSubmissions}/{homework.totalExpectedSubmissions} ({homework.percentageSubmission}%)
            </Typography>
            <Divider sx={{ my: 3 }}></Divider>

            <MaterialReactTable
              columns={columns}
              data={data}
              enableHiding={true}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              initialState={{ density: "compact" }}
              renderTopToolbarCustomActions={({ table }) => {}}
            ></MaterialReactTable>
          </Card>
        </Box>

        <Loader open={isLoading} />
      </Container>
    </>
  );
};

export default TeacherHomeworkOverview;
