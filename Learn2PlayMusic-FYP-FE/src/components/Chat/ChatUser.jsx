import { Box, Button, Card, InputBase, Typography } from "@mui/material";
import { addDoc, collection, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../utils/firebase";
import ChatMessage from "./ChatMessage";

const ChatUser = ({ chatId, userInfo }) => {
  const drawerWidth = 240;
  const messagesRef = collection(db, `Chat#${chatId}`);
  const messagesEndRef = useRef(null);
  const chatQuery = query(messagesRef, orderBy("createdAt", "asc"), limit(25));

  const [newMsg, setNewMsg] = useState("");
  const [messages, loadingMsgs, error] = useCollectionData(chatQuery, { idField: "id" });

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newMsg !== "") {
      sendMsg();
    }
  };

  const sendMsg = async () => {
    var chatMsg = newMsg.replace(/[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g, "*********").replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, "*********");
    await addDoc(messagesRef, {
      text: chatMsg,
      createdAt: new Date(),
      uid: userInfo.id,
    });
    setNewMsg("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  if (!chatId) {
    return (
      <Typography variant="h6" sx={{
        textAlign: "center", mt: 6
      }}>
        Please select a chat or click on new chat to start messaging!
      </Typography>
    );
  }
  return (
    <>
      {chatId != "undefined" ? (
        <>
          {messages && messages.map((msg, key) => <ChatMessage key={key} userInfo={userInfo} message={msg} />)}
          <div ref={messagesEndRef} />
          <Box sx={{ display: "flex", position: "fixed", bottom: 0, width: { xs: `calc(100% - ${40}px)`, md: `calc(100% - ${drawerWidth + 40}px)` }, p: 3, pl: 0 }}>
            <Card variant="contained" sx={{ flexGrow: 1, display: "flex", alignItems: "center", p: 1, mr: 3, border: "black" }}>
              <InputBase sx={{ width: "100%" }} className="inputBase" placeholder="Type your message" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={handleKeyPress} disabled={!chatId} />
            </Card>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                sendMsg();
              }}
              disabled={newMsg === "" || !chatId}>
              Send
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h6" sx={{
            textAlign: "center", mt: 6
          }}>
            This chat is not valid!
          </Typography>
          <Typography variant="h6" sx={{
            textAlign: "center"
          }}>
            Please select a chat or click on new chat to start messaging!
          </Typography>
        </>
      )}
    </>
  );
};

export default ChatUser;
