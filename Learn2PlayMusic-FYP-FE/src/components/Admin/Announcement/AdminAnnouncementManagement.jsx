import { Backdrop, Box, Button, CircularProgress, Typography } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import TransitionModal from "../../utils/TransitionModal";
import CreateAnnouncementForm from "./CreateAnnouncementForm";
import DeleteAnnouncementForm from "./DeleteAnnouncementForm";
import EditAnnouncementForm from "./EditAnnouncementForm";

const AdminAnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [content, setContent] = useState("");
  const [dateId, setDateId] = useState("");
  const [reloadData, setReloadData] = useState(false);

  const [open, setOpen] = useState(false);
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
  function handleOpenEditModal(dateId, announcementTitle, content) {
    setDateId(dateId);
    setAnnouncementTitle(announcementTitle);
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
  function handleOpenDeleteModal(dateId, announcementTitle, content) {
    setDateId(dateId);
    setAnnouncementTitle(announcementTitle);
    setContent(content);
    setOpenDeleteModal(true);
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        id: "title",
        header: "Title",
        size: 30,
        Cell: ({ cell, row }) => <Typography variant="body2">{row.original.title.length > 30 ? row.original.title.substring(0, 30) + "..." : row.original.title}</Typography>,
      },
      {
        accessorKey: "date",
        id: "date",
        header: "Date",
        size: 30,
      },
      {
        accessorKey: "content",
        id: "content",
        header: "Content",
        Cell: ({ cell, row }) => <Typography variant="body2">{row.original.content.length > 130 ? row.original.content.substring(0, 130) + "..." : row.original.content}</Typography>,
      },
      {
        accessorKey: "",
        id: "actions",
        header: "Actions",
        size: 30,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
            <Button
              variant="contained"
              onClick={() => {
                handleOpenEditModal(row.original.id, row.original.title, row.original.content);
              }}>
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleOpenDeleteModal(row.original.id, row.original.title, row.original.content);
              }}>
              Delete
            </Button>
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
    getAPI(`${import.meta.env.VITE_API_URL}/generalannouncement`).then((res) => {
      var fetchedData = res.map((announcement) => {
        const date = announcement.SK.split("#")[1].split("T")[0];
        const id = announcement.SK.split("#")[1];
        const content = announcement.Content;
        const title = announcement.AnnouncementTitle;
        return { id, date, content, title };
      });
      setAnnouncements(fetchedData);
      console.log(fetchedData);
    });
  }, [reloadData]);
  return (
    <Box>
      {/* new announcement form */}
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
        }}>
        <CreateAnnouncementForm handleCloseModal={handleCloseModal} handleCloseModalSuccess={handleCloseModalSuccess} />
      </TransitionModal>
      {/* edit announcement form */}
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
        }}>
        <EditAnnouncementForm dateId={dateId} existingAnnouncementTitle={announcementTitle} existingContent={content} handleCloseEditModal={handleCloseEditModal} handleCloseEditModalSuccess={handleCloseEditModalSuccess} />
      </TransitionModal>

      {/* delete confirmation */}
      <TransitionModal open={openDeleteModal} handleClose={handleCloseDeleteModal}>
        <DeleteAnnouncementForm dateId={dateId} announcementTitle={announcementTitle} content={content} handleCloseDeleteModal={handleCloseDeleteModal} handleCloseDeleteModalSuccess={handleCloseDeleteModalSuccess} />
      </TransitionModal>

      {/* header */}
      <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
        Announcement Management
      </Typography>
      {/* table */}
      <MaterialReactTable
        enableHiding={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        columns={columns}
        data={announcements}
        enableExpanding={true}
        initialState={{ density: "compact" }}
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: "grid",

              width: "100%",
            }}>
            <Typography variant="h6">Title</Typography>
            <Typography variant="body2">{row.original.title}</Typography>
            <Typography variant="h6">Content</Typography>
            <Typography variant="body2">{row.original.content}</Typography>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenModal(true);
                }}>
                New Announcement
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
export default AdminAnnouncementManagement;
