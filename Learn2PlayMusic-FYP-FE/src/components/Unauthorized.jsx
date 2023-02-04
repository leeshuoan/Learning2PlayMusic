import { Typography, Link } from "@mui/material";

const Unauthorized = ({userRole}) => {
  let redirectLink = "/"

  console.log(userRole)
  if (userRole === "Admin") {
    redirectLink = "admin"
  } else if (userRole === "Teacher") {
    redirectLink = "teacher"
  }

    return (
      <div>
        <Typography variant="h4" sx={{ pt:3, textAlign:"center" }}>You are not authorized to visit this page</Typography>
        <Typography sx={{ pt:1, textAlign:"center" }}>
        <Link onClick={() => { window.location.href =  redirectLink}}>Go to the home page</Link>
        </Typography>
      </div>
    );
  }

export default Unauthorized;