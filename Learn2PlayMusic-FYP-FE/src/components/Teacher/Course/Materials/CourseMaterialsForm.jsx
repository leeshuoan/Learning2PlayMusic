import ClearIcon from "@mui/icons-material/Clear";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Backdrop, Box, Button, Card, CircularProgress, Container, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../../../utils/CustomBreadcrumbs";

const CourseMaterialsForm = ({ userInfo }) => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();
  const { courseid } = useParams();
  const { materialid } = useParams();
  const { type } = useParams();

  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({});
  const [date, setDate] = useState(null);
  const [embeddedLink, setEmbeddedLink] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [base64Attachment, setBase64Attachment] = useState(""); // base 64 file
  const [s3Url, setS3Url] = useState(""); // s3 link
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
    setFileName(e.target.files[0].name);
    fileToBase64(e.target.files[0], (err, result) => {
      if (result) {
        setBase64Attachment(result);
      }
    });
  };
  const handleRemoveFile = () => {
    setFile(null);
    setFileName(null);
    setBase64Attachment("");
    setS3Url("");
  };

  // helper functions
  function buildRequestBody(materialTypeStr) {
    const requestBodyObject = {
      courseId: courseid,
      materialTitle: title,
      materialLessonDate: date.toISOString(),
      materialLink: embeddedLink,
      materialType: materialTypeStr,
      materialAttachment: base64Attachment,
      materialAttachmentFileName: fileName,
    };
    if (type === "edit") {
      requestBodyObject.materialId = materialid;
    }
    return JSON.stringify(requestBodyObject);
  }
  function validateInput() {
    if (embeddedLink !== "" && file !== null) {
      return {
        error: true,
        message: "Please only upload one file or link!",
      };
    }
    if (title === "" || (embeddedLink === "" && file === null) || date.$d === "Invalid Date") {
      return {
        error: true,
        message: "Please fill in all the fields!",
      };
    }
    return {
      error: false,
    };
  }
  // submit ==============================================================================================================================================
  async function handleSubmit() {
    const validationResult = validateInput();
    if (validationResult.error) {
      toast.error(validationResult.message);
      return;
    }
    const materialTypeStr = file ? file.type.split("/")[1].toUpperCase() : "Link";
    const requestBody = buildRequestBody(materialTypeStr);
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
  // ========================================================================================================================
  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
  const getCourseAPI = request(`/course?courseId=${courseid}`);
  const getMaterialAPI = request(`/course/material?courseId=${courseid}&materialId=${materialid}`);

  useEffect(() => {
    //  the page is not rendering properly when the data is fetched in the useEffect, help me fix this

    async function fetchData() {
      var data1 = {};
      var data2 = {};
      if (type == "new") {
        data1 = await getCourseAPI;
      } else {
        [data1, data2] = await Promise.all([getCourseAPI, getMaterialAPI]);
      }
      console.log(data1[0]);
      console.log(data2);
      let courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      if (type != "new") {
        let fetchedDate = type == "view" ? data2.MaterialLessonDate.split("T")[0] : dayjs(data2.MaterialLessonDate, "YYYY-MM-DD");
        setTitle(data2.MaterialTitle);
        setEmbeddedLink(data2.MaterialLink);
        console.log(data2.MaterialLink);
        setS3Url(data2.MaterialAttachment);

        if (type == "edit" && data2.MaterialLink == "") {
          setFile("cloudFile");
          setFileName("cloudFile");
          // setFile(data2.MaterialAttachmentFileName);
        }
        setDate(fetchedDate);
        console.log(fetchedDate);
      }
    }
    fetchData().then(() => {
      setOpen(false);
    });
    // setDate(dayjs(new Date(ary[2], ary[1], ary[0])));
    //       setS3Url(data.MaterialAttachment);
    //     });
    //     setFile("placeholder");
    //   }
    //   setOpen(false);
    // });
  }, []);

  // ========================================================================================================================
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
        <Box sx={{ display: "flex", width: "100%" }}>
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
                  {date}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Attachment
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {embeddedLink != "" ? (
                    <a href={"//" + embeddedLink} target="_blank">
                      {embeddedLink}
                    </a>
                  ) : (
                    <a href={s3Url} target="_blank">
                      {s3Url}
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
                      navigate(`/teacher/course/${courseid}/material/edit/${materialid}`);
                    }}>
                    Edit
                  </Button>
                </Box>
              </Box>
            ) : (
              // edit or delete ========================================================
              <>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(newValue) => {
                    setTitle(newValue);
                  }}
                  sx={{ mt: 3 }}
                />
                <LocalizationProvider required dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Lesson Date*"
                    sx={{ mt: 3 }}
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
                      <Link href={s3Url} _target="blank">
                        {fileName}
                      </Link>
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="body2">No file uploaded yet</Typography>
                )}
                {/* handle link */}
                <TextField
                  label="Embedded Link"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InsertLinkIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setEmbeddedLink("");
                          }}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ mt: 3 }}
                  value={embeddedLink}
                  onChange={(newValue) => {
                    setEmbeddedLink(newValue);
                  }}
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
                  <Button variant="contained" onClick={handleSubmit}>
                    {type == "new" ? "Post" : "Update"}
                  </Button>
                </Box>
              </>
            )}
          </Container>
        </Box>
      </Card>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default CourseMaterialsForm;
