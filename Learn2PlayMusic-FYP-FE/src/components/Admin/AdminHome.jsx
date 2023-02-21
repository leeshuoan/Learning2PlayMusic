import AdminUserManagement from './AdminUserManagement'
import { Container } from '@mui/material'

const AdminHome = (userInfo) => {
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <AdminUserManagement />
    </Container>
  )
}

export default AdminHome