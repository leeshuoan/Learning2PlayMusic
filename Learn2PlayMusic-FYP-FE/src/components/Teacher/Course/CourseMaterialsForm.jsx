import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Button, Breadcrumbs, Card, Container, Typography, TextField, Link, Alert, Snackbar, InputAdornment } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function CourseMaterialsForm() {
  dayjs.extend(customParseFormat);
  const [date, setDate] = useState(dayjs());
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { materialid } = useParams();
  const { type } = useParams();
  const { state } = useLocation();
  var course = state.course;
  var material = state.material;
  const closeAlert = () => {
    setAlert(false);
  };
  const openAlert = () => {
    setAlert(true);
  };

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
    console.log(course);
    console.log(state);
    if (type == "edit") {
      var ary = material.MaterialLessonDate.split("/");
      setDate(dayjs(new Date(ary[2], ary[1], ary[0])));
    }
  }, [course, state]);
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
            navigate(`/teacher/course/${courseid}/material`);
          }}>
          <Typography color="text.primary">{course.name}</Typography>
        </Link>
        <Typography color="text.primary">Class Material</Typography>
      </Breadcrumbs>
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" sx={{ color: "primary.main" }}>
              {course.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Timeslot: {course.timeslot}
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
              defaultValue={material.MaterialTitle}
              onChange={(newVal) => {
                setTitle(newVal);
              }}
              sx={{ mt: 3 }}
            />
            <LocalizationProvider required dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Lesson Date*"
                openTo="year"
                views={["year", "month", "day"]}
                sx={{ mt: 3 }}
                defaultValue={dayjs(material.MaterialLessonDate, "DD/MM/YYYY")}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
              />
            </LocalizationProvider>

            {/* <Typography variant="body2" sx={{ mt: 3 }}>
              Upload File
            </Typography> */}
            <br></br>
            {/* todo! handle file */}
            <Button variant="outlined" sx={{ mt: 3, color: "text.primary" }} startIcon={<FileUploadIcon />}>
              Upload File
              <input type="file" hidden />
            </Button>

            <Typography variant="caption" sx={{ ml: 2, mt: 5 }}>
              file.pdf
            </Typography>
            <br></br>
            {/* todo! handle link */}
            <TextField
              id="link"
              label="Embed Link"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InsertLinkIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mt: 3 }}
              defaultValue={material.MaterialLink}
            />
            {type != "view" ? (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 1 }}>
                <Button
                  variant="outlined"
                  sx={{ color: "primary.main" }}
                  onClick={() => {
                    navigate(`/teacher/course/${courseid}/material`);
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
