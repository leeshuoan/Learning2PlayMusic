import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatUser from "./ChatUser";
import { Box, Breadcrumbs, Button, Card, Divider, Drawer, Grid, IconButton, InputBase, Link, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import useAppBarHeight from "../utils/AppBarHeight";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import Loader from "../utils/Loader";
import TransitionModal from "../utils/TransitionModal";
import CloseIcon from "@mui/icons-material/Close";

function Chat({ userInfo }) {
  const { chatId } = useParams("chatId")
  const drawerWidth = 240;
  const [contacts, setContacts] = useState([{ id: "", name: "" }]);
  const [chats, setChats] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLoading, setOpenLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [openContactList, setOpenContactList] = useState(false);
  const [root, setRoot] = useState(userInfo.role == "Admin" ? "/admin" : userInfo.role == "User" ? "/home" : "/teacher");
  const navigate = useNavigate();

  const modalStyle = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderRadius: 2,
    p: 4,
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

  async function request(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return response.json();
  }

  const contactListAPI = request(`/user/chat/contactlist?userId=${userInfo.id}`)
  const openChatAPI = request(`/user/chat?userId=${userInfo.id}`)

  useEffect(() => {
    async function fetchContacts() {
      const [res1, res2] = await Promise.all([contactListAPI, openChatAPI]);
      console.log(res1);
      console.log(res2);

      let contactIds = [];
      const newChatData = res2.map((chat) => {
        if (!contactIds.includes(chat.ChatId)) {
          return {
            chatId: chat.ChatId,
            name: chat.ChatName,
            role: chat.ChatRole
          }
        }
      })

      const contactData = res1.map((contact) => {
        let contactKeys = Object.keys(contact);
        let id = "";
        let name = "";
        let role = "";
        for (let k of contactKeys) {
          if (k.endsWith("Id")) {
            id = contact[k];
            role = k.split("Id")[0];
            role = role.charAt(0).toUpperCase() + role.slice(1);
          }
          if (k.endsWith("Name")) {
            name = contact[k];
          }
        }
        return {
          id: id,
          name: name,
          role: role
        };
      });

      setContacts(contactData);
      setChats(res2)

    }
    console.log(userInfo)
    fetchContacts().then(() => {
      setOpenLoading(false);
    });
  }, [userInfo]);

  return (
    <Box sx={{ display: "flex" }}>
      <TransitionModal open={openContactList} style={modalStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Contact List</Typography>
          <IconButton onClick={() => setOpenContactList(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {contacts.map((contact, key) => (
            <Box key={key}>
              <ListItem key={contact.id} disablePadding>
                <ListItemButton>{<ListItemText primary={contact.name} />}</ListItemButton>
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      </TransitionModal>

      {/* DEFAULT RENDER */}
      <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width: drawerWidth, flexShrink: 1, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" } }}>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ ml: 1 }}>
            <CustomBreadcrumbs root={root} breadcrumbEnding={"Chat"} />
          </Box>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "center", my: 1 }} onClick={() => setOpenContactList(true)}>
            <Button variant="contained" sx={{ width: "90%" }} >New Chat</Button>
          </Box>
          <List sx={{ p: 0 }}>
            {chats.map((chat, key) => (
              <Box key={key}>
                <ListItem onClick={() => navigate(`/chat/${chat.ChatId}`)} disablePadding>
                  <ListItemButton selected={chatId == chat.ChatId}>{<ListItemText primary="Jeff" />}</ListItemButton>
                </ListItem>
                <Divider />
              </Box>
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
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}>
        <Box sx={{ overflow: "auto" }}>
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
          <Box sx={{ ml: 1 }}>
            <CustomBreadcrumbs root={root} breadcrumbEnding={"Chat"} />
          </Box>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "center", my: 1 }} onClick={() => setOpenContactList(true)}>
            <Button variant="contained" sx={{ width: "90%" }} >New Chat</Button>
          </Box>
          <List sx={{ p: 0 }}>
            {chats.map((chat, key) => (
              <Box key={key}>
                <ListItem onClick={() => navigate(`/chat/${chat.ChatId}`)} disablePadding>
                  <ListItemButton selected={chatId == chat.ChatId}>{<ListItemText primary="Jeff" />}</ListItemButton>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, pb: 10 }}>
        <Box
          sx={{
            p: 3,
            pt: 2,
            display: "flex",
            flexDirection: "column",
            height: `calc(100vh - ${useAppBarHeight() + 96}px)`,
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
          <ChatUser chatId={1} userInfo={userInfo}/>
        </Box>
      </Box>
      <Loader open={openLoading} />
    </Box>
  );
}

export default Chat;
