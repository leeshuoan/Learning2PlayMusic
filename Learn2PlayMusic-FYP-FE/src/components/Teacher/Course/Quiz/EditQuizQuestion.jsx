import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditQuizEditQuestion from "./EditQuizEditQuestion";

const EditQuizQuestion = ({ userInfo, question, questionNumber, handleRefreshData, handleDisableEditQuizButton }) => {
  const [edit, setEdit] = useState(false);
  const { courseid, quizId } = useParams();

  const deleteQuestion = () => {
    fetch(`${import.meta.env.VITE_API_URL}/course/quiz/question`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: question.qnId,
        quizId: quizId,
        courseId: courseid,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("An error occured while deleting the question");
          return;
        }
        toast.success("Question deleted successfully");
        handleRefreshData();
      })
      .catch((err) => {
        console.log(err);
        if (err.message == "Failed to fetch") {
          toast.error("Question cannot be deleted as it is the only question in the quiz. Please delete the quiz instead.");
        }
      });
  };

  return (
    <>
      {!edit ? (
        <Card variant="outlined" sx={{ boxShadow: "none", mt: 3, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Question {questionNumber}
          </Typography>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={9}>
              <Box sx={{ display: "flex", mb: 1 }}>
                {question.questionImage && (
                  <Box sx={{ mr: 2 }}>
                    <img src={question.questionImage} height="100" width="100" />
                  </Box>
                )}
                <Box>
                  <Typography variant="subsubtitle">Question</Typography>
                  <Typography variant="body1">{question.question}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subsubtitle" sx={{ mb: 1 }}>
                Question Type
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {question.questionOptionType == "multiple-choice" ? "Multiple Choice" : question.questionOptionType == "true-false" ? "True or False" : ""}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subsubtitle" sx={{ mb: 1 }}>
                Question Answer
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {question.answer}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {question.questionOptionType == "multiple-choice" && (
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="subsubtitle" sx={{ mb: 1 }}>
                    Question Options
                  </Typography>
                  {question.options.map((option, key) => {
                    return (
                      <Box key={key} sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          {option}
                        </Typography>
                        {question.answer == option && <CheckCircleOutlineIcon sx={{ color: "success.main" }} />}
                      </Box>
                    );
                  })}
                </Grid>
              )}
              {question.questionOptionType == "true-false" && (
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="subsubtitle" sx={{ mb: 1 }}>
                    Question Options
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                      True
                    </Typography>
                    {question.answer == "True" && <CheckCircleOutlineIcon sx={{ color: "success.main" }} />}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                      False
                    </Typography>
                    {question.answer == "False" && <CheckCircleOutlineIcon sx={{ color: "success.main" }} />}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ color: "primary.main" }}
              onClick={() => {
                setEdit(true);
                handleDisableEditQuizButton(true);
              }}>
              Edit Question
            </Button>
            <Button variant="outlined" fullWidth color="error" sx={{ ml: 2, color: "error.main" }} onClick={() => deleteQuestion()}>
              Delete Question
            </Button>
          </Box>
        </Card>
      ) : (
        <EditQuizEditQuestion userInfo={userInfo} qnInfo={question} setEdit={setEdit} questionNumber={questionNumber} handleDisableEditQuizButton={handleDisableEditQuizButton} />
      )}
    </>
  );
};

export default EditQuizQuestion;
