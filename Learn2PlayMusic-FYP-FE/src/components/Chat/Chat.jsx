import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, query, orderBy, limit, addDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import { Breadcrumbs, Link, Box, Button, Divider, Drawer, List, ListItem, ListItemButton, Toolbar, Typography, InputBase, ListItemText, Card, IconButton, Grid } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useAppBarHeight from "../utils/AppBarHeight";
import MenuIcon from "@mui/icons-material/Menu";
const drawerWidth = 240;

function Chat(userInfo) {
  let contacts = [
    {
      id: "Chat#1",
      name: "TeacherName",
    },
    {
      id: "Chat#2",
      name: "AdminName",
    },
  ];

  if (userInfo.userInfo.name === "TeacherName") {
    contacts = [
      {
        id: "Chat#1",
        name: "StudentName",
      },
      {
        id: "Chat#2",
        name: "AdminName",
      },
    ];
  }

  const messagesEndRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [newMsg, setNewMsg] = useState("");
  const navigate = useNavigate();

  const messagesRef = collection(db, "Chat#1");
  const chatQuery = query(messagesRef, orderBy("createdAt", "asc"), limit(25));

  const [messages, loadingMsgs, error] = useCollectionData(chatQuery, {
    idField: "id",
  });

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // check for SG phone number or email
  function invalidMessage(message) {
    // Regular expression patterns
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g;

    // Check if message contains email
    if (emailRegex.test(message)) {
      return true; // message is invalid
    } else {
      // remove all non digits in the message
      phoneNumCheck = message.replace(/\D/g, "");
      // Check if message contains phone number
      if (phoneRegex.test(phoneNumCheck)) {
        return true; // message is invalid
      }
      return false; // message is valid
    }
  }
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newMsg !== "") {
      sendMsg();
    }
  };
  const sendMsg = async () => {
    // if (invalidMessage(newMsg)) {
    //   return; //show some message?
    // }
    var chatMsg = newMsg.replace(/[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g, "*********").replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, "*********");
    console.log(chatMsg);
    await addDoc(messagesRef, {
      text: chatMsg,
      createdAt: new Date(),
      uid: userInfo.userInfo.id,
    });
    console.log("Message sent!");
    setNewMsg("");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* DEFAULT RENDER */}
      <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width: drawerWidth, flexShrink: 1, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" } }}>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ ml: 1, mt: 2 }}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
              onClick={() => {
                userInfo.userInfo.role == "Teacher" ? navigate("/teacher") : navigate("/home");
              }}>
              <HomeIcon sx={{ mr: 0.5 }} />
              Home
            </Link>
            <Typography>Chat</Typography>
          </Breadcrumbs>
          <Divider sx={{ mt: 2 }} />
          <List sx={{ p: 0 }}>
            {contacts.map((contact) => (
              <>
                <ListItem key={contact.id} selected={selectedChat.id == contact.id} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={contact.name} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* MOBILE RENDER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}>
        <Box sx={{ overflow: "auto" }}>
          <Toolbar />
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ ml: 1, mt: 2 }}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
              onClick={() => {
                userInfo.userInfo.role == "Teacher" ? navigate("/teacher") : navigate("/home");
              }}>
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
      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, pb: 10 }}>
        <Box
          sx={{
            p: 3,
            pt: 2,
            display: "flex",
            flexDirection: "column",
            height: `calc(100vh - ${useAppBarHeight() + 96}px)`, // NEED TO FIX
            overflow: "hidden",
            overflowY: "scroll",
          }}>
          <Grid container spacing={0}>
            <Grid item xs={2}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ ml: 1, p: 0, display: { sm: "none" } }}>
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {selectedChat.name}
              </Typography>
            </Grid>
          </Grid>
          {messages && messages.map((msg) => <ChatMessage key={msg.id} userInfo={userInfo} message={msg} />)}
          <div ref={messagesEndRef} />
          <Box sx={{ display: "flex", position: "fixed", bottom: 0, width: { xs: `calc(100% - ${40}px)`, md: `calc(100% - ${drawerWidth + 40}px)` }, p: 3, pl: 0 }}>
            <Card variant="contained" sx={{ flexGrow: 1, display: "flex", alignItems: "center", p: 1, mr: 3, border: "black" }}>
              <InputBase sx={{ width: "100%" }} className="inputBase" placeholder="Type your message" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={handleKeyPress} />
            </Card>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                sendMsg();
              }}
              disabled={newMsg === ""}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
