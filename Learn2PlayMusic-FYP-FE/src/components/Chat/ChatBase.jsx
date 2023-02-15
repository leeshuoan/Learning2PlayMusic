import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import "../../App.css";


const ChatBase = ({ userInfo }) => {
  console.log("userInfo");
  // get userInfo from parent component
  console.log(userInfo);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // TODO: remove static data and fetch from dynamodb
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
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://qniowqs0mf.execute-api.ap-southeast-1.amazonaws.com/test/chat/get_teachers?user_name=" +
          user_id
      );
      const data = await response.json();
      setTeachers(data.body);
      console.log(data);
    }
    fetchData();
  }, []);

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
      {/*   display teachers */}
      <div className="sideBar">
        <List>
          {teachers.map((contact) => (
            <React.Fragment key={contact.UserName}>
              <ListItem>
                <ListItemText primary={contact} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
      <div className="chat">
        <Typography variant="h5" gutterBottom>
          Select any teacher on the left to ask them questions that you might
          have!
        </Typography>
      </div>
    </div>
  );
};

export default ChatBase;
