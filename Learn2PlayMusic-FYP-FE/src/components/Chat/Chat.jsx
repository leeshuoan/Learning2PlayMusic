import { useState } from "react";
import { db } from '../utils/firebase';
import { collection, query, orderBy, limit, addDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import { Breadcrumbs, Link, Box, Button, Divider, Drawer, List, ListItem, ListItemButton, Toolbar, Typography, InputBase, ListItemText, Card } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
const drawerWidth = 240;

function Chat(userInfo) {
  const contacts = [
    {
      id: "Chat#1",
      name: "TeacherName",
    },
    {
      id: "Chat#2",
      name: "AdminName",
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [newMsg, setNewMsg] = useState("");

  const messagesRef = collection(db, "Chat#1")
  const chatQuery = query(messagesRef, orderBy("createdAt", "asc"), limit(25));

  const [messages, loadingMsgs, error] = useCollectionData(chatQuery, { idField: "id" });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sendMsg = async () => {
    await addDoc(messagesRef, {
      text: newMsg,
      createdAt: new Date(),
      uid: userInfo.userInfo.id,
    })
    // const chatRef = doc(db, "Chat#1", "hi")
    // await setDoc(chatRef, {
    //   text: newMsg,
    //   createdAt: new Date(),
    //   uid: userInfo.id,
    // }, { merge: true })
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 1,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ ml: 1, mt: 2 }}>
            <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }} onClick={() => { navigate('/home') }}>
              <HomeIcon sx={{ mr: 0.5 }} />
              Home
            </Link>
            <Typography>Chat</Typography>
          </Breadcrumbs>
          <Divider sx={{ mt: 2 }} />
          <List sx={{ p: 0 }}>
            {contacts.map((contact) => (
              <div>
                <ListItem key={contact.id} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={contact.name} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>

        <Box sx={{ p: 3 }}>
          {messages && messages.map((msg) => <ChatMessage key={msg.id} userInfo={userInfo} message={msg} />)}
        </Box>

        <Box sx={{ display: "flex", position: "fixed", bottom: 0, width: { sm: `calc(100% - ${drawerWidth}px)` }, p: 3 }}>
          <Card variant="contained" sx={{ flexGrow: 1, display: "flex", alignItems: "center", p: 1, mr: 3, border: "black" }}>
            <InputBase
              sx={{ width: "100%" }}
              className="inputBase"
              placeholder="Type your message"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
          </Card>
          <Button variant="contained" size="large" onClick={() => {sendMsg()}}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
