import { Container } from "@mui/material";
import AdminAnnouncementManagement from "./AdminAnnouncementManagement";
import AdminUserManagement from "./AdminUserManagement";

const AdminHome = (userInfo) => {
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <AdminUserManagement />
      <AdminAnnouncementManagement />
    </Container>
  );
};

export default AdminHome;
