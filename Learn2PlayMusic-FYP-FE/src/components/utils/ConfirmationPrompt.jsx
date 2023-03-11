import React from "react";
import { Box, Button, Typography } from "@mui/material";
import TransitionModal from "./TransitionModal";
const ConfirmationPrompt = ({ open, handleClose, action, topic, handleAction }) => {
  return (
    <TransitionModal open={open} handleClose={handleClose}>
      {/* message */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {action} {topic}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Are you sure you want to {action.toLowerCase()} this {topic.toLowerCase()}
        </Typography>
      </Box>
      {/* buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
        <Button fullWidth variant="outlined" sx={{ mr: 1, color: "primary.main" }} onClick={handleClose}>
          Cancel
        </Button>
        {action == "Delete" ? (
          <Button fullWidth variant="contained" color="error" onClick={handleAction}>
            Yes
          </Button>
        ) : (
          <Button fullWidth variant="contained" color="primary" onClick={handleAction}>
            Yes
          </Button>
        )}
      </Box>
    </TransitionModal>
  );
};
export default ConfirmationPrompt;
