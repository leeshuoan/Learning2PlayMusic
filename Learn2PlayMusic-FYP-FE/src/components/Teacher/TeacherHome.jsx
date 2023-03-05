import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Container, Grid, Card, Box, Link, Button } from '@mui/material'

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

  const myCourse = {
    id: 1,
    title: "Grade 2 Piano",
    date: "Wednesday 7pm",
  }

  const navigate = useNavigate()

  const getCourses = fetch(`${import.meta.env.VITE_API_URL}/courses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const getGeneralAnnouncements = fetch(`${import.meta.env.VITE_API_URL}/getGeneralAnnouncements`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  useEffect(() => {
    Promise.all([getCourses, getGeneralAnnouncements]).then(([res1, res2]) => {
      return Promise.all([res1.json(), res2.json()]).then(
        ([data1, data2]) => {
          console.log(data1)
          console.log(data2)
        }
      )
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Typography variant='h4' sx={{ mt: 3 }}>Welcome Back, {userInfo.name}</Typography>

        <Card sx={{ p: 2, px: 5, mt: 2 }} style={{ background: `linear-gradient(45deg, rgba(23,76,106,1) 0%, rgba(35,77,116,0.5) 100%)` }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant='h4' color="white">{myCourse.title}</Typography>
              <Typography variant='body2' color="white">Every {myCourse.date}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button variant="contained" sx={{ color: "black", backgroundColor: "white", boxShadow: "none", "&:hover": { backgroundColor: "lightgrey" } }}
                onClick={() => { navigate(`course/${myCourse.id}`) }}>GO TO COURSE PAGE</Button>
            </Box>
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
                <Link onClick={() => { navigate("announcements") }}>View All Announcements</Link>
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