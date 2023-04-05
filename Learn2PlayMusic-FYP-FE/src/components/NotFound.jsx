import { Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = ({ userRole }) => {
  let redirectLink = "";
  const navigate = useNavigate();

  console.log(userRole);
  if (userRole === "Admin") {
    redirectLink = "admin";
  } else if (userRole === "Teacher") {
    redirectLink = "teacher";
  } else if (userRole === "User") {
    redirectLink = "home";
  } else if (userRole === "SuperAdmin") {
    redirectLink = "superadmin";
  }

  return (
    <div>
      <Typography variant="h4" sx={{ pt: 3, textAlign: "center" }}>
        404: Page not Found
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

export default NotFound;
