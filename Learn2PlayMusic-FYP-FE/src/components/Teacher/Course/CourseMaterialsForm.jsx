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
import ViewCourseMaterialComponent from "./ViewCourseMaterialComponent";

export default function CourseMaterialsForm() {
  const { courseid } = useParams();
  const { materialid } = useParams();
  const { type } = useParams();
  const { state } = useLocation();
  var course = state.course;
  var material = state.material;
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();

  const [classMaterialAttachment, setClassMaterialAttachment] = useState("");
  const [date, setDate] = useState(dayjs(material.MaterialLessonDate, "DD/MM/YYYY") || null);
  const [link, setLink] = useState(material.MaterialLink);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(material.MaterialTitle);
  const [uploadedFileURL, setUploadedFileURL] = useState("");

  const fileUploaded = (e) => {
    setFile(e.target.files[0]);
  };
  const handleRemoveFile = () => {
    setFile(null);
  };
  function b64toBlob(base64Data, contentType = "application/pdf", sliceSize = 512) {
    const byteCharacters = atob(base64Data.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, ""));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  function buildRequestBody(materialTypeStr, userTitle, userLink) {
    const requestBodyObject = {
      courseId: courseid,
      materialTitle: userTitle,
      materialLessonDate: date.toISOString(),
      materialLink: userLink,
      materialType: materialTypeStr,
      materialAttachment: classMaterialAttachment,
    };

    if (type === "edit") {
      requestBodyObject.materialId = materialid;
    }

    return JSON.stringify(requestBodyObject);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userTitle = data.get("title");
    const userLink = data.get("link");

    const validationResult = validateInput(userLink, userTitle);
    if (validationResult.error) {
      toast.error(validationResult.message);
      return;
    }
    const materialTypeStr = file ? file.type.split("/")[1].toUpperCase() : "Link";
    const requestBody = buildRequestBody(materialTypeStr, userTitle, userLink);
    const apiUrl = type === "new" ? `${import.meta.env.VITE_API_URL}/course/material` : `${import.meta.env.VITE_API_URL}/course/material`;
    const method = type === "new" ? "POST" : "PUT";

    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (response.status === 200) {
      const successMessage = type === "new" ? "Material added successfully!" : "Material edited successfully!";
      toast.success(successMessage);
      navigate(`/teacher/course/${courseid}/material`);
    } else {
      const errorMessage = type === "new" ? "Failed to add material!" : "Failed to edit material!";
      toast.error(errorMessage);
    }
  }

  function validateInput(userLink, userTitle) {
    if (userLink !== "" && file !== null) {
      return {
        error: true,
        message: "Please only upload one file or link!",
      };
    }
    if (userTitle === "" || (userLink === "" && file === null) || date.$d === "Invalid Date") {
      return {
        error: true,
        message: "Please fill in all the fields!",
      };
    }
    return {
      error: false,
    };
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

            {/* view */}
            {type == "view" ? (
              <ViewCourseMaterialComponent material={material} course={course} title={title} date={date} link={link} file={file} />
            ) : (
              // edit or delete ========================================================
              <>
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
                    <input hidden accept="application/pdf" multiple type="file" onChange={fileUploaded} />
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
                      {/* todo: link to download */}
                      {/* <Link href={uploadedFileURL} _target="blank" download={file.name}> */}
                      {file.name}
                      {/* </Link> */}
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
              </>
            )}
          </Container>
        </Box>
      </Card>
    </Container>
  );
}
