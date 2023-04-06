import { Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";

export default function ReportGenerationForm({ courseId, courseName, handleClose, handleCloseSuccess }) {
  dayjs.extend(customParseFormat);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);

  const confirmGenerateReport = async () => {
    setOpen(true);
    if (date == null) {
      toast.error("Please select a date");
      setOpen(false);
      return;
    }
    const endpoint = `${import.meta.env.VITE_API_URL}/course/report`;
    const myInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseId,
        availableDate: date.add(1, "day").toISOString(),
      }),
    };
    console.log(
      JSON.stringify({
        courseId: courseId,
        availableDate: date.add(1, "day").toISOString(),
      })
    );
    const res = await fetch(endpoint, myInit);
    const data = await res.json();
    if (res.ok) {
      toast.success("Report generated successfully!");
      handleCloseSuccess();
      setOpen(false);
    } else {
      toast.error(data.message);
      setOpen(false);
      handleClose();
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography align="center" variant="h5" sx={{ mb: 2 }}>
            Generate Progress Report for all users in {courseName}?
          </Typography>
          <Typography align="center" variant="body">
            This will generate reports for all the users in the course in the month of the selected date below.
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "left" }}>
          <LocalizationProvider required dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Report Available Date*"
              sx={{ mt: 3 }}
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              component={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>{" "}
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

          <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmGenerateReport()}>
            Generate
          </Button>
        </Grid>

        <Loader open={open} />
      </Grid>
    </>
  );
}
