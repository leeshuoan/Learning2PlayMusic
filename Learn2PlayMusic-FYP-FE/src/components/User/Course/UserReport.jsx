import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme, Typography, Container, Card, Box, Grid, Link, Button, Breadcrumbs, Backdrop, CircularProgress } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const UserReport = () => {
  const report = {
    id: 1,
    title: "Progress Report 1",
    uploadDate: "31 Jun 2023",
    metrics: {
      posture: "Good",
      rhythm: "Good",
      toneQuality: "Good",
      dynamicsControl: "Good",
      articulation: "Good",
      sightReading: "Good",
      practice: "Good",
      theory: "Good",
      scales: "Good",
      aural: "Good",
      musicality: "Good",
      performing: "Good",
      enthusiasm: "Good",
      punctuality: "Good",
      attendance: "Good",
    },
    goals: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    additionalComments: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
  }

  const metricMapping = {
    posture: "Posture",
    rhythm: "Rhythm",
    toneQuality: "Tone Quality",
    dynamicsControl: "Dynamics Control",
    articulation: "Articulation",
    sightReading: "Sight-Reading",
    practice: "Practice and Lesson Preparation",
    theory: "Theory",
    scales: "Scales & Arpeggios",
    aural: "Aural Skills",
    musicality: "Musicality & Artistry",
    performing: "Performing",
    enthusiasm: "Enthusiasm in Music Learning",
    punctuality: "Punctuality",
    attendance: "Attendance",
  }

  const theme = useTheme();
  const navigate = useNavigate()
  const { courseid } = useParams()
  const { reportId } = useParams()
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({})
  const [submitted, setSubmitted] = useState(false);
  const handleClose = () => setOpen(false);

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
          teacher: data1[0].TeacherName,
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
          <Link underline="hover" color="inherit" onClick={() => { navigate('/home/course/1/report') }}>
            {course.name}
          </Link>
          <Typography color="text.primary">Progress Report</Typography>
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
              <Typography variant='subtitle1' sx={{ mb: 0.5 }}>{course.teacher}</Typography>
              <Typography variant='body2' sx={{ textAlign: "right" }}>Teacher</Typography>
            </Box>
          </Box>
        </Card>

        <Box sx={{ display: submitted ? 'none' : 'block' }}>
          <Card sx={{ py: 3, px: 5, mt: 2 }}>
            <Typography variant='h6' sx={{ mb: 1 }}>{report.title}</Typography>
            <Typography variant='body2' sx={{ mb: 1 }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed delectus nostrum non rerum ut temporibus maiores totam molestias, quas unde eius officiis repellat, illum repudiandae earum, consectetur dicta facere ipsam.</Typography>
            <Grid container sx={{ mb: 1 }}>
              {Object.keys(report.metrics).map((key, index) => {
                return (
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography variant='subsubtitle' sx={{ mt: 1.5 }}>{metricMapping[key]}</Typography>
                    <Typography variant='body2'>{report.metrics[key]}</Typography>
                  </Grid>
                )
              })}
            </Grid>
            <Typography variant='subsubtitle'>Goals</Typography>
            <Typography variant='body2' sx={{ mb: 0.5 }}>{report.goals}</Typography>
            <Typography variant='subsubtitle'>Additional Comments</Typography>
            <Typography variant='body2' sx={{ mb: 1 }}>{report.additionalComments}</Typography>
          </Card>
        </Box>
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

export default UserReport