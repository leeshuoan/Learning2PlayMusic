import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Button, Card, Divider, Drawer, Grid, IconButton, InputBase, Link, List, ListItem, ListItemButton, Toolbar, Typography } from "@mui/material";
import { addDoc, collection, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useAppBarHeight from "../utils/AppBarHeight";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
import { db } from "../utils/firebase";
import ChatMessage from "./ChatMessage";
const drawerWidth = 240;

function Chat(userInfo) {
  // let contacts = [
  //   {
  //     id: "Chat#1",
  //     name: "TeacherName",
  //   },
  //   {
  //     id: "Chat#2",
  //     name: "AdminName",
  //   },
  // ];

  // if (userInfo.userInfo.name === "TeacherName") {
  //   contacts = [
  //     {
  //       id: "Chat#1",
  //       name: "StudentName",
  //     },
  //     {
  //       id: "Chat#2",
  //       name: "AdminName",
  //     },
  //   ];
  // }
  const userId = userInfo.userInfo.id;
  const contactListAPI = `${import.meta.env.VITE_API_URL}/user/chat/contactlist?userId=${userId}`;
  const messagesEndRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [newMsg, setNewMsg] = useState("");
  const [root, setRoot] = useState(userInfo.userInfo.role == "Admin" ? "admin" : userInfo.userInfo.role == "Student" ? "home" : "teacher");
  const navigate = useNavigate();

  const messagesRef = collection(db, "Chat#1");
  const chatQuery = query(messagesRef, orderBy("createdAt", "asc"), limit(25));

  const [messages, loadingMsgs, error] = useCollectionData(chatQuery, {
    idField: "id",
  });

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //// check for SG phone number or email
  // function invalidMessage(message) {
  //   // Regular expression patterns
  //   const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  //   const phoneRegex = /[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g;

  //   // Check if message contains email
  //   if (emailRegex.test(message)) {
  //     return true; // message is invalid
  //   } else {
  //     // remove all non digits in the message
  //     phoneNumCheck = message.replace(/\D/g, "");
  //     // Check if message contains phone number
  //     if (phoneRegex.test(phoneNumCheck)) {
  //       return true; // message is invalid
  //     }
  //     return false; // message is valid
  //   }
  // }
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

  async function getAPI(endpoint) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  useEffect(() => {
    console.log("useEffect called");
    getAPI(contactListAPI).then((res) => {
      console.log(res);
      var fetchedData = res.map((contact) => {
        let contactKeys = Object.keys(contact);
        let id = "";
        let name = "";
        for (k of contactKeys) {
          if (k.endsWith("Id")) {
            id = contact[k];
          }
          if (k.endsWith("Name")) {
            name = contact[k];
          }
        }
        return {
          id: id,
          name: name,
        };
      });
      setContacts(fetchedData);
      console.log(fetchedData);
    });

    scrollToBottom();
    console.log(userInfo.userInfo);
  }, [messages]);
  return (
    <Box sx={{ display: "flex" }}>
      {/* DEFAULT RENDER */}
      <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width: drawerWidth, flexShrink: 1, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" } }}>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ ml: 1 }}>
            <CustomBreadcrumbs root={root} breadcrumbEnding={"Chat"} />
          </Box>
          <Divider sx={{ mt: 2 }} />
          <List sx={{ p: 0 }}>
            {contacts.map((contact) => (
              <>
                <ListItem key={contact.id} selected={selectedChat.id == contact.id} disablePadding>
                  <ListItemButton>{/* <ListItemText primary={contact.name} /> */}</ListItemButton>
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
          {/* <List sx={{ p: 0 }}>
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
          </List> */}
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
          <Grid container spacing={0} sx={{ display: { md: "none" } }}>
            <Grid item xs={1}>
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ ml: 1, p: 0 }}>
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {/* {selectedChat.name} */}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ textAlign: "center", display: { xs: "none", md: "block" } }}>
            {/* {selectedChat.name} */}
          </Typography>
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
