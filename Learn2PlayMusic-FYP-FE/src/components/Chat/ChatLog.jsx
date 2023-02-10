import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import "../../App.css";

const ChatBase = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const contacts = [
    {
      id: 1,
      name: "Hen Doe",
    },
    {
      id: 2,
      name: "Jane Doe",
    },
  ];
  // TODO: remove static data and fetch from dynamodb
  const chats = [
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how are you?",
      timeStamp: "2021-08-01 12:00:00",
    },
    {
      id: 2,
      name: "Jane Doe",
      message: "I am doing good, thanks!",
      timeStamp: "2021-08-01 12:01:00",
    },
    {
      id: 3,
      name: "John Doe",
      message: "That is great to hear!",
      timeStamp: "2021-08-01 12:03:00",
    },
  ];

  return (
    <div className="chatRoot">
      <div className="sideBar">
        {/* TODO: add profile pic/latest text */}
        <List>
          {contacts.map((contact) => (
            <React.Fragment key={contact.id}>
              <ListItem>
                <ListItemText primary={contact.name} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>

      <div className="chat">
        {/* TOOD: add a typography so that at the top there will be the user name ? */}
        <div className="chatList">
          <List>
            {chats.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem>
                  <ListItemText
                    primary={chat.name}
                    secondary={chat.timeStamp}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary={chat.message} />
                </ListItem>

                <Divider />
              </React.Fragment>
            ))}
          </List>
        </div>
        <div className="inputContainer">
          <InputBase className="inputBase" placeholder="Type your message" />
          <IconButton aria-label="send">
            {/* TODO: handle send message action in the icon */}
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatBase;
