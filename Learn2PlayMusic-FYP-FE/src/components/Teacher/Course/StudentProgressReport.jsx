import { useState } from 'react'
import { Box, Button, Divider, Typography, FormControlLabel, FormLabel, InputLabel, Radio, RadioGroup, TextField } from '@mui/material'

const StudentProgressReport = (report) => {
  const metrics = {
    posture: "Posture",
    rhythm: "Rhythm",
    toneQuality: "Tone Quality",
    dynamicsControl: "Dynamic Control",
    articulation: "Articulation",
    sightReading: "Sight Reading",
    practice: "Reading",
    theory: "Theory",
    scales: "Scales",
    aural: "Aural",
    musicality: "Musicality",
    performing: "Performing",
    enthusiasm: "Enthusiasm",
    punctuality: "Punctuality",
    attendance: "Attendance",
  };
  const performance = ["Poor", "Weak", "Satisfactory", "Good", "Excellent", "N.A."];

  console.log(report)
  const [goals, setGoals] = useState(report.report.GoalsForNewTerm);
  const [comments, setComments] = useState(report.report.AdditionalComments);

  const handleGoalsChange = (event) => {
    setGoals(event.target.value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  console.log(report)
  return (
    <>
      <Box sx={{ display: report.report.Available ? "block" : "none" }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Available on: {report.report.AvailableDate}
        </Typography>
        {Object.keys(metrics).map((metric, key) => (
          <Box key={key}>
            <FormLabel>{metrics[metric]}</FormLabel>
            <RadioGroup name={metric} sx={{ mb: 1 }} row>
              {performance.map((performance, key) => (
                <FormControlLabel checked={report.report.EvaluationList[metric] == performance} value={performance} key={key} control={<Radio size="small" />} label={performance} />
              ))}
            </RadioGroup>
          </Box>
        ))}
        <InputLabel id="goals-for-the-new-term" sx={{ mt: 2 }}>
          Goals for the New Term
        </InputLabel>
        <TextField variant="outlined" rows={7} multiline fullWidth sx={{ mt: 1, mb: 2 }} value={goals} onChange={handleGoalsChange} />
        <InputLabel id="additional-comments">Additional Comments</InputLabel>
        <TextField variant="outlined" rows={7} multiline fullWidth sx={{ mt: 1 }} value={comments} onChange={handleCommentsChange} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: report.report.Available ? "none" : "block" }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: "grey" }}>
          Not Available Yet
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Available on: {report.report.AvailableDate}
        </Typography>
      </Box>
    </>

  )
}

export default StudentProgressReport