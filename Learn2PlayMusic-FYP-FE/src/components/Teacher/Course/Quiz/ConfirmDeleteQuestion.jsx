import { Button, Grid, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../utils/Loader";

export default function ConfirmDeleteQuestion({ question, handleClose }) {
  const theme = useTheme();
  const { courseid, quizId } = useParams();

  const [open, setOpen] = useState(false);
  const confirmDeleteQuestion = async () => {
    setOpen(true);
    fetch(`${import.meta.env.VITE_API_URL}/course/quiz/question`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: question.questionId,
        quizId: quizId,
        courseId: courseid,
      }),
    })
      .then((res) => {
        setOpen(false);
        if (!res.ok) {
          toast.error("An error occured while deleting the question");
          return;
        }
        toast.success("Question deleted successfully");
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
        handleClose();
        if (err.message == "Failed to fetch") {
          toast.error("Question cannot be deleted as it is the only question in the quiz. Please delete the quiz instead.");
        }
      });
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            Are you sure you want to delete {question.question}
          </Typography>

          <Typography align="center" color="error" variant="subtitle1">
            Warning: This action cannot be undone.
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
            onClick={() => {
              handleClose();
            }}>
            Cancel
          </Button>

          <Button variant="contained" sx={{ mr: 1 }} color="error" onClick={() => confirmDeleteQuestion()}>
            Delete
          </Button>
        </Grid>
      </Grid>
      <Loader open={open} />
    </>
  );
}
