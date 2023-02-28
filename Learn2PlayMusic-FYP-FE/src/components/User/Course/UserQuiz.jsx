import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Card, Box, Link, Breadcrumbs, Backdrop, CircularProgress } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const UserQuiz = () => {
  const navigate = useNavigate()
  const { courseid } = useParams()
  const { quizId } = useParams()
  const [course, setCourse] = useState({})
  const [quizTitle, setQuizTitle] = useState('')
  const [open, setOpen] = useState(true)

  const getCourse = fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // const getQuizAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz?courseId=${courseid}&studentId=${userInfo.userInfo.id}`, {
  const getQuizAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz?courseId=${courseid}&studentId=1&quizId=${quizId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // const getQuizAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz?courseId=${courseid}&studentId=${userInfo.userInfo.id}`, {
  const getQuizQuestionAPI = fetch(`${import.meta.env.VITE_API_URL}/course/quiz/question?courseId=${courseid}&quizId=${quizId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  useEffect(() => {
    Promise.all([getCourse, getQuizAPI, getQuizQuestionAPI])
      .then(async ([res1, res2, res3]) => {
        const [data1, data2, data3] = await Promise.all([res1.json(), res2.json(), res3.json()]);

        console.log(data1);
        console.log(data2);
        console.log(data3);

        let courseData = {
          id: data1[0].SK.split("#")[1],
          name: data1[0].CourseName,
          timeslot: data1[0].CourseSlot,
        };
        setCourse(courseData);

        setQuizTitle(data2[0].QuizTitle)

        setOpen(false);
      }).catch((error) => {
        console.log(error)
        setOpen(false)
      })
  }, [])

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => { navigate('/home') }}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link underline="hover" color="inherit" onClick={() => { navigate(`/home/course/${courseid}/quiz`) }}>
          {course.name}
        </Link>
        <Typography color="text.primary">{quizTitle}</Typography>
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
          <Typography variant='h6' sx={{ mb: 1 }}>{quizTitle}</Typography>
        </Card>
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => { setOpen(false) }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}

export default UserQuiz