import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Card, Box, Link, Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const UserQuiz = () => {
  const course = {
    id: 1,
    title: "Grade 1 Piano",
    date: "21 Mar 2023",
    teacher: "Miss Felicia Ng"
  }

  const quiz = {
    quizId: 1,
    
  }

  const navigate = useNavigate()
  const { quizId } = useParams()

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => { navigate('/home') }}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link underline="hover" color="inherit" onClick={() => { navigate('/home/course/1/quiz') }}>
          {course.title}
        </Link>
        <Typography color="text.primary">Quiz</Typography>
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

        <Box>
            <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant='h6' sx={{ mb: 1 }}>Quiz</Typography>
            </Card>
        </Box>

    </Container>
  )
}

export default UserQuiz