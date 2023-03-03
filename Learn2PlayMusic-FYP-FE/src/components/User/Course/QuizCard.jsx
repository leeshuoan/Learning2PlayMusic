import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";

function QuizCard({ question, options, answer, image, index, handleOptionChange }) {
  console.log(image)
  const onSelectChange = (e) => {
    handleOptionChange(e.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Q{index}.{question}
        </Typography>
        {image && <img src={`${image}`} alt="question" />}
        <RadioGroup
          aria-label="quiz"
          name="quiz"
          onChange={onSelectChange}>
          {options.map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default QuizCard;
