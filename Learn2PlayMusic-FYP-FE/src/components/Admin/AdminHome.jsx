import { Container } from "@mui/material";
import AdminAnnouncementManagement from "./AdminAnnouncementManagement";
import AdminUserManagement from "./AdminUserManagement";

const AdminHome = (userInfo) => {
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <AdminUserManagement />
      <AdminAnnouncementManagement />
      {/*       
      can use this
      {category == "user" ? <AdminUserManagement /> : null}
      {category == "announcements" ? <AdminAnnouncementManagement /> : null}
      {category == "courses" ? "joe " : null}
 */}
    </Container>
  );
};

export default AdminHome;
