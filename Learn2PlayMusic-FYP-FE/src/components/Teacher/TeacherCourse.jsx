import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Container, Grid, Card, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails, Link, Button, Divider, Breadcrumbs, Backdrop, Stack, CircularProgress, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MaterialReactTable from "material-react-table";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import TransitionModal from "../utils/TransitionModal";
import { toast } from "react-toastify";

const TeacherCourse = (userInfo) => {
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState({});
  const [courseHomework, setCourseHomework] = useState([]);
  const [courseMaterial, setCourseMaterial] = useState([]);
  const [courseQuiz, setCourseQuiz] = useState([]);
  const [courseAnnouncements, setCourseAnnouncements] = useState([]);
  const [deleteAnnouncementModal, setDeleteAnnouncementModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // dummy data
  const courseProgressReports = [
    {
      id: 1,
      title: "Progress Report 1",
      uploadDate: "31 Jun 2023",
    },
    {
      id: 2,
      title: "Progress Report 1",
      uploadDate: "31 Jun 2023",
    },
  ];
  const classListDummyData = [
    {
      studentId: 1,
      StudentName: "John Doe",
      ParticipationPoints: "2",
      progresReport: "",
    },
    {
      studentId: 2,
      StudentName: "Jane Doe",
      ParticipationPoints: "11",
      progresReport: "",
    },
  ];
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
    classList: "Class List",
  };
  // api calls
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
  const getCourseAnnouncementsAPI = request(`/course/announcement?courseId=${courseid}`);
  const getMaterialAPI = request(`/course/material?courseId=${courseid}`);
  const getHomeworkAPI = request(`/course/homework?courseId=${courseid}`);
  const getQuizAPI = request(`/course/quiz?courseId=${courseid}/studentId=${userInfo.userInfo.id}`);
  const getClassListAPI = request(`/course/classlist?courseId=${courseid}`);
  // material table configs
  const courseMaterialsColumns = useMemo(
    () => [
      {
        accessorKey: "MaterialTitle",
        id: "title",
        header: "Title",
        Cell: ({ cell, row }) => <Link onClick={() => navigate(`/teacher/course/${courseid}/material/view/${row.original.id}`, { state: { material: row.original, course: course } })}>{row.original.MaterialTitle}</Link>,
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
        size: 100, //medium
      },
      {
        accessorKey: "Actions",
        id: "actions",
        header: "Actions",
        Cell: ({ cell, row }) => (
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
            <Typography
              variant="button"
              onClick={() => {
                navigate(`/teacher/course/${courseid}/material/edit/${row.original.id}`, { state: { material: row.original, course: course } });
              }}>
              <Link underline="hover">Edit</Link>
            </Typography>
            <Typography variant="button" onClick={request}>
              <Link underline="hover">Delete</Link>
            </Typography>
          </Stack>
        ),
      },
    ],
    [course]
  );

  const classListColumns = useMemo(
    () => [
      {
        accessorKey: "StudentName",
        id: "studentName",
        header: "Student Name",
        Cell: ({ cell, row }) => {
          row.original.StudentName;
        },
      },
      {
        accessorKey: "ParticipationPoints",
        id: "participationPoints",
        header: "Participation Points",
        Cell: ({ cell, row }) => {
          row.original.ParticipationPoints;
        },
      },
      {
        accessorKey: "ProgressReport",
        id: "progressReport",
        header: "Progress Report",
        Cell: ({ cell, row }) => (
          // todo
          <Link underline="hover" onClick={() => navigate()} sx={{ justifyContent: "center", alignItems: "center" }}>
            <Typography variant="button">
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
    console.log(selectedAnnouncement);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/course/announcement?courseId=${courseid}&announcementId=${selectedAnnouncement}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // reset
    setSelectedAnnouncement(null);
    setDeleteAnnouncementModal(false);
    fetch(`${import.meta.env.VITE_API_URL}/course/announcement?courseId=${courseid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        var refreshedAnnouncement = res.map((announcement) => {
          console.log(announcement);
          const id = announcement.SK.split("Announcement#")[1];
          const date = new Date(announcement.Date);
          const formattedDate = date.toLocaleDateString();
          return { ...announcement, id, Date: formattedDate };
        });
        setCourseAnnouncements(refreshedAnnouncement);
        // alert
        if (response.status === 200) {
          toast.success("Announcement deleted successfully");
        } else {
          toast.error("An unexpected error occured");
        }
      });
    return;
  }
  // [
  //   {
  //     HomeworkDescription: "This is your first homework for this course",
  //     HomeworkName: "Piano homework 1",
  //     SK: "Homework#1",
  //     PK: "Course#1",
  //     HomeworkAssignedDate: "2022-12-31T00:00:01Z",
  //     HomeworkDueDate: "2023-12-31T00:00:01Z",
  //   },
  //   {
  //     HomeworkDescription: "This is your second homework for this course",
  //     HomeworkName: "Homework the second",
  //     SK: "Homework#2",
  //     PK: "Course#1",
  //     HomeworkAssignedDate: "2022-01-31T00:00:01Z",
  //     HomeworkDueDate: "2023-05-31T00:00:01Z",
  //   },
  // ];
  useEffect(() => {
    async function fetchData() {
      const [data1, data2, data3, data4, data5] = await Promise.all([getCourseAPI, getHomeworkAPI, getMaterialAPI, getQuizAPI, getCourseAnnouncementsAPI]);

      console.log(data1);
      const courseData = {
        id: data1[0].SK.split("#")[1],
        name: data1[0].CourseName,
        timeslot: data1[0].CourseSlot,
        teacher: data1[0].TeacherName,
      };
      setCourse(courseData);

      console.log(data2);
      // async function fetchHomeworkData() {
      //   try {
      //     const homeworkData = await Promise.all(
      //       data2.map(async (homework) => {
      //         const id = homework.SK.split("Homework#")[1].substr(0, 1);
      //         const date = new Date(homework.HomeworkDueDate);
      // const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

      // const homeworkFeedback = await fetchHomeworkFeedback(id);
      // console.log(homeworkFeedback);

      // return {
      //           ...homework,
      //           id,
      //           HomeworkDueDate: formattedDate,
      //           Marked: homeworkFeedback.Marked,
      //           NumAttempts: homeworkFeedback.NumAttempts,
      //         };
      //       })
      //     );
      //     return homeworkData;
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }

      // async function fetchHomeworkFeedback(id) {
      //   const data = await request(
      //     `/course/homework/feedback?courseId=${courseid}&homeworkId=${id}&studentId=${userInfo.userInfo.id}`
      //   );
      //   console.log(data);
      //   const homeworkFeedback = {
      //     Marked: data.Marked,
      //     NumAttempts: data.NumAttempts != 0 ? data.NumAttempts : "",
      //   };
      //   return homeworkFeedback;
      // }

      // fetchHomeworkData().then((data) => {
      //   setCourseHomework(data);
      // });

      //     HomeworkDescription: "This is your first homework for this course",
      //     HomeworkName: "Piano homework 1",
      //     SK: "Homework#1",
      //     PK: "Course#1",
      //     HomeworkAssignedDate: "2022-12-31T00:00:01Z",
      //     HomeworkDueDate: "2023-12-31T00:00:01Z",

      const homeworkData = data2.map((homework) => {
        const id = homework.SK.split("Homework#")[1].substr(0, 1);
        const dueDate = new Date(homework.HomeworkAssignedDate);
        const formattedDueDate = `${dueDate.toLocaleDateString()} `;
        const assignedDate = new Date(homework.HomeworkDueDate);
        const formattedAssignedDate = `${assignedDate.toLocaleDateString()} ${assignedDate.toLocaleTimeString()}`;
        const homeworkName = homework.HomeworkName;
        const homeworkDescription = homework.HomeworkDescription;
        return { ...homework, id, HomeworkDueDate: formattedDueDate, HomeworkAssignedDate: formattedAssignedDate };
      });
      setCourseHomework(homeworkData);

      const materialData = data3.map((material) => {
        const id = material.SK.split("Material#")[1];
        const date = new Date(material.MaterialLessonDate);
        const formattedDate = `${date.toLocaleDateString()}`;
        return { ...material, id, MaterialLessonDate: formattedDate };
      });
      setCourseMaterial(materialData);
      console.log(materialData);

      // const quizData = data4.map((quiz) => {
      //   const id = quiz.SK.split("Quiz#")[1].substr(0, 1);
      //   const date = new Date(quiz.QuizDueDate);
      //   const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      //   return { ...quiz, id, QuizDueDate: formattedDate };
      // });
      // setCourseQuiz(quizData);

      const announcementsData = data5.map((announcement) => {
        console.log(announcement);
        const id = announcement.SK.split("Announcement#")[1];
        const date = new Date(announcement.Date);
        const formattedDate = date.toLocaleDateString();
        return { ...announcement, id, Date: formattedDate };
      });
      setCourseAnnouncements(announcementsData);
      console.log(announcementsData);
    }

    fetchData().then(() => {
      setOpen(false);
    });
  }, []);

  const menuNavigate = (option) => {
    if (option == "Announcements") navigate(`/teacher/course/${course.id}/announcement`);
    if (option == "Class Materials") navigate(`/teacher/course/${course.id}/material`);
    if (option == "Quizzes") navigate(`/teacher/course/${course.id}/quiz`);
    if (option == "Homework") navigate(`/teacher/course/${course.id}/homework`);
    if (option == "Class List") navigate(`/teacher/course/${course.id}/classList`);
  };

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      {/* Delete announement modal ========================================================================================================================*/}
      <TransitionModal
        open={deleteAnnouncementModal}
        handleClose={() => {
          setDeleteAnnouncementModal(false);
        }}>
        <Box sx={{ p: 2 }}>
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
      </TransitionModal>
      {/* breadcrumbs ======================================================================================================================== */}
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
        <Typography color="text.primary">{course.name}</Typography>
      </Breadcrumbs>
      <Card sx={{ py: 1.5, px: 3, mt: 2, display: { xs: "flex", sm: "flex" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" sx={{ color: "primary.main" }}>
              {course.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              <Grid container>
                <Grid item xs={10} md={11}>
                  <Typography variant="h5">Class Announcements</Typography>
                </Grid>
                <Grid item xs={2} md={1}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      var endpt = category == "announcement" ? "new" : "announcement/new";
                      navigate(endpt, { state: { course: course, title: "", content: "" } });
                    }}>
                    +&nbsp;New
                  </Button>
                </Grid>
              </Grid>
              {/* end header */}
              {courseAnnouncements.map((announcement, key) => (
                <Card key={key} variant="outlined" sx={{ boxShadow: "none", mt: 2, p: 2 }}>
                  <Grid container>
                    <Grid item xs={8} sm={8} md={10}>
                      <Typography variant="subtitle1" sx={{}}>
                        {announcement.Title}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={4} md={2}>
                      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                        <Typography
                          variant="button"
                          onClick={() => {
                            var endpt = category == "announcement" ? `edit/${announcement.id}` : `announcement/edit/${announcement.id}`;
                            navigate(endpt, { state: { course: course, title: announcement.Title, content: announcement.Content } });
                          }}>
                          <Link underline="hover">Edit</Link>
                        </Typography>
                        <Typography
                          variant="button"
                          onClick={() => {
                            setDeleteAnnouncementModal(true);
                            setSelectedAnnouncement(announcement.id);
                          }}>
                          <Link underline="hover">Delete</Link>
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Typography variant="subsubtitle" sx={{ mb: 1 }}>
                    Posted {announcement.Date}
                  </Typography>
                  <Typography variant="body2">{announcement.Content}</Typography>
                </Card>
              ))}
            </Card>
            {/* course materials ========================================================================================================================*/}
            <Box>
              <Card sx={{ py: 3, px: 5, mt: 2, display: category == "material" ? "block" : category === undefined ? "none" : "none" }}>
                {/* header */}
                <Grid container>
                  <Grid item xs={10} md={11}>
                    <Typography variant="h5">Class Materials</Typography>
                  </Grid>
                  <Grid item xs={2} md={1}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate("new", { state: { material: {}, course: course } });
                      }}>
                      +&nbsp;New
                    </Button>
                  </Grid>
                  {/* end header */}

                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <MaterialReactTable columns={courseMaterialsColumns} data={courseMaterial} enableHiding={false} enableFullScreenToggle={false} enableDensityToggle={false} initialState={{ density: "compact" }} renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
                  </Grid>
                </Grid>
              </Card>
            </Box>
            {/* quiz ==================================================================================================== */}

            <Box sx={{ display: category == "quiz" ? "block" : "none" }}>
              {courseQuiz.map((quiz, key) => (
                <Card key={key} sx={{ py: 3, px: 4, mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {quiz.QuizTitle}
                  </Typography>
                  <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        disabled={quiz.QuizAttempt >= quiz.QuizMaxAttempt}
                        onClick={() => {
                          navigate(`${quiz.id}`);
                        }}>
                        <PlayCircleFilledIcon sx={{ mr: 1 }} />
                        Start Quiz
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      {" "}
                      <Typography variant="body1" sx={{ textAlign: "center", display: { xs: "none", sm: "block" }, color: "primary.main" }}>
                        Score
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: "center",
                          display: { xs: "none", sm: "block" },
                        }}>
                        {quiz.QuizScore * 100}%
                      </Typography>
                      <Typography variant="body1" sx={{ display: { xs: "flex", sm: "none" } }}>
                        <span sx={{ color: "primary.main", mr: 0.5 }}>Score:</span>
                        {quiz.QuizScore * 100}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body1" sx={{ textAlign: "center", color: "primary.main", display: { xs: "none", sm: "block" } }}>
                        Attempts
                      </Typography>
                      <Typography variant="body1" sx={{ textAlign: "center", color: quiz.attempts == 0 ? "grey" : "", display: { xs: "none", sm: "block" } }}>
                        {quiz.QuizAttempt}/{quiz.QuizMaxAttempt}
                      </Typography>
                      <Typography variant="body1" sx={{ color: quiz.attempts == 0 ? "grey" : "", display: { xs: "flex", sm: "none" } }}>
                        <span sx={{ color: "primary.main", mr: 0.5 }}>Attempts:</span>
                        {quiz.QuizAttempt}/{quiz.QuizMaxAttempt}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
            {/* homework ==================================================================================================== */}
            <Box sx={{ display: category == "homework" ? "block" : "none" }}>
              <Card sx={{ py: 3, px: 5, mt: 2, display: category == "homework" ? "block" : category === undefined ? "block" : "none" }}>
                {/* header */}
                <Grid container>
                  <Grid item xs={10} md={11}>
                    <Typography variant="h5">Homework</Typography>
                  </Grid>
                  <Grid item xs={2} md={1}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate("announcement/new", { state: { course: course, title: "", content: "" } });
                      }}>
                      +&nbsp;New
                    </Button>
                  </Grid>
                </Grid>
                {/* end header */}
                <Grid container spacing={2} sx={{ px: 4, mt: 2, display: { xs: "none", sm: "flex" } }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">HOMEWORK TITLE</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                      DUE DATE
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                      ACTIONS
                    </Typography>
                  </Grid>
                </Grid>
                {courseHomework.map((homework, key) => (
                  <Card key={key} sx={{ py: 3, px: 4, mt: 2 }}>
                    <Grid container>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ color: "primary.main" }}>
                          <Link onClick={() => navigate("" + homework.id)}>{homework.HomeworkName}</Link>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>
                          {homework.HomeworkDueDate}
                        </Typography>

                        <Typography variant="body1" sx={{ display: { xs: "block", sm: "none" } }}>
                          Due Date: {homework.HomeworkDueDate}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                          <Typography
                            variant="button"
                            // onClick={() => {
                          >
                            <Link underline="hover">Edit</Link>
                          </Typography>
                          <Typography
                            variant="button"
                            // onclick={() => {
                          >
                            <Link underline="hover">Delete</Link>
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Card>
            </Box>
            {/* class list ==================================================================================================== */}
            <Box sx={{ display: category == "classList" ? "block" : "none" }}>
              <Card sx={{ py: 3, px: 4, mt: 2 }}>
                {/* mui table*/}
                <Grid container>
                  <Grid item xs={10} md={11}>
                    <Typography variant="h5">Class List</Typography>
                  </Grid>
                </Grid>
                {/* end header */}

                <MaterialReactTable columns={classListColumns} data={classListDummyData} enableHiding={false} enableFullScreenToggle={false} enableDensityToggle={false} initialState={{ density: "compact" }} renderTopToolbarCustomActions={({ table }) => {}}></MaterialReactTable>
              </Card>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default TeacherCourse;
