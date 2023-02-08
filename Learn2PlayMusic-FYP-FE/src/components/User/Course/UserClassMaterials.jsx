import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import courseImg from '../../../assets/course.png'

const UserClassMaterials = () => {
  const course = {
    title: "Grade 1 Piano",
    date: "21 Mar 2023",
    teacher: "Miss Felicia Ng"
  }

  const courseMaterials = [
    {
      id: 1,
      title: "Lesson 2",
      materials: [
        {
          materialId: 1,
          materialTitle: "Exercise 2",
          materialType: "PDF",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        {
          materialId: 2,
          materialTitle: "Exercise 1",
          materialType: "Link",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
      ]
    },
    {
      id: 2,
      title: "Lesson 1",
      materials: [
        {
          materialId: 1,
          materialTitle: "Exercise 2",
          materialType: "PDF",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        {
          materialId: 2,
          materialTitle: "Exercise 1",
          materialType: "Link",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
      ]
    },
  ]

  useEffect(() => {
    console.log("selectedTab:" + selectedTab)
    console.log("selectedMaterial" + selectedMaterial)
  })

  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(1)
  const [selectedMaterial, setSelectedMaterial] = useState(1)

  return (
    <Container maxWidth="xl" sx={{ width: 0.9 }}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => { navigate('/home') }}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link underline="hover" color="inherit" onClick={() => { navigate('/home/course/1') }}>
          Course
        </Link>
        <Typography color="text.primary">Class Materials</Typography>
      </Breadcrumbs>

      <Card sx={{ py: 2, px: 3, mt: 2, display: { xs: "none", sm: "flex" } }}>
        <img src={courseImg} style={{ maxWidth: 110, borderRadius: 10 }}></img>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ ml: 2, mb: 1 }}>
            <Typography variant='h5' sx={{ color: "primary.main" }}>{course.title}</Typography>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>Date: {course.date}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          <Box sx={{ ml: 2, mb: 1 }}>
            <Typography variant='subtitle1' sx={{ mb: 0.5 }}>{course.teacher}</Typography>
            <Typography variant='body2' sx={{ textAlign: "right" }}>Teacher</Typography>
          </Box>
        </Box>
      </Card>

      <Card sx={{ py: 2, px: 3, mt: 2, display: { xs: "flex", sm: "none" } }}>
        <img src={courseImg} style={{ maxWidth: 110, borderRadius: 10 }}></img>
        <Box sx={{ display: "", alignItems: "center" }}>
          <Box sx={{ ml: 2, mb: 1 }}>
            <Typography variant='h5' sx={{ color: "primary.main" }}>{course.title}</Typography>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>Date: {course.date}</Typography>
          </Box>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography variant='subtitle1' >{course.teacher}</Typography>
            <Typography variant='body2' >Teacher</Typography>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={2} sx={{ pt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ py: 2, px: 3, mt: 2, display: { xs: "none", sm: "block" } }}>
            {courseMaterials.map((courseMaterial) => (
              <MenuItem sx={{ mb: 1, color: selectedTab == courseMaterial.id ? "primary.main" : "", "&:hover": { color: "primary.main" } }} onClick={() => setSelectedTab(courseMaterial.id)}>
                <Typography variant='subtitle1'>{courseMaterial.title}</Typography>
              </MenuItem>
            ))}
          </Card>

          <Card sx={{ py: { sm: 1 }, px: 1, display: { xs: "block", sm: "none" } }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant='h5' sx={{ color: "primary.main" }}>
                    {selectedTab}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {courseMaterials.map((courseMaterial) => (
                  <MenuItem sx={{ mb: 0.5, color: selectedTab == courseMaterial.id ? "primary.main" : "", "&:hover": { color: "primary.main" } }} onClick={() => setSelectedTab(courseMaterial.id)}>
                    <Typography variant='subtitle1'>{courseMaterial.title}</Typography>
                  </MenuItem>
                ))}
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {courseMaterials.map((courseMaterial) => (
            <Box sx={{ display: courseMaterial.id == selectedTab  ? "block" : "none" }}>
              {courseMaterial.materials.map((material) => (
                <Card sx={{ py: 3, px: 5, mt: 2 }} >
                  <Typography variant='h6' >{courseMaterial.title} {material.materialTitle}</Typography>
                </Card>
              ))}
            </Box>
          ))}
        </Grid>

      </Grid>
    </Container>
  )
}

export default UserClassMaterials