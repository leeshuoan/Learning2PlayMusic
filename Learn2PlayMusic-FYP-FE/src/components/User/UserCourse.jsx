import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Breadcrumbs } from '@mui/material'
import ClassMaterialsTable from './ClassMaterialsTable';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const UserCourse = () => {
  const [course, setCourse] = useState({})
  const [courseHomework, setCourseHomework] = useState([])

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((data) => {
        let courseData = {
          id: data[0].SK.split("#")[1],
          name: data[0].CourseName,
          timeslot: data[0].CourseTimeSlot,
        }
        setCourse(courseData)
      }).catch((error) => {
        console.log(error)
      })

    fetch(`${import.meta.env.VITE_API_URL}/course/homework?courseId=${courseid}&studentId=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        for (let idx in data) {
          data[idx].id = data[idx].SK.split("Homework#")[1].substr(0,1)

          let date = new Date(data[idx]['HomeworkDueDate'])
          let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          data[idx]['HomeworkDueDate'] = formattedDate 
        }
        console.log(data)
        setCourseHomework(data)
      }).catch((error) => {
        console.log(error)
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
            {menuOptions.map((option) => (
              <MenuItem sx={{ mb: 1, color: routeMenuMapping[category] == option ? "primary.main" : category === undefined && option == "Announcements" ? "primary.main" : "", "&:hover": { color: "primary.main" } }}
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
                {menuOptions.map((option) => (
                  <MenuItem sx={{ mb: 0.5, color: routeMenuMapping[category] == option ? "primary.main" : category === undefined && option == "Announcements" ? "primary.main" : "", "&:hover": { color: "primary.main" } }}
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
              {courseAnnouncements.map((announcement) => (
                <Card variant='outlined' sx={{ boxShadow: "none", mt: 2, p: 2 }}>
                  <Typography variant='subtitle1' sx={{}}>{announcement.title}</Typography>
                  <Typography variant='subsubtitle' sx={{ mb: 1 }}>Posted {announcement.date}</Typography>
                  <Typography variant='body2'>{announcement.content}</Typography>
                </Card>
              ))}
            </Card>

            <Box sx={{ display: category == "material" ? "block" : "none" }}>
              <ClassMaterialsTable />
            </Box>

            <Box sx={{ display: category == "quiz" ? "block" : "none" }}>
              {courseQuizzes.map((quiz) => (
                <Card sx={{ py: 3, px: 4, mt: 2 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>{quiz.title}</Typography>
                  <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid item xs="12" sm="6">
                      <Button variant="contained" onClick={() => { navigate(`${quiz.id}`) }}>
                        <PlayCircleFilledIcon sx={{ mr: 1 }} />
                        Start Quiz
                      </Button>
                    </Grid>
                    <Grid item xs="12" sm="3">
                      <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" }, color: "primary.main" }}>Score</Typography>
                      <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>{quiz.score}</Typography>
                      <Typography variant='body1' sx={{ display: { xs: "flex", sm: "none" } }}><Typography sx={{ color: "primary.main", mr: 0.5 }}>Score:</Typography>{quiz.score}</Typography>
                    </Grid>
                    <Grid item xs="12" sm="3">
                      <Typography variant='body1' sx={{ textAlign: "center", color: 'primary.main', display: { xs: "none", sm: "block" } }}>Attempts</Typography>
                      <Typography variant='body1' sx={{ textAlign: "center", color: quiz.attempts == 0 ? 'grey' : '', display: { xs: "none", sm: "block" } }}>{quiz.attempts}/{quiz.maxAttempts}</Typography>
                      <Typography variant='body1' sx={{ color: quiz.attempts == 0 ? 'grey' : '', display: { xs: "flex", sm: "none" } }}><Typography sx={{ color: "primary.main", mr: 0.5 }}>Attempts:</Typography>{quiz.attempts}/{quiz.maxAttempts}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: category == "homework" ? "block" : "none" }}>
              <Grid container spacing={2} sx={{ px: 4, mt: 2, display: { xs: "none", sm: "flex" } }}>
                <Grid item xs="4">
                  <Typography variant='subtitle2'>HOMEWORK TITLE</Typography>
                </Grid>
                <Grid item xs="3">
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>DUE DATE</Typography>
                </Grid>
                <Grid item xs="3">
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>SCORE</Typography>
                </Grid>
                <Grid item xs="2">
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>SUBMISSIONS</Typography>
                </Grid>
              </Grid>
              {
                courseHomework.map((homework) => (
                  <Card sx={{ py: 3, px: 4, mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs="12" sm="4">
                        <Typography variant='body1' sx={{ color: "primary.main" }}><Link onClick={() => navigate("" + homework.id)}>{homework.HomeworkTitle}</Link></Typography>
                      </Grid>
                      <Grid item xs="12" sm="3">
                        <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>{homework.HomeworkDueDate}</Typography>
                        <Typography variant='body1' sx={{ display: { xs: "block", sm: "none" } }}>Due Date: {homework.dueDate}</Typography>
                      </Grid>
                      <Grid item xs="12" sm="3">
                        <Typography variant='body1' sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>{homework.HomeworkScore}</Typography>
                        <Typography variant='body1' sx={{ display: { xs: "block", sm: "none" } }}>Score: {homework.score}</Typography>
                      </Grid>
                      <Grid item xs="12" sm="2">
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
                {courseProgressReports.map((report) => (
                  <Card variant='outlined' sx={{ py: 2, px: 2, mt: 2, boxShadow: "none" }}>
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
    </Container>
  )
}

export default UserCourse