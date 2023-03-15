import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function CustomBreadcrumbs({ root, links, breadcrumbEnding }) {
  const navigate = useNavigate();

  return (
    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: 3 }}>
      <Link
        underline="hover"
        color="inherit"
        sx={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          navigate(`${root}`);
        }}>
        <HomeIcon sx={{ mr: 0.5 }} />
        Home
      </Link>
      {links != null
        ? links.map((link) => (
            <Link
              key={link.path}
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
              onClick={() => {
                navigate(`${link.path}`);
              }}>
              <Typography color="text.primary">{link.name}</Typography>
            </Link>
          ))
        : ""}
      <Typography color="text.primary">{breadcrumbEnding}</Typography>
    </Breadcrumbs>
  );
}
