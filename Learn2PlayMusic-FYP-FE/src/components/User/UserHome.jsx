import { Backdrop, Box, Button, Card, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RhythmMachine from "./RhythmMachine";

const UserHome = ({ userInfo }) => {
  const [open, setOpen] = useState(true);
  const [unEnrolled, setUnEnrolled] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  const fetchCourses = request(`/user/course?userId=${userInfo.id}`);
  const fetchAnnouncements = request(`/generalannouncement`);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courses, announcements] = await Promise.all([fetchCourses, fetchAnnouncements]);
        console.log(courses);
        if ("message" in courses) {
          setError(true);
        }
        const announcementsData = announcements.slice(0, 3).map((a) => ({
          ...a,
          date: new Date(a.SK.split("Date#")[1]).toLocaleDateString(),
        }));
        setAnnouncements(announcementsData);

        if (courses.message === "[ERROR] studentId does not exist in database") {
          setUnEnrolled(true);
        } else {
          setMyCourses(courses);
        }
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  if (error)
    return (
      <Typography variant="h4" align="center" sx={{ mt: 3 }}>
        Something went wrong, contact admin immediately!
      </Typography>
    );
  else
    return (
      <>
        <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
          <Typography variant="h4" sx={{ mt: 3 }}>
            Welcome Back, {userInfo.name}
          </Typography>

          {myCourses.map((myCourse, index) => (
            <Card sx={{ p: 2, px: 5, mt: 2 }} key={index} style={{ background: `linear-gradient(45deg, rgba(23,76,106,1) 0%, rgba(35,77,116,0.5) 100%)` }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" color="white">
                    {myCourse.CourseName}
                  </Typography>
                  <Typography variant="body2" color="white">
                    Every {myCourse.CourseSlot}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    sx={{ color: "black", backgroundColor: "white", boxShadow: "none", "&:hover": { backgroundColor: "lightgrey" } }}
                    onClick={() => {
                      navigate(`course/${myCourse.SK.split("Course#")[1]}`);
                    }}>
                    GO TO COURSE PAGE
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
          <Card sx={{ p: 2, px: 5, mt: 2, display: unEnrolled ? "flex" : "none" }} style={{ background: `linear-gradient(45deg, rgba(23,76,106,1) 0%, rgba(35,77,116,0.5) 100%)` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="white">
                You have not been enrolled in any courses
              </Typography>
            </Box>
          </Card>

          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} md={12}>
              <Card sx={{ py: 3, px: 4 }}>
                <Typography variant="h6">Annoucements</Typography>
                {announcements.map((announcement, index) => (
                  <Card variant="outlined" sx={{ boxShadow: "none", my: 1, p: 2 }} key={index}>
                    <Typography variant="subtitle2">{announcement.AnnouncementTitle}</Typography>
                    <Typography variant="subsubtitle">Posted {announcement.date}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {announcement.Content}
                    </Typography>
                  </Card>
                ))}
                <Box sx={{ textAlign: "center" }}>
                  <Link
                    onClick={() => {
                      navigate("announcements");
                    }}>
                    View All Announcements
                  </Link>
                </Box>
              </Card>
              <RhythmMachine />
            </Grid>
          </Grid>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      </>
    );
};

export default UserHome;
