import ClearIcon from "@mui/icons-material/Clear";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Box, Button, Card, Container, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../utils/CustomBreadcrumbs";

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
  // todo : handle when there is already an s3 link for the material

  // file handling
  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(null, reader.result);
    reader.onerror = (error) => callback(error, null);
  };
  const fileUploaded = (e) => {
    setFile(e.target.files[0]);
    fileToBase64(e.target.files[0], (err, result) => {
      if (result) {
        setClassMaterialAttachment(result);
      }
    });
  };
  const handleRemoveFile = () => {
    setFile(null);
  };

  // helper functions
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
  // end helper functions
  // submit
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
    console.log(requestBody);
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

  useEffect(() => {
    console.log(course);
    console.log(material);
    console.log(state);
    if (type == "edit") {
      var ary = material.MaterialLessonDate.split("/");
      setDate(dayjs(new Date(ary[2], ary[1], ary[0])));
      // uploadedFileURL;
      async function getSingleMaterial() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/course/material?courseId=${courseid}&materialId=${materialid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        return data;
      }
      getSingleMaterial().then((data) => {
        console.log(data);
        setUploadedFileURL(data.MaterialAttachment);
      });
      setFile("placeholder");
    }
  }, [course, material, state, uploadedFileURL]);
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      {/* breadcrumbs */}
      <CustomBreadcrumbs root="/teacher" links={[{ name: course.name, path: `/teacher/course/${courseid}/material` }]} breadcrumbEnding="Class Materials" />
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
              <Box sx={{ mt: 5 }}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Title
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {title}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {date.toISOString().split("T")[0]}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Attachment
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {link != "" ? (
                    <a href={"//" + link} target="_blank">
                      {link}
                    </a>
                  ) : (
                    <a href={uploadedFileURL} target="_blank">
                      {uploadedFileURL}
                    </a>
                  )}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{ color: "primary.main" }}
                    onClick={() => {
                      navigate(`/teacher/course/${courseid}/material`);
                    }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(`/teacher/course/${courseid}/material/edit/${materialid}`, { state: { material: material, course: course } });
                    }}>
                    Edit
                  </Button>
                </Box>
              </Box>
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
                      <Link href={uploadedFileURL} _target="blank" download={file}>
                        {file}
                      </Link>
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
