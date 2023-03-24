import { Container } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminUserManagement from "./AdminUserManagement";
import AdminAnnouncementManagement from "./Announcement/AdminAnnouncementManagement";
import AdminCourseManagement from "./Course/AdminCourseManagement";

const AdminHome = (userInfo) => {
  const { category } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (category == null) {
      navigate("/admin/announcements");
    }
  }, [category]);

  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      {category == "users" ? <AdminUserManagement /> : null}
      {category == "announcements" ? <AdminAnnouncementManagement /> : null}
      {category == "courses" ? <AdminCourseManagement /> : null}
    </Container>
  );
};

export default AdminHome;
