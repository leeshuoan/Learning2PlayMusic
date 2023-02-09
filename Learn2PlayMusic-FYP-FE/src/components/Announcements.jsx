import React from 'react'
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';


const Announcements = () => {
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

  const navigate = useNavigate()

  const back = () => {
    navigate('/home')
    return;
  }

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={back}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Typography color="text.primary">General Announcements</Typography>
      </Breadcrumbs>

      <Card variant='contained' sx={{ mt: 2, py: 3, px: 5 }}>
        <Typography variant="h5">All Announcements</Typography>
        {announcements.map((announcement, index) => (
          <Card variant='outlined' sx={{ mt: 2, py: 3, px: 5, boxShadow: "none" }}>
            <Typography variant="subtitle1">{announcement.title}</Typography>
            <Typography variant="subsubtitle" sx={{ mt: 1 }}>Posted {announcement.date}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{announcement.content}</Typography>
          </Card>
        ))}
      </Card>
    </Container>
  )
}

export default Announcements