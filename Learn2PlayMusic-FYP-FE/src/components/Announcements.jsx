import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Backdrop, Breadcrumbs, Card, CircularProgress, Container, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Announcements = (userInfo) => {
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(true);
  const getGeneralAnnouncements = fetch(`${import.meta.env.VITE_API_URL}/generalannouncement`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getGeneralAnnouncements])
      .then(async ([res1]) => {
        const [data1] = await Promise.all([res1.json()]);
        // sort annoucnement first
        data1.sort((a, b) => new Date(b.SK.split("Date#")[1]) - new Date(a.SK.split("Date#")[1]));
        console.log(data1);
        for (let idx in data1) {
          data1[idx].date = new Date(data1[idx].SK.split("Date#")[1]).toLocaleDateString();
        }
        setAnnouncements(data1);
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const back = () => {
    if (userInfo.userInfo.role == "Teacher") navigate("/teacher");
    else if (userInfo.userInfo.role == "Admin") navigate("/admin");
    else navigate("/home");
    return;
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
          <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => back()}>
            <HomeIcon sx={{ mr: 0.5 }} />
            Home
          </Link>

          <Typography color="text.primary">General Announcements</Typography>
        </Breadcrumbs>

        <Card variant="contained" sx={{ mt: 2, py: 3, px: 5 }}>
          <Typography variant="h5">All Announcements</Typography>
          {announcements.map((announcement, index) => (
            <Card key={index} variant="outlined" sx={{ mt: 2, py: 3, px: 5, boxShadow: "none" }}>
              <Typography variant="subtitle1">{announcement.AnnouncementTitle}</Typography>
              <Typography variant="subsubtitle" sx={{ mt: 1 }}>
                Posted {announcement.date}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {announcement.Content}
              </Typography>
            </Card>
          ))}
        </Card>
      </Container>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Announcements;
