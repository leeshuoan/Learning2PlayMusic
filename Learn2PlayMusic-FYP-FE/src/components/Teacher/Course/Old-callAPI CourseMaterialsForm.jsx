// Coursematerialsform uses "useLocation" instead of calling API

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Button, Breadcrumbs, Card, Container, Typography, TextField, Link, Alert, Snackbar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useEffect, useState } from "react";

export default function CourseMaterialsForm() {
  const [alert, setAlert] = useState(false);
  const [course, setCourse] = useState({});
  const [courseMaterial, setCourseMaterial] = useState({});
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { materialid } = useParams();
  const { type } = useParams();

  const closeAlert = () => {
    setAlert(false);
  };
  const openAlert = () => {
    setAlert(true);
  };

  // call APIs to get data
  const getCourseAPI = `${import.meta.env.VITE_API_URL}/course?courseId=${courseid}`;
  const getMaterialAPI = `${import.meta.env.VITE_API_URL}/course/material?courseId=${courseid}&materialId=${materialid}`;
  async function getCourse() {
    const response = await fetch(getCourseAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
    const data = await response.json();
    const courseData = {
      id: data[0].SK.split("#")[1],
      name: data[0].CourseName,
      timeslot: data[0].CourseSlot,
      teacher: data[0].TeacherName,
    };
    setCourse(courseData);
  }
  async function getMaterial() {
    const response = await fetch(getMaterialAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
    const data = await response.json();

    const materialData = {
      MaterialLessonDate: data[0].MaterialLessonDate,
      MaterialLink: data[0].MaterialLink,
      MaterialS3Link: data[0].MaterialS3Link,
      MaterialTitle: data[0].MaterialTitle,
      MaterialType: data[0].MaterialType,
      PK: data[0].PK,
      SK: data[0].SK,
      id: data[0].SK.split("#")[1],
    };
    setCourseMaterial(materialData);
  }

  async function handleAddMaterial(title, content) {
    // add API Call here
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        courseId: courseid,
        content: content,
        title: title,
      },
    });
    return response;
  }
  async function handleEditMaterial(title, content) {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        courseId: course.id,
        content: content,
        title: title,
      },
    });
    return response;
  }

  async function handleSubmit() {
    // if (title == "" || content == "") {
    //   openAlert();
    //   return;
    // }
    // if (state.title == "") {
    //   var response = await Promise(handleAddMaterial(title, content));
    // } else {
    //   var response = await Promise(handleEditMaterial(title, content));
    // }
    // setTitle("");
    // setContent("");
    // if (response.status == 200) {
    //   navigate(`/teacher/course/${course.id}`);
    // }
  }
  useEffect(() => {
    async function fetchData() {
      const [data1, data2] = await Promise.all([getCourse(), getMaterial()]);
      console.log(data1);
      const courseData = {
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);
      const materialData = {
        MaterialLessonDate: data2[0].MaterialLessonDate,
        MaterialLink: data2[0].MaterialLink,
        MaterialS3Link: data2[0].MaterialS3Link,
        MaterialTitle: data2[0].MaterialTitle,
        MaterialType: data2[0].MaterialType,
        PK: data2[0].PK,
        SK: data2[0].SK,
        id: data2[0].SK.split("#")[1],
      };
      setCourseMaterial(materialData);
    }
    fetchData();
    console.log(courseMaterial);
    console.log(course);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Snackbar open={alert} autoHideDuration={6000} onClose={closeAlert}>
        <Alert severity="error" sx={{ mt: 3 }} onClose={closeAlert}>
          <strong>Please fill in all the fields!</strong>
        </Alert>
      </Snackbar>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            navigate("/teacher");
          }}>
          <HomeIcon sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            navigate(`/teacher/course/${course.id}`);
          }}>
          <Typography color="text.primary">{course.name}</Typography>
        </Link>
        <Typography color="text.primary">Class Material</Typography>
      </Breadcrumbs>
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" sx={{ color: "primary.main" }}>
              {}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date: {}
            </Typography>
          </Box>
        </Box>
      </Card>
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Container maxWidth="xl">
            <Typography variant="h5" sx={{ color: "primary", mt: 3 }}>
              {type == "" ? "New" : "Edit"} Class Material
            </Typography>

            <TextField
              required
              fullWidth
              id="title"
              label="Title"
              variant="outlined"
              defaultValue={courseMaterial.MaterialTitle}
              onChange={() => {
                setTitle(event.target.value);
              }}
              sx={{ mt: 3 }}
            />

            <TextField
              required
              fullWidth
              id="description"
              label="Description"
              variant="outlined"
              // defaultValue={state.description}
              multiline
              rows={10}
              onChange={() => {
                setContent(event.target.value);
              }}
              sx={{ mt: 3 }}
            />
            {type != "view" ? (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 1 }}>
                <Button
                  variant="outlined"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    navigate(`/teacher/course/${course.id}/material`);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                  {type == "" ? "Post" : "Update"}
                </Button>
              </Box>
            ) : (
              ""
            )}
          </Container>
        </Box>
      </Card>
    </Container>
  );
}
