import { Box, Card, Typography } from "@mui/material";

const QuizQuestionChart = ({ questionImage, data }) => {
  const grey = "#d9d9d9";
  const optionGrey = "#959595";
  const green = "#98d16c";

  const baseTheme = {
    borderRadius: 2,
    height: "3rem",
    minWidth: "0.5rem",
  };
  const correctTheme = (widthPercent) => {
    return {
      ...baseTheme,
      backgroundColor: green,
      width: widthPercent + "%",
    };
  };
  const wrongTheme = (widthPercent) => {
    return {
      ...baseTheme,
      backgroundColor: grey,
      width: widthPercent + "%",
    };
  };
  console.log(data);
  return (
    <div>
      {questionImage && <img src={questionImage} height="200" width="200" alt="question" />}
      {data.map((option) => {
        let fontColor = option.correct ? green : optionGrey;
        let fontWeight = option.correct ? "h6" : "body1";
        return (
          <Box sx={{ my: 2 }} key={option.name}>
            <Typography sx={{ color: fontColor, mb: -2, typography: fontWeight }}>
              {option.name} ({option.percent}%)
            </Typography>
            <br></br>
            <Card sx={option.correct ? correctTheme(option.percent) : wrongTheme(option.percent)}>&nbsp;</Card>
          </Box>
        );
      })}
    </div>
  );
};
export default QuizQuestionChart;
