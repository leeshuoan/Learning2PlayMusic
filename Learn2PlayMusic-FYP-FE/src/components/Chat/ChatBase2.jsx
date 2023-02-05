import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Drawer from "@mui/material/Drawer";

const ChatBase2 = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const chats = [
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how are you?",
    },
    {
      id: 2,
      name: "Jane Doe",
      message: "I am doing good, thanks!",
    },
    {
      id: 3,
      name: "John Doe",
      message: "That is great to hear!",
    },
  ];

  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "space-between",
        height: "100%",
      }}>
      <div
        sx={{
          width: "70%",
          backgroundColor: "white",
          padding: "16px",
        }}>
        <div
          sx={{
            height: "calc(100% - 64px)",
            overflow: "auto",
          }}>
          <List>
            {chats.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem>
                  <ListItemText primary={chat.name} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </div>
        <div
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
          }}>
          <InputBase
            sx={{
              flexGrow: 1,
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid lightgray",
            }}
            placeholder="Type your message"
          />
          <IconButton
            sx={{
              padding: "8px",
            }}
            aria-label="send">
            <SendIcon />
          </IconButton>
        </div>
      </div>
      <div
        sx={{
          width: "30%",
          backgroundColor: "lightgray",
          padding: "16px",
        }}>
        <IconButton onClick={handleOpen}>Open Sidebar</IconButton>
        <Drawer open={open} onClose={handleClose}>
          <List>
            {chats.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem>
                  <ListItemText primary={chat.name} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default ChatBase2;
