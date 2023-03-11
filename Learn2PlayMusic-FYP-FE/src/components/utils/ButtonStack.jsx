import React from "react";
import { Link, Typography, Stack, Divider } from "@mui/material";

const ButtonStack = ({ titles, functions }) => {
  const buttons = [];
  for (var i = 0; i < titles.length; i++) {
    buttons.push(
      <Typography variant="button" onClick={functions[i]}>
        <Link underline="hover">{titles[i]}</Link>
      </Typography>
    );
  }
  return (
    <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
      {buttons}
    </Stack>
  );
};
export default ButtonStack;
