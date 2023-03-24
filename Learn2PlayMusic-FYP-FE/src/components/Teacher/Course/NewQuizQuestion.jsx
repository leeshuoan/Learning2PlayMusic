import { useState } from 'react'
import { Card, Typography, InputLabel, TextField, Button, Box, IconButton, Select, MenuItem, Grid, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

const NewQuizQuestion = (qnInfo) => {
  const [question, setQuestion] = useState('')
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [questionType, setQuestionType] = useState('multiple-choice')
  const [options, setOptions] = useState({
    option1: '',
    option2: '',
    option3: '',
    option4: '',
  })

  const fileUploaded = async (e) => {
    setFile(e.target.files[0]);

    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsBinaryString(e.target.files[0]);

      reader.onload = (event) => {
        const uploadedImage = `data:${e.target.files[0].type};base64,${btoa(event.target.result)}`;
        setImage(uploadedImage)
      };
    }
  };

  console.log(qnInfo)
  const handleChange = (event) => {
    setQuestionType(event.target.value);
  };

  return (
    <>
      <Card variant="outlined" sx={{ boxShadow: "none", mt: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Question {qnInfo.qnInfo.qnNumber}</Typography>
        <Grid container sx={{ mb: 2 }} spacing={2}>
          <Grid item xs={12} md={6}>
            <InputLabel id="question-label">Question *</InputLabel>
            <TextField id="question" value={question} fullWidth onChange={() => setQuestion(event.target.value)} variant="outlined" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel id="question-image-label">Image [Optional]</InputLabel>
            {file == null ? (
              <Button variant="contained" sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: "none", ":hover": { backgroundColor: "hovergrey" } }} component="label">
                ADD A FILE
                <input hidden accept="image/*" multiple type="file" onChange={fileUploaded} />
              </Button>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton sx={{ pl: 0 }} onClick={() => setFile(null)}>
                  <ClearIcon />
                </IconButton>
                <Typography>{file.name}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        <InputLabel id="question-label">Question Type *</InputLabel>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} md={6}>
            <Select labelId='question-label' id="questionType" fullWidth value={questionType} onChange={handleChange}>
              <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
              <MenuItem value="true-false">True or False</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Box sx={{ display: questionType === "multiple-choice" ? "block" : "none" }}>
          <RadioGroup>
            <Grid container columnSpacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <FormControlLabel sx={{ mr: 0 }} value="option1" control={<Radio size="xs" />} />
                  <InputLabel id="question-label">Option 1 *</InputLabel>
                </Box>
                <TextField id="question" value={options.option1} fullWidth onChange={() => setOptions({ ...options, option1: event.target.value })} variant="outlined" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <FormControlLabel sx={{ mr: 0 }} value="option2" control={<Radio size="xs" />} />
                  <InputLabel id="question-label">Option 2 *</InputLabel>
                </Box>
                <TextField id="question" value={options.option2} fullWidth onChange={() => setOptions({ ...options, option2: event.target.value })} variant="outlined" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <FormControlLabel sx={{ mr: 0 }} value="option3" control={<Radio size="xs" />} />
                  <InputLabel id="question-label">Option 3 *</InputLabel>
                </Box>
                <TextField id="question" value={options.option3} fullWidth onChange={() => setOptions({ ...options, option3: event.target.value })} variant="outlined" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <FormControlLabel sx={{ mr: 0 }} value="option4" control={<Radio size="xs" />} />
                  <InputLabel id="question-label">Option 4 *</InputLabel>
                </Box>
                <TextField id="question" value={options.option4} fullWidth onChange={() => setOptions({ ...options, option4: event.target.value })} variant="outlined" required />
              </Grid>
            </Grid>
          </RadioGroup>
          <Typography variant="subsubtitle">Select the correct option using the radio buttons</Typography>
        </Box>
        <Box sx={{ display: questionType === "true-false" ? "block" : "none" }}>
          <InputLabel id="correct-option-label" sx={{ mt: 2 }}>Correct Option</InputLabel>
          <RadioGroup>
              <FormControlLabel sx={{ mr: 0 }} value={true} control={<Radio size="xs" />} label="True" />
              <FormControlLabel sx={{ mr: 0 }} value={false} control={<Radio size="xs" />} label="False" />
          </RadioGroup>
        </Box>
      </Card>
    </>
  )
}

export default NewQuizQuestion