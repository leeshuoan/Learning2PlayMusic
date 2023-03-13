import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Button, Breadcrumbs, Card, Container, Typography, TextField, Link, IconButton, InputAdornment } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";

export default function CourseMaterialsForm() {
  const { courseid } = useParams();
  const { materialid } = useParams();
  const { type } = useParams();
  const { state } = useLocation();
  var course = state.course;
  var material = state.material;
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();

  const [date, setDate] = useState(dayjs(material.MaterialLessonDate, "DD/MM/YYYY") || null);
  const [link, setLink] = useState(material.MaterialLink);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(material.MaterialTitle);

  const fileUploaded = (e) => {
    setFile(e.target.files[0]);
  };
  const handleRemoveFile = () => {
    setFile(null);
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

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var userTitle = data.get("title");
    var userLink = data.get("link");
    // input validation
    if (userLink != "" && file != null) {
      toast.error("Please only upload one file or link!");
      return;
    }
    if (userTitle == "" || (userLink == "" && file == null) || date.$d == "Invalid Date") {
      toast.error("Please fill in all the fields!");
      return;
    }
    // processsing file
    let classMaterialAttachment = "";
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = (event) => {
        classMaterialAttachment = `data:${file.type};base64,${btoa(event.target.result)}`;
      };
    }
    let materialTypeStr = file ? file.type.split("/")[1].toUpperCase() : "Link";

    const body = JSON.stringify({
      materialTitle: userTitle,
      materialLink: userLink,
      materialLessonDate: date.toISOString(),
      materialType: materialTypeStr,
      materialS3Link: classMaterialAttachment,
      courseId: courseid,
      materialId: materialid,
    });
    // api calls
    console.log(body);
    if (type == "new") {
      fetch(`${import.meta.env.VITE_API_URL}/course/material`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      }).then((response) => {
        if (response.status == 200) {
          toast.success("Material added successfully!");
          navigate(`/teacher/course/${courseid}/material`);
        } else {
          toast.error("Failed to add material!");
        }
      });
    }
    if (type == "edit") {
      fetch(`${import.meta.env.VITE_API_URL}/course/material/${materialid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      }).then((response) => {
        if (response.status == 200) {
          toast.success("Material edited successfully!");
          navigate(`/teacher/course/${courseid}/material`);
        } else {
          toast.error("Failed to edit material!");
        }
      });
    }
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
      {/* breadcrumbs */}
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
      {/* body */}
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
        <Box sx={{ display: "flex", width: "100%" }} component="form" noValidate onSubmit={handleSubmit}>
          <Container maxWidth="xl">
            <Typography variant="h5" sx={{ color: "primary", mt: 3 }}>
              {type == "view" ? "View" : type == "edit" ? "Edit" : "New"} Class Material
            </Typography>
            <TextField required fullWidth id="title" name="title" label="Title" variant="outlined" defaultValue={title} sx={{ mt: 3 }} />
            <LocalizationProvider required dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Lesson Date*"
                sx={{ mt: 3 }}
                defaultValue={date}
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                component={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Upload File or Embed Link
            </Typography>
            {/* todo! handle file */}
            {file == null ? (
              <Button variant="outlined" sx={{ color: "text.primary", mt: 3 }} size="large" startIcon={<FileUploadIcon />} component="label">
                Upload File
                <input hidden accept="application/pdf" multiple type="file" onChange={fileUploaded} />{" "}
              </Button>
            ) : (
              <></>
            )}
            {file ? (
              <div>
                <Typography variant="body2" style={{ textDecoration: "underline" }}>
                  <IconButton onClick={handleRemoveFile}>
                    <ClearIcon />
                  </IconButton>

                  {file.name}
                </Typography>
              </div>
            ) : (
              <Typography variant="body2">No file uploaded yet</Typography>
            )}
            {/* handle link */}
            <TextField
              id="link"
              name="link"
              label="Embed Link"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InsertLinkIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mt: 3 }}
              defaultValue={link}
            />

            {/* buttons */}
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
                <Button variant="contained" type="submit">
                  {type == "new" ? "Post" : "Update"}
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
