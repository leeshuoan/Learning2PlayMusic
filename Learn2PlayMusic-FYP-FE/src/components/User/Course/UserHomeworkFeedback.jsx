import { useState, useEffect } from 'react'
import { Container, Breadcrumbs, Link, Typography, Card, Box, Backdrop, CircularProgress, Divider } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate, useParams } from 'react-router-dom'

const UserHomeworkFeedback = (userInfo) => {
  const navigate = useNavigate()
  const { courseid } = useParams()
  const { homeworkId } = useParams();
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({})
  const [feedback, setFeedback] = useState({})

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`)
  const getHomeworkFeedbackAPI = request(`/course/homework/feedback?courseId=${courseid}&studentId=${userInfo.userInfo.id}&homeworkId=${homeworkId}`)

  useEffect(() => {
    async function fetchData() {
      const [data1, data2] = await Promise.all([getCourseAPI, getHomeworkFeedbackAPI])
      console.log(data2)

      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName
      };
      setCourse(courseData);
      setFeedback(data2)
    }


    fetchData().then(() => {
      setOpen(false)
    })
  }, []);

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
          <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => { navigate('/home') }}>
            <HomeIcon sx={{ mr: 0.5 }} />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => {
              navigate(`/home/course/${courseid}/homework`);
            }}>
            {course.name}
          </Link>
          <Typography color="text.primary">Homework</Typography>

        </Breadcrumbs>

        <Card
          sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <Typography variant="h5" sx={{ color: "primary.main" }}>
                {course.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Date: {course.timeslot}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {course.teacher}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                Teacher
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ py: 3, px: 5, mt: 2 }}>
          <Typography variant="subsubtitle" sx={{ mb: 2 }}>STUDENT NAME</Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>{userInfo.userInfo.name}</Typography>
          <Typography variant="subsubtitle" sx={{ mb: 2 }}>FILE SUBMISSION</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}><Link onClick={() => {window.open(feedback.HomeworkAttachment, '_blank')}}>{feedback.SubmissionFileName}</Link></Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{feedback.SubmissionContent}</Typography>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex" }}>
            <Box sx={{ mr: 3 }}>
              <Typography variant="subsubtitle" sx={{ mb: 2 }}>HOMEWORK SCORE</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{feedback.HomeworkScore * 100}%</Typography>
            </Box>
            <Box>
              <Typography variant="subsubtitle" sx={{ mb: 2 }}>TEACHER'S COMMENTS</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{feedback.TeacherComments}</Typography>
            </Box>
          </Box>
        </Card>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default UserHomeworkFeedback