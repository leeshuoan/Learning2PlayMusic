import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function ViewCourseMaterialComponent({ material, course, title, date, link, file }) {
  const { courseid } = useParams();
  const { materialid } = useParams();
  const navigate = useNavigate();
  if (link.startsWith("http://") ) {
    link = link.substring(7);
  }
  else if (link.startsWith("https://")) {
    link = link.substring(8);
  }
  return (
    <Box sx={{mt:5}}>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Title
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Date
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {date.toISOString().split("T")[0]}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Attachment
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {file == null ? (
          <a href={"//" + link} target="_blank">
            {link}
          </a>
        ) : (
          <a href={file} target="_blank">
            {file}
          </a>
        )}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 1 }}>
        <Button
          variant="outlined"
          sx={{ color: "primary.main" }}
          onClick={() => {
            navigate(`/teacher/course/${courseid}/material`);
          }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            navigate(`/teacher/course/${courseid}/material/edit/${materialid}`, { state: { material: material, course: course } });
          }}>
          Edit
        </Button>
      </Box>
    </Box>
  );
}
export default ViewCourseMaterialComponent;
