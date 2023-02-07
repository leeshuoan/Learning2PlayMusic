import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import QuizIcon from '@mui/icons-material/Quiz';
import WorkIcon from '@mui/icons-material/Work';
import DownloadIcon from '@mui/icons-material/Download';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import courseImg from '../../assets/course.png'

const UserCourse = () => {
  const course = {
    title: "Grade 1 Piano",
    date: "21 Mar 2023",
    teacher: "Miss Felicia Ng"
  }

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

  const courseMaterials = [
    {
      title: "Lesson 2",
      materials: [
        {
          materialTitle: "Exercise 2",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        {
          materialTitle: "Exercise 1",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
      ]
    },
    {
      title: "Lesson 1",
      materials: [
        {
          materialTitle: "Exercise 2",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        {
          materialTitle: "Exercise 1",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
      ]
    },
  ]

  const courseQuizzes = [
    {
      title: "Quiz 1",
      score: "80%",
      attempts: 1,
      maxAttempts: 1
    },
    {
      title: "Quiz 2",
      score: "93%",
      attempts: 1,
      maxAttempts: 1
    },
    {
      title: "Quiz 3",
      score: "",
      attempts: 0,
      maxAttempts: 1
    },
  ]

  const courseHomework = [
    {
      title: "Homework 1",
      dueDate: "3 Feb 2023, 23:59PM",
      score: "80%",
      submission: 1,
    },
    {
      title: "Homework 2",
      dueDate: "13 Feb 2023, 23:59PM",
      score: "80%",
      submission: 1,
    },
    {
      title: "Homework 1",
      dueDate: "3 Mar 2023, 23:59PM",
      score: "",
      submission: 0,
    }
  ]

  const courseForums = [
    {
      title: "Do Pianists have longer fingers?",
      postedDate: "31 Jan 2023",
      comments: 4
    },
    {
      title: "How are you coping with your piano lessons so far?",
      postedDate: "31 Jan 2023",
      comments: 8
    }
  ]

  const courseProgress = {
    "attendance": 3,
    "maxAttendance": 3,
    "quizzes": 2,
    "maxQuizzes": 3,
    "homeworkSubmissions": 2,
    "homework": 3,
  }

  const courseProgressReports = [
    {
      title: "Progress Report 1",
      uploadDate: "31 Jan 2023",
      reportUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ]

  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("Announcements")
  const [announcementTab, setAnnouncementTab] = useState("block")
  const [classMaterialTab, setClassMaterialTab] = useState("none")
  const [quizTab, setQuizTab] = useState("none")
  const [homeworkTab, setHomeworkTab] = useState("none")
  const [discussionForumTab, setDiscussionForumTab] = useState("none")
  const [progressReportTab, setProgressReportTab] = useState("none")

  const menuOptions = ["Announcements", "Class Materials", "Quizzes", "Homework", "Discussion Forum", "My Progress Report"]

  const closeTabs = () => {
    setAnnouncementTab("none")
    setClassMaterialTab("none")
    setQuizTab("none")
    setHomeworkTab("none")
    setDiscussionForumTab("none")
    setProgressReportTab("none")
  }

  const selectTab = (tab) => {
    closeTabs()
    setSelectedTab(tab)
    if (tab === "Announcements") {
      setAnnouncementTab("block")
    } else if (tab === "Class Materials") {
      setClassMaterialTab("block")
    } else if (tab === "Quizzes") {
      setQuizTab("block")
    } else if (tab === "Homework") {
      setHomeworkTab("block")
    } else if (tab === "Discussion Forum") {
      setDiscussionForumTab("block")
    } else if (tab === "My Progress Report") {
      setProgressReportTab("block")
    }
  }

  const back = () => {
    navigate('/home')
    return;
  }

  return (
    <Container maxWidth="xl" sx={{ width: 0.9 }}>
      <Breadcrumbs aria-label="breadcrumb"  separator={<NavigateNextIcon fontSize="small" />} sx={{ mt:3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={back}>
        <HomeIcon sx={{ mr:0.5 }} />
          Home
        </Link>
        <Typography color="text.primary">Course</Typography>
      </Breadcrumbs>

      <Card sx={{ py: 2, px: 3, mt: 2, display: "flex" }}>
        <img src={courseImg} style={{ maxWidth: 110, borderRadius: 10 }}></img>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ ml: 2, mb: 1 }}>
            <Typography variant='h5' sx={{ color: "primary.main" }}>{course.title}</Typography>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>Date: {course.date}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          <Box sx={{ ml: 2, mb: 1 }}>
            <Typography variant='subtitle1' sx={{ mb: 0.5 }}>{course.teacher}</Typography>
            <Typography variant='body2' sx={{ textAlign: "right" }}>Teacher</Typography>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={2} sx={{ pt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ py: 2, px: 3, mt: 2 }}>
            {menuOptions.map((option) => (
              <MenuItem sx={{ mb: 1, color: selectedTab == option ? "primary.main" : "", "&:hover": { color: "primary.main" } }} onClick={() => selectTab(option)}>
                <Typography variant='subtitle1'>{option}</Typography>
              </MenuItem>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box>
            <Card sx={{ py: 3, px: 5, mt: 2, display: announcementTab }}>
              <Typography variant='h5'>Class Announcements</Typography>
              {courseAnnouncements.map((announcement) => (
                <Card variant='outlined' sx={{ boxShadow: "none", mt: 2, p: 2 }}>
                  <Typography variant='subtitle1' sx={{}}>{announcement.title}</Typography>
                  <Typography variant='subsubtitle' sx={{ mb: 1 }}>Posted {announcement.date}</Typography>
                  <Typography variant='body2'>{announcement.content}</Typography>
                </Card>
              ))}
            </Card>

            <Box sx={{ display: classMaterialTab }}>
              {courseMaterials.map((material) => (
                <Card sx={{ py: 1, px: 3, mt: 2 }}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant='h5'>{material.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {material.materials.map((item) => (
                        <Card variant='outlined' sx={{ boxShadow: "none", display: "flex", mb: 2, p: 2 }}>
                          <Box>
                            <Typography variant='subtitle1' sx={{ pb: 1 }}>{item.materialTitle}</Typography>
                            <Link href={item.materialUrl} target="_blank">Download PDF</Link>
                          </Box>
                          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                            <Button variant="contained">View</Button>
                          </Box>
                        </Card>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: quizTab }}>
              <Grid container spacing={2} sx={{ px: 4, mt: 2 }}>
                <Grid item xs="6">
                  <Typography variant='subtitle2'>QUIZ TITLE</Typography>
                </Grid>
                <Grid item xs="3">
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>SCORE</Typography>
                </Grid>
                <Grid item xs="3">
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>ATTEMPTS</Typography>
                </Grid>
              </Grid>
              {courseQuizzes.map((quiz) => (
                <Card sx={{ py: 3, px: 4, mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs="6">
                      <Typography variant='body1' sx={{ color: "primary.main" }}>{quiz.title}</Typography>
                    </Grid>
                    <Grid item xs="3">
                      <Typography variant='body1' sx={{ textAlign: "center" }}>{quiz.score}</Typography>
                    </Grid>
                    <Grid item xs="3">
                      <Typography variant='body1' sx={{ textAlign: "center", color: quiz.attempts == 0 ? 'grey' : '' }}>{quiz.attempts}/{quiz.maxAttempts}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: homeworkTab }}>
              <Grid container spacing={2} sx={{ px: 4, mt: 2 }}>
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
                  <Typography variant='subtitle2' sx={{ textAlign: "center" }}>SUBMISSION</Typography>
                </Grid>
              </Grid>
              {
                courseHomework.map((homework) => (
                  <Card sx={{ py: 3, px: 4, mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs="4">
                        <Typography variant='body1' sx={{ color: "primary.main" }}>{homework.title}</Typography>
                      </Grid>
                      <Grid item xs="3">
                        <Typography variant='body1' sx={{ textAlign: "center" }}>{homework.dueDate}</Typography>
                      </Grid>
                      <Grid item xs="3">
                        <Typography variant='body1' sx={{ textAlign: "center" }}>{homework.score}</Typography>
                      </Grid>
                      <Grid item xs="2">
                        <Typography variant='body1' sx={{ textAlign: "center", color: homework.submission == 0 ? 'grey' : '' }}>{homework.submission} FILE</Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
            </Box>

            <Box sx={{ display: discussionForumTab }}>
              {courseForums.map((forum) => (
                <Card sx={{ py: 3, px: 5, mt: 2 }}>
                  <Box sx={{ display: "flex" }}>
                    <Box>
                      <Typography variant='h6' sx={{ color: "primary.main" }}>{forum.title}</Typography>
                      <Typography variant='subsubtitle'>Posted {forum.postedDate}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", ml: "auto", color: "#707070" }}>
                      <Typography variant="body2">{forum.comments} comments</Typography>
                      <ChatBubbleIcon sx={{ ml: 1 }} fontSize="xs" />
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: progressReportTab }}>
              <Grid container spacing={2}>
                <Grid item xs="4">
                  <Card sx={{ py: 4, px: 5, mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                      <EmojiPeopleIcon />
                      <Typography variant='h6' sx={{ ml: 1 }}>Attendance Rate</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ mt: 1, textAlign: "center", color: "primary.main" }}>{courseProgress.attendance}/{courseProgress.maxAttendance} ({(courseProgress.attendance / courseProgress.maxAttendance * 100).toFixed(1)}%)</Typography>
                  </Card>
                </Grid>
                <Grid item xs="4">
                  <Card sx={{ py: 4, px: 5, mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                      <QuizIcon />
                      <Typography variant='h6' sx={{ ml: 1 }}>Quizzes Completed</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ mt: 1, textAlign: "center", color: "primary.main" }}>{courseProgress.quizzes}/{courseProgress.maxQuizzes} ({(courseProgress.quizzes / courseProgress.maxQuizzes * 100).toFixed(1)}%)</Typography>
                  </Card>
                </Grid>
                <Grid item xs="4">
                  <Card sx={{ py: 4, px: 5, mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                      <WorkIcon />
                      <Typography variant='h6' sx={{ ml: 1 }}>Homework Submitted</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ mt: 1, textAlign: "center", color: "primary.main" }}>{courseProgress.homeworkSubmissions}/{courseProgress.homework} ({(courseProgress.homeworkSubmissions / courseProgress.homework * 100).toFixed(1)}%)</Typography>
                  </Card>
                </Grid>
              </Grid>
              {courseProgressReports.map((report) => (
                <Card sx={{ py: 3, px: 5, mt: 2, display: "flex" }}>
                  <Box>
                    <Typography variant='h6'>{report.title}</Typography>
                    <Typography variant='subsubtitle'>Uploaded {report.uploadDate}</Typography>
                  </Box>
                  <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                    <Button variant="contained">
                      <DownloadIcon sx={{ mr: 1 }} />
                      Download
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>

          </Box>
        </Grid>

      </Grid>
    </Container>
  )
}

export default UserCourse