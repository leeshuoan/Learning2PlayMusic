import React, { useState } from "react";
import {
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Drawer,
} from "@mui/material";
import SendIcon from "@material-ui/icons/Send";

// This is the styles that we can place it into another file?

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  chatWindow: {
    width: "70%",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    width: "100%",
    padding: theme.spacing(2),
  },
  chatBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  inputContainer: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  chatList: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
}));
const Chat = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const chats = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
    { id: 3, name: "Jim Doe" },
  ];
};

export default Chat;
