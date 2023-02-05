import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Grid, Card, Box, Link, MenuItem } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import HomeIcon from '@mui/icons-material/Home';
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
      <Box sx={{ mt: 3, display: "flex", "&:hover": { cursor: "pointer" } }} onClick={back}>
        <ArrowBackIosIcon />
        <Typography variant='subtitle1' sx={{ pl: 1, pr: 1 }}>Back to Home</Typography>
        <HomeIcon />
      </Box>

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
              <MenuItem sx={{ mb: 1, color:selectedTab==option?"primary.main":"", "&:hover": {color: "primary.main"} }} onClick={() => selectTab(option)}>
                <Typography variant='subtitle1'>{option}</Typography>
              </MenuItem>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box>
            <Card sx={{ py: 3, px: 5, mt: 2, display:announcementTab }}>
              <Typography variant='h5'>Class Announcements</Typography>
              {courseAnnouncements.map((announcement) => (
                <Box sx={{ mt: 2, p:2 }}>
                  <Typography variant='subtitle1' sx={{  }}>{announcement.title}</Typography>
                  <Typography variant='subsubtitle' sx={{ mb: 1 }}>Posted {announcement.date}</Typography>
                  <Typography variant='body2'>{announcement.content}</Typography>
                </Box>
              ))}
            </Card>

            <Card sx={{ py: 3, px: 5, mt: 2, display:classMaterialTab }}>
              <Typography variant='h5'>Class Materials</Typography>
            </Card>

            <Card sx={{ py: 3, px: 5, mt: 2, display:quizTab }}>
              <Typography variant='h5'>Quizzes</Typography>
            </Card>

            <Card sx={{ py: 3, px: 5, mt: 2, display:homeworkTab }}>
              <Typography variant='h5'>Homework</Typography>
            </Card>

            <Card sx={{ py: 3, px: 5, mt: 2, display:discussionForumTab }}>
              <Typography variant='h5'>Discussion Forum</Typography>
            </Card>

            <Card sx={{ py: 3, px: 5, mt: 2, display:progressReportTab }}>
              <Typography variant='h5'>My Progress Report</Typography>
            </Card>

          </Box>
        </Grid>

      </Grid>
    </Container>
  )
}

export default UserCourse