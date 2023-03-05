import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Container, Grid, Card, Box, Link, Button, CircularProgress, Backdrop } from '@mui/material'

const UserHome = ({ userInfo }) => {
  const [open, setOpen] = useState(true)
  const [unEnrolled, setUnEnrolled] = useState(false)
  const [myCourses, setMyCourses] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const navigate = useNavigate()

  const getCourse = fetch(`${import.meta.env.VITE_API_URL}/user/student/course?studentId=${userInfo.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const getGeneralAnnouncements = fetch(`${import.meta.env.VITE_API_URL}/generalannouncement`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  useEffect(() => {
    Promise.all([getGeneralAnnouncements, getCourse]).then(async ([res1, res2]) => {
      const [data1, data2] = await Promise.all([res1.json(), res2.json()])
      data1.splice(3, data1.length - 3)
      for (let idx in data1) {
        data1[idx].date = new Date(data1[idx].SK.split('Date#')[1]).toLocaleDateString()
      }
      setAnnouncements(data1)

      if (res2.status === 404) {
        if (data2.message == "[ERROR] studentId does not exist in database") {
          setUnEnrolled(true)
        }
      }
      setOpen(false)
    })
  }, [])

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Typography variant='h4' sx={{ mt: 3 }}>Welcome Back, {userInfo.name}</Typography>

        {myCourses.map((myCourse, index) => (
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
        ))}
        <Card sx={{ p: 2, px: 5, mt: 2, display: unEnrolled ? "flex" : "none" }} style={{ background: `linear-gradient(45deg, rgba(23,76,106,1) 0%, rgba(35,77,116,0.5) 100%)` }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant='h6' color="white">You have not been enrolled in any courses</Typography>
          </Box>
        </Card>


        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} md={12}>
            <Card sx={{ py: 3, px: 4 }}>
              <Typography variant='h6'>Annoucements</Typography>
              {announcements.map((announcement, index) => (
                <Card variant='outlined' sx={{ boxShadow: "none", my: 1, p: 2 }} key={index}>
                  <Typography variant='subtitle2'>{announcement.AnnouncementTitle}</Typography>
                  <Typography variant='subsubtitle'>Posted {announcement.date}</Typography>
                  <Typography variant='body2' sx={{ mt: 1 }}>{announcement.Content}</Typography>
                </Card>
              ))}
              <Box sx={{ textAlign: "center" }}>
                <Link onClick={() => { navigate("announcements") }}>View All Announcements</Link>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Container>
    </>
  )
}

export default UserHome