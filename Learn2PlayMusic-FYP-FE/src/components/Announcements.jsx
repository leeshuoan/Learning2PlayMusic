import { useState, useEffect } from 'react'
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';


const Announcements = () => {
  const [announcements, setAnnouncements] = useState([])

  const getGeneralAnnouncements = fetch(`${import.meta.env.VITE_API_URL}/generalannouncement`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getGeneralAnnouncements]).then(async ([res1]) => {
      const [data1] = await Promise.all([res1.json()])
      console.log(data1)
      for (let idx in data1) {
        data1[idx].date = new Date(data1[idx].SK.split('Date#')[1]).toLocaleDateString()
      }
      setAnnouncements(data1)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => navigate('/home')}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Typography color="text.primary">General Announcements</Typography>
      </Breadcrumbs>

      <Card variant='contained' sx={{ mt: 2, py: 3, px: 5 }}>
        <Typography variant="h5">All Announcements</Typography>
        {announcements.map((announcement, index) => (
          <Card variant='outlined' sx={{ mt: 2, py: 3, px: 5, boxShadow: "none" }}>
            <Typography variant="subtitle1">{announcement.Title}</Typography>
            <Typography variant="subsubtitle" sx={{ mt: 1 }}>Posted {announcement.date}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{announcement.Content}</Typography>
          </Card>
        ))}
      </Card>
    </Container>
  )
}

export default Announcements