import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminHome = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (category == null) {
      navigate("/admin/announcements");
    }
  }, [category]);
};

export default AdminHome;
