import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Backdrop, Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import TransitionModal from "../../utils/TransitionModal";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [content, setContent] = useState("");
  const [dateId, setDateId] = useState("");
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
  function handleOpenEditModal(dateId, courseName, content) {
    setDateId(dateId);
    setcourseName(courseName);
    setContent(content);
    setOpenEditModal(true);
  }

  // delete
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const handleCloseDeleteModalSuccess = () => {
    setOpenDeleteModal(false);
    setReloadData(!reloadData);
  };
  function handleOpenDeleteModal(dateId, courseName, content) {
    setDateId(dateId);
    setCourseName(courseName);
    setContent(content);
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
            <IconButton
              onClick={() => {
                handleOpenEditModal(row.original.id, row.original.name, row.original.content);
              }}>
              <EditIcon></EditIcon>
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                handleOpenDeleteModal(row.original.id, row.original.name, row.original.content);
              }}>
              <DeleteForeverIcon></DeleteForeverIcon>
            </IconButton>
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
    <Box>
      {/* new course form */}
      <TransitionModal
        open={openModal}
        handleClose={handleCloseModal}
        style={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          border: "1px solid #000",
          borderRadius: 2,
          p: 4,
        }}></TransitionModal>
      {/* edit course form */}
      <TransitionModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        style={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          border: "1px solid #000",
          borderRadius: 2,
          p: 4,
        }}></TransitionModal>

      {/* delete confirmation */}
      <TransitionModal open={openDeleteModal} handleClose={handleCloseDeleteModal}></TransitionModal>

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

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default AdminCourseManagement;
