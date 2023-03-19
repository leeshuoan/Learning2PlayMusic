import { Container } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminAnnouncementManagement from "./AdminAnnouncementManagement";
import AdminUserManagement from "./AdminUserManagement";
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
      {category == "courses" ? "joe " : null}
    </Container>
  );
};

export default AdminHome;
