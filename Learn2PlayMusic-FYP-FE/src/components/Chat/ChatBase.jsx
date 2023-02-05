import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  InputBase,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

const ChatBase = () => {
  // const theme = useTheme();
  // const navigate = useNavigate();
  const [message, setMessage] = useState("");
  // // messages should be fetched from dynamodb ========
  // // const [messages, setMessages] = useState([]);
  // // this is a dummy data for testing
  // const [messages, setMessages] = useState([
  //   { 1: "Hello" },
  //   { 2: "How are you?" },
  // ]);
  // // useEffect(() => {
  // //   // Fetch existing messages from the backend
  // //   // ...

  // //   // Return a cleanup function to handle component unmounting
  // //   return () => {
  // //     // Clean up any resources, such as event listeners or network connections
  // //     // ...
  // //   };
  // // }, []);

  const handleSendMessage = () => {
    // Send the message to the backend
    // ...

    // Clear the message input field
    setMessage("");
  };
  return (
    <div>
      <Container maxWidth="xl" sx={{ width: 0.9, pt: 20 }}>
        <Paper>
          <SendIcon
            aria-label="send"
            onClick={handleSendMessage}
            sx={{ pt: 1 }}></SendIcon>
        </Paper>
      </Container>
    </div>
  );
};
export default ChatBase;
