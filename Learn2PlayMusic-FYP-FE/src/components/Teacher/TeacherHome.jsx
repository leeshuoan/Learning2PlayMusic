import { Typography, Container, Grid, Card, Box, Link } from '@mui/material'
import banner from '../../assets/banner.jpg'
import course from '../../assets/course.png'
import React from 'react'

const TeacherHome = ({ userInfo }) => {
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
      title: "Grade 1 Piano",
      date: "Ends 21 Mar 2023",
    },
    {
      title: "Grade 1 Piano",
      date: "Ends 21 Mar 2023",
    },
    {
      title: "Grade 1 Piano",
      date: "Ends 21 Mar 2023",
    },
    {
      title: "Grade 1 Piano",
      date: "Ends 21 Mar 2023",
    },
  ]

  return (
    <>
      <Container maxWidth="xl" sx={{ width: 0.9 }}>
        {/* <img src={banner} width="100%"></img> */}
        <Typography variant='h4' sx={{ mt: 3, textAlign: "center" }}>Welcome Back, {userInfo.name}</Typography>

            <Card sx={{ py: 3, px: 4, mt:2 }}>
              <Typography variant='h6'>My Courses</Typography>
              <Grid container spacing={1}>
                {myCourses.map((myCourse, index) => (
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant='outlined' sx={{ boxShadow: "none", my: 1, p: 2 }} key={index}>
                      <img src={course}></img>
                      {/* <img src={courseImgUrl}></img> */}
                      <Typography variant='subtitle2' sx={{ pt: 1, color: "primary.main" }}>{myCourse.title}</Typography>
                      <Typography variant='body2'>{myCourse.date}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ textAlign: "center" }}>
                <Link >View All Courses</Link>
              </Box>
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
                <Link >View All Announcements</Link>
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

export default TeacherHome