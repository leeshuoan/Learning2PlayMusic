import { useMemo, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Breadcrumbs, Backdrop, CircularProgress } from '@mui/material'
import MaterialReactTable from "material-react-table";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const UserCourse = (userInfo) => {
  const [open, setOpen] = useState(true)
  const [course, setCourse] = useState({})
  const [courseHomework, setCourseHomework] = useState([])
  const [courseMaterial, setCourseMaterial] = useState([])
  const [courseQuiz, setCourseQuiz] = useState([])

  const courseAnnouncements = [
    {
      title: "Change of lesson date",
      date: "31 Jan 2023",
      content: "Dear parents, the lesson date for 31 Jan 2023 has been changed to 1 Feb 2023. Please take note of this change. Thank you."
    },
    {
      title: "Change of lesson date",
      date: "31 Jan 2023",
      content: "Dear parents, the lesson date for 31 Jan 2023 has been changed to 1 Feb 2023. Please take note of this change. Thank you."
    },
  ]

  const courseQuizzes = [
    {
      id: 1,
      title: "Quiz 1",
      score: "80%",
      attempts: 1,
      maxAttempts: 1
    },
    {
      id: 2,
      title: "Quiz 2",
      score: "93%",
      attempts: 1,
      maxAttempts: 1
    },
    {
      id: 3,
      title: "Quiz 3",
      score: "",
      attempts: 0,
      maxAttempts: 1
    },
  ]

  const courseProgressReports = [
    {
      id: 1,
      title: "Progress Report 1",
      uploadDate: "31 Jun 2023",
    },
    {
      id: 2,
      title: "Progress Report 1",
      uploadDate: "31 Jun 2023",
    }
  ]

  const navigate = useNavigate()
  const { category } = useParams()
  const { courseid } = useParams()
  const menuOptions = ["Announcements", "Class Materials", "Quizzes", "Homework", "My Progress Report"]
  const routeMenuMapping = {
    "announcement": "Announcements",
    "material": "Class Materials",
    "quiz": "Quizzes",
    "homework": "Homework",
    "report": "My Progress Report"
  }

  const getCourseAPI = fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const getHomeworkAPI = fetch(`${import.meta.env.VITE_API_URL}/course/homework?courseId=${courseid}&studentId=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const getMaterialAPI = fetch(`${import.meta.env.VITE_API_URL}/course/material?courseId=${courseid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // const getQuizAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz?courseId=${courseid}&studentId=${userInfo.userInfo.id}`, {
  const getQuizAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz?courseId=${courseid}&studentId=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
})

  const columns = useMemo(
    () => [
      {
        accessorKey: "MaterialTitle",
        id: "title",
        header: "Title",
        Cell: ({ cell, row }) => (
          <>
            <Link onClick={() => {navigate(`/home/course/${courseid}/material/${row.original.id}`)}}>{row.original.MaterialTitle}</Link>
          </>
        ),
      },
      {
        accessorKey: "MaterialType",
        id: "type",
        header: "Type",
      },
      {
        accessorKey: "MaterialLessonDate",
        id: "lessonDate",
        header: "Lesson Date",
      },
    ],
    []
  );

  useEffect(() => {
    Promise.all([getCourseAPI, getHomeworkAPI, getMaterialAPI, getQuizAPI])
      .then(async ([res1, res2, res3, res4]) => {
        const [data1, data2, data3, data4] = await Promise.all([res1.json(), res2.json(), res3.json(), res4.json()]);

        let courseData = {
          id: data1[0].SK.split("#")[1],
          name: data1[0].CourseName,
          timeslot: data1[0].CourseSlot,
        };
        setCourse(courseData);

        for (let idx in data2) {
          data2[idx].id = data2[idx].SK.split("Homework#")[1].substr(0, 1);
          let date = new Date(data2[idx]['HomeworkDueDate']);
          let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          data2[idx]['HomeworkDueDate'] = formattedDate;
        }
        setCourseHomework(data2);

        for (let idx1 in data3) {
          data3[idx1].id = data3[idx1].SK.split("Material#")[1].substr(0, 1);
          let date_1 = new Date(data3[idx1]['MaterialLessonDate']);
          let formattedDate_1 = `${date_1.toLocaleDateString()} ${date_1.toLocaleTimeString()}`;
          data3[idx1]['MaterialLessonDate'] = formattedDate_1;
        }
        setCourseMaterial(data3);

        for (let idx2 in data4) {
          data4[idx2].id = data4[idx2].SK.split("Quiz#")[1].substr(0, 1);
          let date_2 = new Date(data4[idx2]['QuizDueDate']);
          let formattedDate_2 = `${date_2.toLocaleDateString()} ${date_2.toLocaleTimeString()}`;
          data4[idx2]['QuizDueDate'] = formattedDate_2;
        }
        setCourseQuiz(data4);

        setOpen(false);
      }).catch((error) => {
        setOpen(false)
      })

  }, [])

  const menuNavigate = (option) => {
    if (option == "Announcements") navigate(`/home/course/${course.id}/announcement`)
    if (option == "Class Materials") navigate(`/home/course/${course.id}/material`)
    if (option == "Quizzes") navigate(`/home/course/${course.id}/quiz`)
    if (option == "Homework") navigate(`/home/course/${course.id}/homework`)
    if (option == "My Progress Report") navigate(`/home/course/${course.id}/report`)
  }

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => { navigate('/home') }}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Typography color="text.primary">{course.name}</Typography>
      </Breadcrumbs>

      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography variant='h5' sx={{ color: "primary.main" }}>{course.name}</Typography>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>Date: {course.timeslot}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          <Box>
            <Typography variant='subtitle1' sx={{ mb: 0.5 }}>Miss Felicia Ng</Typography>
            <Typography variant='body2' sx={{ textAlign: "right" }}>Teacher</Typography>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={2} sx={{ pt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ py: 2, px: 3, mt: 2, display: { xs: "none", sm: "block" } }}>
            {menuOptions.map((option, key) => (
              <MenuItem key={key} sx={{ mb: 1, color: routeMenuMapping[category] == option ? "primary.main" : category === undefined && option == "Announcements" ? "primary.main" : "", "&:hover": { color: "primary.main" } }}
                onClick={() => menuNavigate(option)}>
                <Typography variant='subtitle1'>{option}</Typography>
              </MenuItem>
            ))}
          </Card>

          <Card sx={{ py: { sm: 1 }, px: 1, display: { xs: "block", sm: "none" } }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant='h5' sx={{ color: "primary.main" }}>
                    {category === undefined ? "Announcements" : routeMenuMapping[category]}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {menuOptions.map((option, key) => (
                  <MenuItem key={key} sx={{ mb: 0.5, color: routeMenuMapping[category] == option ? "primary.main" : category === undefined && option == "Announcements" ? "primary.main" : "", "&:hover": { color: "primary.main" } }}
                    onClick={() => menuNavigate(option)}>
                    <Typography variant='subtitle1'>{option}</Typography>
                  </MenuItem>
                ))}
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box>
            <Card sx={{ py: 3, px: 5, mt: 2, display: category == "announcement" ? "block" : category === undefined ? "block" : "none" }}>
              <Typography variant='h5'>Class Announcements</Typography>
              {courseAnnouncements.map((announcement, key) => (
                <Card key={key} variant='outlined' sx={{ boxShadow: "none", mt: 2, p: 2 }}>
                  <Typography variant='subtitle1' sx={{}}>{announcement.title}</Typography>
                  <Typography variant='subsubtitle' sx={{ mb: 1 }}>Posted {announcement.date}</Typography>
                  <Typography variant='body2'>{announcement.content}</Typography>
                </Card>
              ))}
            </Card>

            <Box sx={{ display: category == "material" ? "block" : "none" }}>
              <Box m={2}>
                <MaterialReactTable
                  columns={columns}
                  data={courseMaterial}
                  initialState={{ density: "compact" }}
                  renderTopToolbarCustomActions={({ table }) => {
                    return (
                      <Typography m={1} variant="h6">
                        Class Materials
                      </Typography>
                    );
                  }}></MaterialReactTable>
              </Box>
            </Box>

            <Box sx={{ display: category == "quiz" ? "block" : "none" }}>
              {courseQuiz.map((quiz, key) => (
                <Card key={key} sx={{ py: 3, px: 4, mt: 2 }}>
                  <Typography variant='h6' sx={{ mb: 1 }}>{quiz.QuizTitle}</Typography>
                  <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid item xs={12} sm={6}>
                      <Button variant="contained" onClick={() => { navigate(`${quiz.id}`) }}>
                        <PlayCircleFilledIcon sx={{ mr: 1 }} />
                        Start Quiz
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" }, color: "primary.main" }}>Score</Typography>
                      <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>{quiz.QuizScore * 100}%</Typography>
                      <Typography variant='body1' sx={{ display: { xs: "flex", sm: "none" } }}><span sx={{ color: "primary.main", mr: 0.5 }}>Score:</span>{quiz.QuizScore * 100}%</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant='body1' sx={{ textAlign: "center", color: 'primary.main', display: { xs: "none", sm: "block" } }}>Attempts</Typography>
                      <Typography variant='body1' sx={{ textAlign: "center", color: quiz.attempts == 0 ? 'grey' : '', display: { xs: "none", sm: "block" } }}>{quiz.QuizAttempt}/{quiz.QuizMaxAttempt}</Typography>
                      <Typography variant='body1' sx={{ color: quiz.attempts == 0 ? 'grey' : '', display: { xs: "flex", sm: "none" } }}><span sx={{ color: "primary.main", mr: 0.5 }}>Attempts:</span>{quiz.QuizAttempt}/{quiz.QuizMaxAttempt}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: category == "homework" ? "block" : "none" }}>
              <Grid container spacing={2} sx={{ px: 4, mt: 2, display: { xs: "none", sm: "flex" } }}>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>HOMEWORK TITLE</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>DUE DATE</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>SCORE</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>SUBMISSIONS</Typography>
                </Grid>
              </Grid>
              {
                courseHomework.map((homework, key) => (
                  <Card key={key} sx={{ py: 3, px: 4, mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant='body1' sx={{ color: "primary.main" }}><Link onClick={() => navigate("" + homework.id)}>{homework.HomeworkTitle}</Link></Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>{homework.HomeworkDueDate}</Typography>
                        <Typography variant='body1' sx={{ display: { xs: "block", sm: "none" } }}>Due Date: {homework.dueDate}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>{homework.HomeworkScore}</Typography>
                        <Typography variant='body1' sx={{ display: { xs: "block", sm: "none" } }}>Score: {homework.score}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" }, color: homework.submission == 0 ? 'grey' : '' }}>{homework.HomeworkSubmissions}</Typography>
                        <Typography variant='body1' sx={{ display: { xs: "block", sm: "none" }, color: homework.submission == 0 ? 'grey' : '' }}>Submissions: {homework.HomeworkSubmissions}</Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
            </Box>

            <Box sx={{ display: category == "report" ? "block" : "none" }}>
              <Card sx={{ py: 3, px: 4, mt: 2 }}>
                <Typography variant='subtitle1' sx={{ textAlign: "center" }}>Your Points</Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <EmojiEventsIcon fontSize="large" sx={{ color: '#FFB118' }} />
                  <Typography variant='h4'>203</Typography>
                </Box>
              </Card>
              <Card sx={{ py: 3, px: 5, mt: 2 }}>
                <Typography variant='h6' sx={{ textAlign: "center" }}>My Progress Report</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant='subtitle1' sx={{ textAlign: "center", ml: 2 }}>TITLE</Typography>
                  <Typography variant='subtitle1' sx={{ textAlign: "center", mr: 2 }}>DATE AVAILABLE</Typography>
                </Box>
                {courseProgressReports.map((report, key) => (
                  <Card key={key} variant='outlined' sx={{ py: 2, px: 2, mt: 2, boxShadow: "none" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant='subtitle1' color="primary.main"><Link onClick={() => navigate("" + report.id)}>{report.title}</Link></Typography>
                      <Typography variant='subttile1' color="lightgrey">{report.uploadDate}</Typography>
                    </Box>
                  </Card>
                ))}
              </Card>
            </Box>

          </Box>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}

export default UserCourse