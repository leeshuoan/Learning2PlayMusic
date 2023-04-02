import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SuperAdminHome = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (category == null) {
      navigate("/superadmin/announcements");
    }
  }, [category]);
};

export default SuperAdminHome;
