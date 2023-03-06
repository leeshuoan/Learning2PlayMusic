import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, query, orderBy, limit, addDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import {
  Breadcrumbs,
  Link,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
  InputBase,
  ListItemText,
  Card,
  IconButton,
  Grid,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { width } from "@mui/system";
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

  const messagesEndRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newMsg !== "") {
      sendMsg();
    }
  };

  const drawer = (
    <div>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ ml: 1, mt: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            navigate("/home");
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
    </div>
  );
  const sendMsg = async () => {
    // if (invalidMessage(newMsg)) {
    //   return; //show some messaeg?
    // }
    var chatMsg = newMsg
      .replace(/[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g, "*********")
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, "*********");
    console.log(chatMsg);
    await addDoc(messagesRef, {
      text: chatMsg,
      createdAt: new Date(),
      uid: userInfo.userInfo.id,
    });
    console.log("Message sent!");
    // const chatRef = doc(db, "Chat#1", "hi")
    // await setDoc(chatRef, {
    //   text: newMsg,
    //   createdAt: new Date(),
    //   uid: userInfo.id,
    // }, { merge: true })
    setNewMsg("");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* mobile drawer */}
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
        <Box sx={{ overflow: "auto" }}>{drawer}</Box>
      </Drawer>
      {/* main drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>{drawer}</Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          pb: 10,
        }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 1, display: { sm: "none" } }}>
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6" align="center" mt={1} sx={{display: { sm: "none" } }}>
              Chat
            </Typography>
            <Typography variant="h6" align="center" mt={1} sx={{ ml: `${drawerWidth}px`, display: { xs: "none", sm:"block" } }}>
              Chat
            </Typography>
          </Grid>
          <Grid item xs={2} />
        </Grid>
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: 500, // NEED TO FIX
            overflow: "hidden",
            overflowY: "scroll",
          }}>
          {messages &&
            messages.map((msg) => (
              <ChatMessage key={msg.id} userInfo={userInfo} message={msg} />
            ))}
          <div ref={messagesEndRef} />
          <Box
            sx={{
              display: "flex",
              position: "fixed",
              bottom: 0,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              p: 3,
            }}>
            <Card
              variant="contained"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                p: 1,
                mr: 3,
                border: "black",
              }}>
              <InputBase
                sx={{ width: "100%" }}
                className="inputBase"
                placeholder="Type your message"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={handleKeyPress}
              />
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
