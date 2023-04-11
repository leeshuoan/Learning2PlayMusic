import AssessmentIcon from "@mui/icons-material/Assessment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Container, IconButton, Tooltip, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../utils/Loader";
import TransitionModal from "../../utils/TransitionModal";
import CreateCourseForm from "./CreateCourseForm";
import DeleteCourseForm from "./DeleteCourseForm";
import EditCourseForm from "./EditCourseForm";
import ReportGenerationForm from "./ReportGenerationForm";

const SuperAdminCourseManagement = () => {
  const largeModalWidth = { xs: "90%", sm: "60%", md: "40%", lg: "40%", xl: "40%" };
  const smallModalWidth = { xs: "60%", sm: "40%", md: "30%", lg: "30%", xl: "30%" };
  function modalStyle(w) {
    return {
      position: "relative",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: w,
      bgcolor: "background.paper",
      border: "1px solid #000",
      borderRadius: 2,
      p: 4,
    };
  }

  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [timeSlot, setTimeslot] = useState("");
  const [reloadData, setReloadData] = useState(false);

  const [open, setOpen] = useState(true);
  // create
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);
  const handleCloseModalSuccess = () => {
    setOpenModal(false);
    setReloadData(!reloadData);
  };
  // // Edit
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleCloseEditModalSuccess = () => {
    setOpenEditModal(false);
    setReloadData(!reloadData);
  };
  function handleOpenEditModal(timeSlot, teacherName, courseName, courseId, teacherId) {
    setTimeslot(timeSlot);
    setCourseName(courseName);
    setCourseId(courseId);
    setTeacherName(teacherName);
    setTeacherId(teacherId);
    setOpenEditModal(true);
  }
  // report
  const [openReportModal, setOpenReportModal] = useState(false);
  function handleOpenReportModal(courseId, courseName) {
    setCourseName(courseName);
    setCourseId(courseId);
    setOpenReportModal(true);
  }
  const handleCloseReportModal = () => setOpenReportModal(false);
  const handleCloseReportModalSuccess = () => {
    setOpenReportModal(false);
    setReloadData(!reloadData);
  };

  // delete
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const handleCloseDeleteModalSuccess = () => {
    setOpenDeleteModal(false);
    setReloadData(!reloadData);
  };
  function handleOpenDeleteModal(timeSlot, teacherName, courseName, courseId) {
    setTimeslot(timeSlot);
    setCourseName(courseName);
    setCourseId(courseId);
    setTeacherName(teacherName);
    setOpenDeleteModal(true);
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "courseName",
        id: "courseName",
        header: "Course Name",
      },
      {
        accessorKey: "timeSlot",
        id: "timeSlot",
        header: "Course Time Slot",
      },
      {
        accessorKey: "timeSlot",
        id: "teacherName",
        header: "Teacher Name",
        Cell: ({ cell, row }) => (
          <Typography variant="body2" id={row.original.teacherId}>
            {row.original.teacherName}
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
                  handleOpenEditModal(row.original.timeSlot, row.original.teacherName, row.original.courseName, row.original.id, row.original.teacherId);
                }}>
                <EditIcon></EditIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="bottom">
              <IconButton
                color="error"
                onClick={() => {
                  handleOpenDeleteModal(row.original.timeSlot, row.original.teacherName, row.original.courseName, row.original.id);
                }}>
                <DeleteForeverIcon></DeleteForeverIcon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
      {
        accessorKey: "",
        id: "report",
        header: "Progress Report",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}>
            <Tooltip title="Generate Progress Report" placement="bottom">
              <IconButton
                onClick={() => {
                  handleOpenReportModal(row.original.id, row.original.courseName);
                }}>
                <AssessmentIcon color="info"></AssessmentIcon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  async function getAPI(endpoint) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
  useEffect(() => {
    getAPI(`${import.meta.env.VITE_API_URL}/course`).then((res) => {
      var fetchedData = res.map((course) => {
        const id = course.SK.split("#")[1];
        const courseName = course.CourseName;
        const teacherName = course.TeacherName;
        const teacherId = course.TeacherId;
        const timeSlot = course.CourseSlot;
        return { id, courseName, teacherName, teacherId, name, timeSlot };
      });
      setCourses(fetchedData);
      console.log(fetchedData);
      setOpen(false);
    });
  }, [reloadData]);
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      {/* new course form */}
      <TransitionModal open={openModal} handleClose={handleCloseModal} style={modalStyle(largeModalWidth)}>
        <CreateCourseForm handleCloseModal={handleCloseModal} handleCloseModalSuccess={handleCloseModalSuccess}></CreateCourseForm>
      </TransitionModal>
      {/* edit course form */}
      <TransitionModal open={openEditModal} handleClose={handleCloseEditModal} style={modalStyle(largeModalWidth)}>
        <EditCourseForm courseId={courseId} ogCourseName={courseName} ogTimeSlot={timeSlot} ogTeacherName={teacherName} ogTeacherId={teacherId} handleCloseEditModal={handleCloseEditModal} handleCloseEditModalSuccess={handleCloseEditModalSuccess} />
      </TransitionModal>
      {/* delete confirmation */}
      <TransitionModal open={openDeleteModal} handleClose={handleCloseDeleteModal} style={modalStyle(smallModalWidth)}>
        <DeleteCourseForm courseId={courseId} courseName={courseName} timeSlot={timeSlot} teacherName={teacherName} handleCloseDeleteModal={handleCloseDeleteModal} handleCloseDeleteModalSuccess={handleCloseDeleteModalSuccess} />
      </TransitionModal>
      {/* generate report */}
      <TransitionModal open={openReportModal} handleClose={handleCloseReportModal} style={modalStyle(largeModalWidth)}>
        <ReportGenerationForm courseId={courseId} courseName={courseName} handleClose={handleCloseReportModal} handleCloseSuccess={handleCloseReportModalSuccess} />
      </TransitionModal>

      {/* header */}
      <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
        Course Management
      </Typography>
      {/* table */}
      <MaterialReactTable
        enableHiding={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        columns={columns}
        data={courses}
        initialState={{ density: "compact" }}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                my: 1,
              }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenModal(true);
                }}>
                New Course
              </Button>
            </Box>
          );
        }}></MaterialReactTable>

      <Loader open={open}></Loader>
    </Container>
  );
};
export default SuperAdminCourseManagement;
