import { useState } from "react";
import { Grid } from "@mui/material";
import QuizCard from "./QuizCard";

function Quiz({ quizData }) {
  console.log(quizData)
  // const [selectedCnt, setSelectedCnt] = useState(0);

  return (
    <Grid container spacing={3} >
      {quizData.map(({ Question, Options, Answer }, index) => (
        <Grid key={index} item xs={12}>
          <QuizCard
            index={index + 1}
            question={Question}
            options={Options}
            answer={Answer}
            // selected = {selected}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default Quiz;
