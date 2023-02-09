import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Container, Grid, Card, Box, Link, Button } from '@mui/material'
import courseImg from '../../assets/course.png'

const UserHome = ({ userInfo }) => {
  const announcements = [
    {
      title: "New Course Available",
      date: "31 Jan 2023",
      content: "The Premium Children's Piano Course for age 5 and above. Students are prepared for graded examinations of The Associated Board Royal Schools of Music (ABRSM). 'Enjoyment through achievement' is a phrase that sums up ABRSM's philosophy, and earning an ABRSM certificate is a rewarding experience."
    },
    {
      title: "New Course Available",
      date: "31 Jan 2023",
      content: "The Premium Children's Piano Course for age 5 and above. Students are prepared for graded examinations of The Associated Board Royal Schools of Music (ABRSM). 'Enjoyment through achievement' is a phrase that sums up ABRSM's philosophy, and earning an ABRSM certificate is a rewarding experience."
    },
    {
      title: "New Course Available",
      date: "31 Jan 2023",
      content: "The Premium Children's Piano Course for age 5 and above. Students are prepared for graded examinations of The Associated Board Royal Schools of Music (ABRSM). 'Enjoyment through achievement' is a phrase that sums up ABRSM's philosophy, and earning an ABRSM certificate is a rewarding experience."
    }
  ]

  const upcomingClasses = [
    {
      title: "Piano",
      date: "31 Jan 2023, 4:00pm",
    },
    {
      title: "Piano",
      date: "31 Jan 2023, 4:00pm",
    },
    {
      title: "Piano",
      date: "31 Jan 2023, 4:00pm",
    }
  ]

  const myCourses = [
    {
      id: 1,
      title: "Grade 1 Piano",
      date: "21 Mar 2023",
    },
    {
      id: 2,
      title: "Grade 1 Piano",
      date: "21 Mar 2023",
    },
    {
      id: 3,
      title: "Grade 1 Piano",
      date: "21 Mar 2023",
    },
    {
      id: 4,
      title: "Grade 1 Piano",
      date: "21 Mar 2023",
    },
  ]

  const navigate = useNavigate()

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Typography variant='h4' sx={{ mt: 3, textAlign: "center" }}>Welcome Back, {userInfo.name}</Typography>

        <Card sx={{ pt: 3, pb: 1, px: 4, mt: 2 }}>
          <Typography variant='h6'>My Courses</Typography>
          <Grid container spacing={1}>
            {myCourses.map((myCourse, index) => (
              <Grid item xs={12} sm={6} md={3}>
                <Card variant='outlined' sx={{ boxShadow: "none", border: "none", my: 1, p: 2 }} key={index}>
                  <img src={courseImg} style={{ borderRadius: 5 }}></img>
                  {/* < img src={courseImgUrl}></img> */}
                  <Typography variant='subtitle2' sx={{ pt: 1, color: "primary.main" }}>{myCourse.title}</Typography>
                  <Typography variant='body2'>Ends {myCourse.date}</Typography>
                  <Button variant='contained' sx={{ width: "100%", mt: 1 }} onClick={() => { navigate("course/" + myCourse.id) }}>View Course</Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>

        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} md={9}>
            <Card sx={{ py: 3, px: 4 }}>
              <Typography variant='h6'>Annoucements</Typography>
              {announcements.map((announcement, index) => (
                <Card variant='outlined' sx={{ boxShadow: "none", my: 1, p: 2 }} key={index}>
                  <Typography variant='subtitle2'>{announcement.title}</Typography>
                  <Typography variant='subsubtitle'>Posted {announcement.date}</Typography>
                  <Typography variant='body2' sx={{ mt: 1 }}>{announcement.content}</Typography>
                </Card>
              ))}
              <Box sx={{ textAlign: "center" }}>
                <Link onClick={() => {navigate("announcements")}}>View All Announcements</Link>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ py: 3, px: 2 }}>
              <Typography variant='h6' sx={{ textAlign: "center" }}>Upcoming Classes</Typography>
              {upcomingClasses.map((upcomingClass, index) => (
                <Card variant='outlined' sx={{ boxShadow: "none", my: 1, p: 2 }} key={index}>
                  <Typography variant='subtitle2'>{upcomingClass.title}</Typography>
                  <Typography variant='subsubtitle'>Date: {upcomingClass.date}</Typography>
                </Card>
              ))}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default UserHome