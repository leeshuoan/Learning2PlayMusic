import { useState, useEffect } from 'react'
import { Container, Breadcrumbs, Link, Typography, Card, Box, Backdrop, CircularProgress, Divider } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate, useParams } from 'react-router-dom'

const UserHomeworkFeedback = (userInfo) => {
  console.log(userInfo)

  const homework = {
    id: 1,
    title: "Homework 1",
    assignedDate: "1 feb 2023, 23:59pm ",
    dueDate: "10 feb 2023, 23:59pm",
  };

  const navigate = useNavigate()
  const { courseid } = useParams()
  const { homeworkId } = useParams();
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({})

  const getCourseAPI = fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  useEffect(() => {
    Promise.all([getCourseAPI])
      .then(async ([res1]) => {
        const [data1] = await Promise.all([
          res1.json(),
        ]);

        let courseData = {
          id: data1[0].SK.split("#")[1],
          name: data1[0].CourseName,
          timeslot: data1[0].CourseSlot,
        };
        setCourse(courseData);
        setOpen(false)
      })
      .catch((error) => {
        console.log(error);
        setOpen(false);
      });
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
          <Typography color="text.primary">{homework.title}</Typography>

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
                Miss Felicia Ng
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
          <Typography variant="body1" sx={{ mb: 2 }}><Link>homework1_tom.jpg</Link></Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>I think the answer is piano. Piano has white keys.</Typography>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex" }}>
            <Box sx={{ mr: 3 }}>
              <Typography variant="subsubtitle" sx={{ mb: 2 }}>HOMEWORK SCORE</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>HOMEWORK SCORE</Typography>
            </Box>
            <Box>
              <Typography variant="subsubtitle" sx={{ mb: 2 }}>TEACHER'S COMMENTS</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>Hi Tom, piano is different from organ</Typography>
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