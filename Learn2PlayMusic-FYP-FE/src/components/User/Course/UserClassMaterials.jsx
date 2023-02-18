import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const UserClassMaterials = () => {
  const course = {
    id: 1,
    title: "Grade 1 Piano",
    date: "21 Mar 2023",
    teacher: "Miss Felicia Ng"
  }

  const courseMaterials = [
    {
      id: 1,
      title: "Lesson 1",
      materials: [
        {
          materialId: 1,
          materialTitle: "Exercise 1",
          materialType: "PDF",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        {
          materialId: 2,
          materialTitle: "Exercise 2",
          materialType: "Link",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
      ]
    },
    {
      id: 2,
      title: "Lesson 2",
      materials: [
        {
          materialId: 1,
          materialTitle: "Exercise 1",
          materialType: "PDF",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        {
          materialId: 2,
          materialTitle: "Exercise 2",
          materialType: "Link",
          materialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
      ]
    },
  ]

  const navigate = useNavigate()
  const { categoryId } = useParams()
  const { materialId } = useParams()
  const [selectedTab, setSelectedTab] = useState(categoryId)
  const [selectedMaterial, setSelectedMaterial] = useState(materialId)

  const changeTab = (id) => {
    setSelectedTab(id)
    setSelectedMaterial(1)
    navigate(`/home/course/${course.id}/material/${id}/1`)
  }

  const changeMaterial = (id) => {
    setSelectedMaterial(id)
    navigate(`/home/course/${course.id}/material/${selectedTab}/${id}`)
  }

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => { navigate('/home') }}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link underline="hover" color="inherit" onClick={() => { navigate('/home/course/1/material') }}>
          {course.title}
        </Link>
        <Typography color="text.primary">Class Materials</Typography>
      </Breadcrumbs>

      <Card sx={{ py: 2, px: 3, mt: 2, display: { xs: "none", sm: "flex" } }}>
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
              <MenuItem sx={{ mb: 1, color: selectedTab == courseMaterial.id ? "primary.main" : "", "&:hover": { color: "primary.main" } }} onClick={() => changeTab(courseMaterial.id)}>
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
                  <MenuItem sx={{ mb: 0.5, color: selectedTab == courseMaterial.id ? "primary.main" : "", "&:hover": { color: "primary.main" } }} onClick={() => changeTab(courseMaterial.id)}>
                    <Typography variant='subtitle1'>{courseMaterial.title}</Typography>
                  </MenuItem>
                ))}
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {courseMaterials.map((courseMaterial) => (
            <Box sx={{ display: courseMaterial.id == categoryId ? "block" : "none" }}>
              {courseMaterial.materials.map((material) => (
                <Card sx={{ py: 3, px: 5, mt: 2, display: material.materialId == selectedMaterial ? "block" : "none" }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant='subsubtitle'>{selectedMaterial}/{courseMaterial.materials.length}</Typography>
                  </Box>
                  <Grid container>
                    <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-start", pl: 3 }}>
                      <Button variant="contained" size="small" sx={{ display: selectedMaterial == 1 ? "none" : "block" }} onClick={() => changeMaterial(parseInt(selectedMaterial) - 1)}>PREVIOUS</Button>
                      <Button variant="contained" size="small" sx={{ display: selectedMaterial == 1 ? "block" : "none" }} disabled>PREVIOUS</Button>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <Typography variant='h6'>{material.materialTitle}</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end", pr: 3 }}>
                      <Button variant="contained" size="small" sx={{ display: selectedMaterial == courseMaterial.materials.length ? "none" : "block" }} onClick={() => changeMaterial(parseInt(selectedMaterial) + 1)}>NEXT</Button>
                      <Button variant="contained" size="small" sx={{ display: selectedMaterial == courseMaterial.materials.length ? "block" : "none" }} disabled>NEXT</Button>
                    </Grid>
                  </Grid>
                  <Card variant='outlined' sx={{ py: material.materialType == "Link" ? 2 : 1, px: 2, mt: 2, boxShadow: "none"  }}>
                    <embed src=
                      "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf"
                      width="100%"
                      height="700"
                      type="application/pdf"
                      style={{ display: material.materialType == "PDF" ? "block" : "none" }} />
                    <Link style={{ display: material.materialType == "Link" ? "flex" : "none" }} href={material.materialUrl} target="_blank"><InsertLinkIcon sx={{mr: 0.5}}/>{material.materialTitle}</Link>
                  </Card>
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