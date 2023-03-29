import { Box, Card, Typography } from "@mui/material";

const HorizontalChart = () => {
  const grey = "#d9d9d9";
  const green = "#98d16c";
  const optionFont = "#959595";

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
  const dataTF = [
    {
      name: "True",
      percent: 20,
      correct: false,
    },
    {
      name: "False",
      correct: true,
      percent: 80,
    },
  ];
  const data = [
    {
      name: "Option Adasdashdahsdlhasdasdnasdsak",
      percent: 80,
      correct: true,
    },
    {
      name: "Option B",
      percent: 10,
      correct: false,
    },
    {
      name: "Option C",
      percent: 5,
      correct: false,
    },
    {
      name: "Option D",
      percent: 0,
      correct: false,
    },
  ];
  // }
  return (
    <div>
      {data.map((option) => {
        return (
          <Box sx={{ my: 2 }} key={option.name}>
            <Typography variant="body1" sx={{ color: optionFont, mb: -2 }}>
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
export default HorizontalChart;
