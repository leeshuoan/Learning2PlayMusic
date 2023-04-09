import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Container, Grid, IconButton, Link, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
import Loader from "../utils/Loader";
import TransitionModal from "../utils/TransitionModal";
import { handleCourseAnnouncements, handleCourseClassList, handleCourseHomework, handleCourseInfo, handleCourseMaterial, handleCourseQuiz } from "./DataLoadingFunctions";

const TeacherCourse = ({ userInfo }) => {
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({});
  const [courseHomework, setCourseHomework] = useState([]);
  const [courseMaterial, setCourseMaterial] = useState([]);
  const [courseQuiz, setCourseQuiz] = useState([]);
  const [courseAnnouncements, setCourseAnnouncements] = useState([]);
  const [refreshUseEffect, setRefreshUseEffect] = useState(false);
  // for deletion modal
  const [deleteAnnouncementModal, setDeleteAnnouncementModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deleteMaterialModal, setDeleteMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [deleteQuizModal, setDeleteQuizModal] = useState(false);
  const [visibilityQuizModal, setVisibilityQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({ Visibility: false });
  const [deleteHomeworkModal, setDeleteHomeworkModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [classList, setClassList] = useState([]);

  // navigate pages
  const navigate = useNavigate();
  const { category } = useParams();
  const { courseid } = useParams();
  const menuOptions = ["Announcements", "Class Materials", "Quizzes", "Homework", "Class List"];
  const routeMenuMapping = {
    announcement: "Announcements",
    material: "Class Materials",
    quiz: "Quizzes",
    homework: "Homework",
    classlist: "Class List",
  };

  // api calls
  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return response.json();
  }

  const getCourseAPI = request(`/course?courseId=${courseid}`);
  const getCourseAnnouncementsAPI = request(`/course/announcement?courseId=${courseid}`);
  const getMaterialAPI = request(`/course/material?courseId=${courseid}`);
  const getHomeworkAPI = request(`/course/homework?courseId=${courseid}`);
  const getQuizAPI = request(`/course/quiz?courseId=${courseid}`);
  const getClassListAPI = request(`/course/classlist?courseId=${courseid}`);
  // announcement table configs
  const courseAnnouncementColumns = useMemo(
    () => [
      {
        accessorKey: "Title",
        id: "title",
        size: 50, //SMALL

        header: "Title",
        Cell: ({ cell, row }) => <Link onClick={() => navigate(`/teacher/course/${courseid}/announcement/view/${row.original.id}`)}>{row.original.Title}</Link>,
      },
      {
        accessorKey: "Date",
        id: "date",
        header: "Post Date",
        size: 50, //medium
        sortingFn: "datetime",
        Cell: ({ cell, row }) => <Typography variant="body2">{new Date(row.original.Date).toLocaleDateString()}</Typography>,
      },
      {
        accessorKey: "Content",
        id: "content",
        header: "Content",
        size: 100, //medium
        maxWidth: 100,
        Cell: ({ cell, row }) => (
          <Typography sx={{ maxWidth: 350 }} variant="body2">
            {row.original.Content.length > 50 ? row.original.Content.substring(0, 50) + "..." : row.original.Content}
          </Typography>
        ),
      },
      {
        accessorKey: "",
        id: "actions",
        header: "Actions",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}>
            <Tooltip title="Edit" placement="bottom">
              <IconButton
                onClick={() => {
                  navigate(`/teacher/course/${courseid}/announcement/edit/${row.original.id}`);
                }}>
                <EditIcon></EditIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="bottom">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedAnnouncement(row.original.id);
                  setDeleteAnnouncementModal(true);
                }}>
                <DeleteForeverIcon></DeleteForeverIcon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );
  // material table configs
  const courseMaterialsColumns = useMemo(
    () => [
      {
        accessorKey: "MaterialTitle",
        id: "title",
        size: 50, //SMALL
        header: "Title",
        Cell: ({ cell, row }) => <Link onClick={() => navigate(`/teacher/course/${courseid}/material/view/${row.original.id}`)}>{row.original.MaterialTitle}</Link>,
      },
      {
        accessorKey: "MaterialType",
        id: "type",
        header: "Type",
        size: 50, //SMALL
      },
      {
        accessorKey: "MaterialLessonDate",
        id: "lessonDate",
        header: "Lesson Date",
        size: 50, //SMALL
      },
      {
        accessorKey: "Actions",
        id: "actions",
        header: "Actions",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}>
            <Tooltip title="Edit" placement="bottom">
              <IconButton
                onClick={() => {
                  navigate(`/teacher/course/${courseid}/material/edit/${row.original.id}`);
                }}>
                <EditIcon></EditIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="bottom">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedMaterial(row.original.id);
                  setDeleteMaterialModal(true);
                }}>
                <DeleteForeverIcon></DeleteForeverIcon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );
  // quiz table configs
  const courseQuizColumns = useMemo(
    () => [
      {
        accessorKey: "QuizTitle",
        id: "quizTitle",
        header: "Title",
        size: 50, //SMALL

        Cell: ({ cell, row }) => (
          <Tooltip title="View Quiz Summary" placement="bottom">
            <Link onClick={() => navigate(`/teacher/course/${courseid}/quiz/summary/${row.original.id}`)}>{row.original.QuizTitle}</Link>
          </Tooltip>
        ),
      },
      {
        accessorKey: "QuizDescription",
        id: "quizDescription",
        header: "Description",
        size: 100,
      },
      {
        accessorKey: "QuizMaxAttempts",
        id: "quizMaxAttempts",
        header: "Maximum Attempts",
        width: 20,
      },
      {
        accessorKey: "",
        id: "actions",
        header: "Actions",
        Cell: ({ cell, row }) => (
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
            <Typography variant="button">
              <Link
                onClick={() => {
                  setSelectedQuiz(quiz);
                  setVisibilityQuizModal(true);
                }}>
                <Box sx={{ display: row.original.Visibility ? "flex" : "none", alignItems: "center" }}>
                  <IconButton color="success">
                    <Tooltip title="Hide?" placement="bottom">
                      <VisibilityIcon />
                    </Tooltip>
                  </IconButton>
                </Box>
                <Box sx={{ display: row.original.Visibility ? "none" : "flex", alignItems: "center" }}>
                  <IconButton color="error">
                    <Tooltip title="Show?" placement="bottom">
                      <VisibilityOffIcon />
                    </Tooltip>
                  </IconButton>
                </Box>
              </Link>
            </Typography>
            <Tooltip title="Edit" placement="bottom">
              <IconButton
                onClick={() => {
                  navigate(`/teacher/course/${courseid}/quiz/edit/${row.original.id}`);
                }}>
                <EditIcon></EditIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="bottom">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedQuiz(row.original);
                  setDeleteQuizModal(true);
                }}>
                <DeleteForeverIcon></DeleteForeverIcon>
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    []
  );
  // homework table configs
  const courseHomeworkColumns = useMemo(
    () => [
      {
        accessorKey: "HomeworkTitle",
        id: "title",
        header: "Title",
        size: 50, //SMALL
        Cell: ({ cell, row }) => <Link onClick={() => navigate(`/teacher/course/${courseid}/homework/view/${row.original.id}`)}>{row.original.HomeworkTitle}</Link>,
      },
      {
        accessorKey: "HomeworkDueDate",
        id: "date",
        header: "Due Date",
        size: 50, //medium
        sortingFn: "datetime",
        Cell: ({ cell, row }) => <Typography variant="body2">{new Date(row.original.HomeworkDueDate).toLocaleDateString()}</Typography>,
      },
      {
        accessorKey: "HomeworkDescription",
        id: "description",
        header: "Description",
      },
      {
        accessorKey: "",
        id: "actions",
        header: "Actions",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "right",
              gap: "2px",
            }}>
            <Tooltip title="Edit" placement="bottom">
              <IconButton
                onClick={() => {
                  navigate(`/teacher/course/${courseid}/homework/edit/${row.original.id}`);
                }}>
                <EditIcon></EditIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="bottom">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedHomework(row.original);
                  setDeleteHomeworkModal(true);
                }}>
                <DeleteForeverIcon></DeleteForeverIcon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );
  // class list table configs
  const classListColumns = useMemo(
    () => [
      {
        accessorKey: "studentName",
        id: "studentName",
        header: "Student Name",
      },
      {
        accessorKey: "ParticipationPoints",
        id: "participationPoints",
        header: "Participation Points",
      },
      {
        accessorKey: "ProgressReport",
        id: "progressReport",
        header: "Progress Report",
        Cell: ({ cell, row }) => (
          <Link underline="hover" onClick={() => navigate(`/teacher/course/${courseid}/report/${row.original.studentId}`)} sx={{ justifyContent: "center", alignItems: "center" }}>
            <Typography variant="button" sx={{ display: "flex", alignItems: "center" }}>
              <FileOpenIcon fontSize="inherit" />
              &nbsp;OPEN
            </Typography>
          </Link>
        ),
      },
    ],
    []
  );

  // announcement delete announcement
  async function deleteAnnouncement() {
    setOpen(true);
    fetch(`${import.meta.env.VITE_API_URL}/course/announcement?courseId=${courseid}&announcementId=${selectedAnnouncement}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setCourseAnnouncements(courseAnnouncements.filter((announcement) => announcement.id !== selectedAnnouncement));
        // reset
        toast.success("Announcement deleted successfully");
        setSelectedAnnouncement(null);
        setDeleteAnnouncementModal(false);
        setRefreshUseEffect(!refreshUseEffect);
        setOpen(false);
        return;
      } else {
        toast.error("An unexpected error occured");
        setSelectedAnnouncement(null);
        setDeleteAnnouncementModal(false);
        setRefreshUseEffect(!refreshUseEffect);
        setOpen(false);
        return;
      }
    });
  }
  async function deleteMaterial() {
    setOpen(true);
    fetch(`${import.meta.env.VITE_API_URL}/course/material`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        courseId: courseid,
        materialId: selectedMaterial,
      }),
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        setCourseMaterial(courseMaterial.filter((material) => material.id !== selectedMaterial));
        toast.success("Material deleted successfully");
        // reset
        setOpen(false);
        setSelectedMaterial(null);
        setDeleteMaterialModal(false);
        setRefreshUseEffect(!refreshUseEffect);
        return;
      } else {
        toast.error("An unexpected error occured");
        // reset
        setOpen(false);
        setSelectedMaterial(null);
        setDeleteMaterialModal(false);
        setRefreshUseEffect(!refreshUseEffect);
        return;
      }
    });
  }

  async function deleteQuiz() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/course/quiz`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        courseId: courseid,
        quizId: selectedQuiz.id,
      }),
    });
    if (res.status !== 200) {
      console.log(res);
      toast.error("An unexpected error occured");
      return;
    }

    toast.success("Quiz deleted successfully");
    setSelectedQuiz({ Visibility: false });
    setDeleteQuizModal(false);
    setOpen(true);
    setRefreshUseEffect(!refreshUseEffect);
  }

  async function deleteHomework() {
    console.log(selectedHomework);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/course/homework`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        courseId: courseid,
        homeworkId: selectedHomework.id,
      }),
    });
    if (res.status !== 200) {
      console.log(res);
      toast.error("An unexpected error occured");
      return;
    }

    toast.success("Homework deleted successfully");
    setSelectedHomework();
    setDeleteHomeworkModal(false);
    setOpen(true);
    setRefreshUseEffect(!refreshUseEffect);
  }

  async function changeQuizVisibility(newVisibility) {
    console.log(selectedQuiz);
    const newQuizData = {
      visibility: newVisibility,
      quizId: selectedQuiz.id,
      quizMaxAttempts: selectedQuiz.QuizMaxAttempts,
      quizDescription: selectedQuiz.QuizDescription,
      quizTitle: selectedQuiz.QuizTitle,
      courseId: courseid,
    };
    console.log(newQuizData);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/course/quiz`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(newQuizData),
    });
    if (res.status !== 202) {
      console.log(res);
      toast.error("An unexpected error occured");
      return;
    }

    toast.success("Quiz visibility changed successfully");
    setSelectedQuiz({ Visibility: null });
    setVisibilityQuizModal(false);
    setOpen(true);
    setRefreshUseEffect(!refreshUseEffect);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        await handleCourseInfo(getCourseAPI, setCourse);
        switch (category) {
          case "classlist":
            console.log("classlist");
            await handleCourseClassList(getClassListAPI, setClassList);
            break;
          case "announcement":
            console.log("announcement");
            await handleCourseAnnouncements(getCourseAnnouncementsAPI, setCourseAnnouncements);
            console.log(courseAnnouncements);
            break;
          case "material":
            console.log("material");
            await handleCourseMaterial(getMaterialAPI, setCourseMaterial);
            break;
          case "quiz":
            console.log("quiz");
            await handleCourseQuiz(getQuizAPI, setCourseQuiz);
            break;
          case "homework":
            console.log("homework");
            await handleCourseHomework(getHomeworkAPI, setCourseHomework);
            console.log(courseHomework);
            break;
          default:
            await handleCourseAnnouncements(getCourseAnnouncementsAPI, setCourseAnnouncements);
            break;
        }
        setOpen(false);
      } catch (error) {
        setOpen(false);
        toast.error("An unexpected error occured");
      }
    }

    fetchData();
  }, [refreshUseEffect, userInfo]);

  async function menuNavigate(option) {
    setOpen(true);
    switch (option) {
      case "Announcements":
        navigate(`/teacher/course/${course.id}/announcement`);
        await handleCourseAnnouncements(getCourseAnnouncementsAPI, setCourseAnnouncements);
        break;
      case "Class Materials":
        navigate(`/teacher/course/${course.id}/material`);
        await handleCourseMaterial(getMaterialAPI, setCourseMaterial);
        break;
      case "Quizzes":
        navigate(`/teacher/course/${course.id}/quiz`);
        await handleCourseQuiz(getQuizAPI, setCourseQuiz);
        break;
      case "Homework":
        navigate(`/teacher/course/${course.id}/homework`);
        await handleCourseHomework(getHomeworkAPI, setCourseHomework);
        break;
      case "Class List":
        navigate(`/teacher/course/${course.id}/classlist`);
        await handleCourseClassList(getClassListAPI, setClassList);
        break;
      default:
        break;
    }
    setOpen(false);
  }

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      {/* Delete announement modal ========================================================================================================================*/}
      <TransitionModal
        open={deleteAnnouncementModal}
        handleClose={() => {
          setDeleteAnnouncementModal(false);
        }}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Announcement
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to delete this announcement?
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mr: 1, color: "primary.main" }}
            onClick={() => {
              setDeleteAnnouncementModal(false);
            }}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" color="error" onClick={deleteAnnouncement}>
            Delete
          </Button>
        </Box>
        <Loader open={open} />
      </TransitionModal>
      {/* Delete material modal ========================================================================================================================*/}
      <TransitionModal
        open={deleteMaterialModal}
        handleClose={() => {
          setDeleteMaterialModal(false);
        }}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Material
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to delete this material?
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mr: 1, color: "primary.main" }}
            onClick={() => {
              setDeleteMaterialModal(false);
            }}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" color="error" onClick={deleteMaterial}>
            Delete
          </Button>
        </Box>
      </TransitionModal>
      {/* Delete quiz modal ========================================================================================================================*/}
      <TransitionModal
        open={deleteQuizModal}
        handleClose={() => {
          setDeleteQuizModal(false);
        }}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Quiz
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to delete this quiz?
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mr: 1, color: "primary.main" }}
            onClick={() => {
              setDeleteQuizModal(false);
            }}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" color="error" onClick={deleteQuiz}>
            Delete
          </Button>
        </Box>
      </TransitionModal>
      {/* Visibility quiz modal ========================================================================================================================*/}
      <TransitionModal
        open={visibilityQuizModal}
        handleClose={() => {
          setVisibilityQuizModal(false);
        }}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Change Quiz Visibility
          </Typography>

          <Box sx={{ display: selectedQuiz.Visibility ? "block" : "none" }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Are you sure you want to hide this quiz?
            </Typography>
          </Box>
          <Box sx={{ display: selectedQuiz.Visibility ? "none" : "block" }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Are you sure you want to make this quiz visible?
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mr: 1, color: "primary.main" }}
            onClick={() => {
              setVisibilityQuizModal(false);
            }}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              changeQuizVisibility(false);
            }}
            sx={{ display: selectedQuiz.Visibility ? "block" : "none" }}>
            Hide
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              changeQuizVisibility(true);
            }}
            sx={{ display: selectedQuiz.Visibility ? "none" : "block" }}>
            Show
          </Button>
        </Box>
      </TransitionModal>
      {/* Delete homework modal ========================================================================================================================*/}
      <TransitionModal
        open={deleteHomeworkModal}
        handleClose={() => {
          setDeleteHomeworkModal(false);
        }}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Homework
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to delete this homework?
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mr: 1, color: "primary.main" }}
            onClick={() => {
              setDeleteHomeworkModal(false);
            }}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" color="error" onClick={deleteHomework}>
            Delete
          </Button>
        </Box>
      </TransitionModal>
      {/* breadcrumbs ======================================================================================================================== */}
      <CustomBreadcrumbs root="/teacher" links={null} breadcrumbEnding={course.name} />
      {/* header ======================================================================================================================== */}
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" sx={{ color: "primary.main" }}>
              {course.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              Date: {course.timeslot}
            </Typography>
          </Box>
        </Box>
      </Card>
      {/* side menu ======================================================================================================================== */}
      <Grid container spacing={2} sx={{ pt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ py: 2, px: 3, mt: 2, display: { xs: "none", sm: "block" } }}>
            {menuOptions.map((option, key) => (
              <MenuItem
                key={key}
                sx={{
                  mb: 1,
                  color: routeMenuMapping[category] == option ? "primary.main" : category === undefined && option == "Announcements" ? "primary.main" : "",
                  "&:hover": { color: "primary.main" },
                }}
                onClick={() => menuNavigate(option)}>
                <Typography variant="subtitle1">{option}</Typography>
              </MenuItem>
            ))}
          </Card>

          <Card sx={{ py: { sm: 1 }, px: 1, display: { xs: "block", sm: "none" } }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="h5" sx={{ color: "primary.main" }}>
                    {category === undefined ? "Announcements" : routeMenuMapping[category]}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {menuOptions.map((option, key) => (
                  <MenuItem
                    key={key}
                    sx={{
                      mb: 0.5,
                      color: routeMenuMapping[category] == option ? "primary.main" : category === undefined && option == "Announcements" ? "primary.main" : "",
                      "&:hover": { color: "primary.main" },
                    }}
                    onClick={() => menuNavigate(option)}>
                    <Typography variant="subtitle1">{option}</Typography>
                  </MenuItem>
                ))}
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>
        {/* course announcements ================================================================================ */}
        <Grid item xs={12} md={9}>
          <Box>
            <Card sx={{ py: 3, px: 5, mt: 2, display: category == "announcement" ? "block" : category === undefined ? "block" : "none" }}>
              {/* header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">Class Announcements</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    var endpt = category == "announcement" ? "new" : "announcement/new";
                    navigate(endpt);
                  }}>
                  New Announcement
                </Button>
              </Box>
              {/* end header */}
              <MaterialReactTable
                columns={courseAnnouncementColumns}
                data={courseAnnouncements}
                enableHiding={false}
                sortDescFirst={true}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                initialState={{
                  density: "compact",
                  sorting: [{ id: "date", desc: true }],
                }}
                renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
            </Card>
            {/* course materials ========================================================================================================================*/}
            <Box>
              <Card sx={{ py: 3, px: 5, mt: 2, display: category == "material" ? "block" : category === undefined ? "none" : "none" }}>
                {/* header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5">Class Materials</Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(`/teacher/course/${courseid}/material/new`);
                    }}>
                    New Course Material
                  </Button>
                </Box>
                {/* end header */}

                <MaterialReactTable columns={courseMaterialsColumns} data={courseMaterial} enableHiding={false} enableFullScreenToggle={false} enableDensityToggle={false} initialState={{ density: "compact" }} renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
              </Card>
            </Box>
            {/* quiz ==================================================================================================== */}
            <Box sx={{ display: category == "quiz" ? "block" : "none" }}>
              <Card sx={{ py: 3, px: 5, mt: 2, display: category == "quiz" ? "block" : category === undefined ? "none" : "none" }}>
                {/* header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5">Quizzes</Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(`/teacher/course/${courseid}/quiz/new`);
                    }}>
                    New Quiz
                  </Button>
                </Box>
                {/* end header */}
                <MaterialReactTable columns={courseQuizColumns} data={courseQuiz} enableHiding={false} enableFullScreenToggle={false} enableDensityToggle={false} initialState={{ density: "compact" }} renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
              </Card>
            </Box>
            {/* homework ==================================================================================================== */}
            <Box sx={{ display: category == "homework" ? "block" : "none" }}>
              <Card sx={{ py: 3, px: 5, mt: 2, display: category == "homework" ? "block" : category === undefined ? "block" : "none" }}>
                {/* header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5">Homework</Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(`new`);
                    }}>
                    New Homework
                  </Button>
                </Box>
                {/* end header */}
                <MaterialReactTable columns={courseHomeworkColumns} data={courseHomework} enableHiding={false} enableFullScreenToggle={false} enableDensityToggle={false} initialState={{ density: "compact" }} renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
              </Card>
            </Box>
            {/* class list ==================================================================================================== */}
            <Box sx={{ display: category == "classlist" ? "block" : "none" }}>
              <Card sx={{ py: 3, px: 4, mt: 2 }}>
                {/* mui table*/}
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Class List
                </Typography>
                {/* end header */}
                <MaterialReactTable columns={classListColumns} data={classList} enableHiding={false} enableFullScreenToggle={false} enableDensityToggle={false} initialState={{ density: "compact" }} renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
              </Card>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Loader open={open} />
    </Container>
  );
};

export default TeacherCourse;
