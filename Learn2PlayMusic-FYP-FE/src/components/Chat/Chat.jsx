import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAppBarHeight from "../utils/AppBarHeight";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
import Loader from "../utils/Loader";
import TransitionModal from "../utils/TransitionModal";
import ChatUser from "./ChatUser";
import PaginatedContactList from "./PaginatedContactList";

function Chat({ userInfo }) {
  const { chatId } = useParams("chatId");
  const drawerWidth = 240;
  const [contacts, setContacts] = useState([{ id: "", name: "" }]);
  const [chats, setChats] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLoading, setOpenLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [openContactList, setOpenContactList] = useState(false);
  const [root, setRoot] = useState(userInfo.role == "Admin" ? "/admin" : userInfo.role == "User" ? "/home" : userInfo.role == "SuperAdmin" ? "/superadmin" : "/teacher");
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
    p: 3,
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const contactListAPI = request(`/user/chat/contactlist?userId=${userInfo.id}`);
  const openChatAPI = request(`/user/chat?userId=${userInfo.id}`);

  useEffect(() => {
    async function fetchContacts() {
      const [res1, res2] = await Promise.all([contactListAPI, openChatAPI]);

      let contactIds = [];
      const chatData = res2.map((chat) => {
        contactIds.push(chat.receiverId);
        let receiverRole = "";
        if (chat.PK.includes(userInfo.id)) {
          receiverRole = chat.SK.split(`#${chat.receiverId}`)[0];
        } else {
          receiverRole = chat.PK.split(`#${chat.receiverId}`)[0];
        }
        return {
          id: chat.ChatId,
          receiverId: chat.receiverId,
          receiverName: chat.receiverName,
          receiverRole: receiverRole,
        };
      });

      const contactData = res1
        .filter((contact) => {
          let contactKeys = Object.keys(contact);
          let id = "";
          for (let k of contactKeys) {
            if (k.endsWith("Id")) {
              id = contact[k];
            }
          }
          return !contactIds.includes(id);
        })
        .map((contact) => {
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
            role: role,
          };
        });

      setContacts(contactData);
      setChats(chatData);
    }

    fetchContacts().then(() => {
      setOpenLoading(false);
    });
  }, [userInfo, reload]);

  const startChat = (contact) => {
    setOpenContactList(false);
    setOpenLoading(true);
    const newChat = {
      firstUserId: userInfo.id,
      secondUserId: contact.id,
    };

    fetch(`${import.meta.env.VITE_API_URL}/user/chat?firstUserId=${userInfo.id}&secondUserId=${contact.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(newChat),
    })
      .then((res) => {
        res.json().then((data) => {
          navigate(`/chat/${data.item.ChatId}`);
          setReload(!reload);
        });
      })
      .catch((err) => {
        console.log(err);
        setOpenLoading(false);
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TransitionModal open={openContactList} style={modalStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ ml: 2 }} >
            New Chat
          </Typography>
          <IconButton onClick={() => setOpenContactList(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box>
          <PaginatedContactList contacts={contacts} startChat={startChat} />
        </Box>
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
            <Button variant="contained" sx={{ width: "90%" }}>
              New Chat
            </Button>
          </Box>
          <List sx={{ p: 0 }}>
            {chats.map((chat, key) => (
              <Box key={key}>
                <ListItem onClick={() => navigate(`/chat/${chat.id}`)} disablePadding>
                  <ListItemButton selected={chatId == chat.id}>{<ListItemText primary={`[${chat.receiverRole}] ${chat.receiverName}`} />}</ListItemButton>
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
              <Button variant="contained" sx={{ width: "90%" }}>
                New Chat
              </Button>
            </Box>
            <List sx={{ p: 0 }}>
              {chats.map((chat, key) => (
                <Box key={key}>
                  <ListItem onClick={() => navigate(`/chat/${chat.id}`)} disablePadding>
                    <ListItemButton selected={chatId == chat.id}>{<ListItemText primary="Jeff" />}</ListItemButton>
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
                {chatId ? (
                  <>
                    {chats.map((chat) => {
                      if (chat.id == chatId) {
                        return `[${chat.receiverRole}] ${chat.receiverName}`;
                      }
                    })
                    }
                  </>
                ) : (
                  <Typography variant="h6" sx={{ textAlign: "center" }}>No chat selected</Typography>
                )}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ textAlign: "center", display: { xs: "none", md: "block" } }}>
            {chatId ? (
              <>
                {chats.map((chat) => {
                  if (chat.id == chatId) {
                    return `[${chat.receiverRole}] ${chat.receiverName}`;
                  }
                })
                }
              </>
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center" }}>No chat selected</Typography>
            )}
          </Typography>
          <ChatUser chatId={chatId} userInfo={userInfo} />
        </Box>
      </Box>
      <Loader open={openLoading} />
    </Box>
  );
}

export default Chat;
