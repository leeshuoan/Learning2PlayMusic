import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Card, Box, Link, Breadcrumbs, Backdrop, CircularProgress } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const UserClassMaterials = () => {
  const material = {
    materialId: 1,
    materialTitle: "Exercise 1",
    materialType: "PDF",
    materialDate: "1 Feb 2023, 23:59PM",
    materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }

  const navigate = useNavigate()
  const { courseid } = useParams()
  const { materialId } = useParams()
  const [course, setCourse] = useState({})
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((data) => {
        let courseData = {
          id: data[0].SK.split("#")[1],
          name: data[0].CourseName,
          timeslot: data[0].CourseSlot,
        }
        setCourse(courseData)
        setOpen(false)
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
            <Typography variant='subtitle1' sx={{ mb: 0.5 }}>Miss Felicia Ng</Typography>
            <Typography variant='body2' sx={{ textAlign: "right" }}>Teacher</Typography>
          </Box>
        </Box>
      </Card>

      <Box>
        <Card sx={{ py: 3, px: 5, mt: 2 }}>
          <Typography variant='h6' sx={{ mb: 1 }}>{material.materialTitle}</Typography>
          <Typography variant='body1'>LESSON DATE</Typography>
          <Typography variant='body2'>{material.materialDate}</Typography>
          <Card variant='outlined' sx={{ py: material.materialType == "Link" ? 2 : 1, px: 2, mt: 2, boxShadow: "none" }}>
            <embed src=
              "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf"
              width="100%"
              height="700"
              type="application/pdf"
              style={{ display: material.materialType == "PDF" ? "block" : "none" }} />
            <Link style={{ display: material.materialType == "Link" ? "flex" : "none" }} href={material.materialUrl} target="_blank"><InsertLinkIcon sx={{ mr: 0.5 }} />{material.materialTitle}</Link>
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