import React from "react";
import { Grid } from "@mui/material";
import QuizCard from "./QuizCard";

function Quiz({ quizData }) {
  return (
    <Grid container spacing={3} >
      {quizData.map(({ question, options, answer, questionImage }, index) => (
        <Grid key={question} item xs={12}>
          <QuizCard
            index={index + 1}
            question={question}
            options={options}
            answer={answer}
            image={questionImage}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default Quiz;
