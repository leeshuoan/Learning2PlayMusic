import { Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = ({ userRole }) => {
  let redirectLink = "";
  const navigate = useNavigate();

  console.log(userRole);
  if (userRole === "Admin") {
    redirectLink = "admin";
  } else if (userRole === "Teacher") {
    redirectLink = "teacher";
  } else if (userRole === "SuperAdmin") {
    redirectLink = "superadmin";
  } else if (userRole === "User") {
    redirectLink = "home";
  }

  return (
    <div>
      <Typography variant="h4" sx={{ pt: 3, textAlign: "center" }}>
        You are not authorized to visit this page
      </Typography>
      <Typography sx={{ pt: 1, textAlign: "center" }}>
        <Link
          onClick={() => {
            navigate("/" + redirectLink);
          }}>
          Go to the home page
        </Link>
      </Typography>
    </div>
  );
};

export default Unauthorized;
