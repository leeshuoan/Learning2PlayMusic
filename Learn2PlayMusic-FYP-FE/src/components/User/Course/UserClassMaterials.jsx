import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Card, Box, Link, Breadcrumbs, Backdrop, CircularProgress } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const UserClassMaterials = () => {
  const navigate = useNavigate()
  const { courseid } = useParams()
  const { materialId } = useParams()
  const [course, setCourse] = useState({})
  const [material, setMaterial] = useState({})
  const [open, setOpen] = useState(true);

  const getCourse = fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const getMaterialAPI = fetch(`${import.meta.env.VITE_API_URL}/course/material?courseId=${courseid}&materialId=${materialId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  useEffect(() => {Promise.all([getCourse, getMaterialAPI])
      .then(async ([res1, res2]) => {
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
        console.log(data1)
        console.log(data2)
        let courseData = {
          id: data1[0].SK.split("#")[1],
          name: data1[0].CourseName,
          timeslot: data1[0].CourseSlot,
          teacher: data1[0].TeacherName
        }
        setCourse(courseData)
        setOpen(false)

        let mat = data2
        mat.id = mat.SK.split("Material#")[1].substr(0, 1);
        let date_1 = new Date(mat['MaterialLessonDate']);
        let formattedDate_1 = `${date_1.toLocaleDateString()} ${date_1.toLocaleTimeString()}`;
        mat['MaterialLessonDate'] = formattedDate_1
        console.log("material", mat)
        setMaterial(mat)

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
        <Link underline="hover" color="inherit" onClick={() => { navigate(`/home/course/${courseid}/material`) }}>
          {course.name}
        </Link>
        <Typography color="text.primary">Class Materials</Typography>
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

      <Box>
        <Card sx={{ py: 3, px: 5, mt: 2 }}>
          <Typography variant='h6' sx={{ mb: 1 }}>{material.MaterialTitle}</Typography>
          <Typography variant='body1'>LESSON DATE</Typography>
          <Typography variant='body2'>{material.MaterialLessonDate}</Typography>
          <Card variant='outlined' sx={{ py: material.MaterialType == "Link" ? 2 : 1, px: 2, mt: 2, boxShadow: "none" }}>
            <embed src=
              "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf"
              width="100%"
              height="700"
              type="application/pdf"
              style={{ display: material.MaterialType == "PDF" ? "block" : "none" }} />
            <Link style={{ display: material.MaterialType == "Link" ? "flex" : "none" }} href="https://www.youtube.com/watch?v=UETPELwIjho" target="_blank"><InsertLinkIcon sx={{ mr: 0.5 }} />{material.MaterialTitle}</Link>
          </Card>
        </Card>
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}

export default UserClassMaterials