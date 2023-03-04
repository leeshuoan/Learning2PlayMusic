import { useState } from "react";
import { db } from '../utils/firebase';
import { collection, query, orderBy, limit, connectFirestoreEmulator } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import { Breadcrumbs, Link, Box, Button, Divider, Drawer, List, ListItem, ListItemButton, Toolbar, Typography, InputBase, IconButton, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
const drawerWidth = 240;

function Chat(userInfo) {
  console.log(userInfo)
  const [mobileOpen, setMobileOpen] = useState(false);

  const messagesRef = collection(db, "U#81c2ca2f-6a04-4e79-a41c-97aa85cf9edbT#756f1dce-9bcf-4325-b8e8-9524191938ee")
  const chatQuery =query(messagesRef, orderBy("createdAt", "asc"), limit(25));
  const [messages, loadingMsgs, error] = useCollectionData(chatQuery, { idField: "id" });
  console.log(messages)
  console.log(error)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
            zIndex: -1,
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
          <Divider sx={{ mt:2 }} />
          <List>
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        {/*  todo: render from db */}

        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Divider />

        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse

        </Typography>

        <InputBase
          sx={{ width: "90%" }}
          className="inputBase"
          placeholder="Type your message"
        />
        <IconButton aria-label="send">
          {/* TODO: handle send message action in the icon */}
          <Button variant="contained" size="large">
            Send
          </Button>
        </IconButton>
      </Box>
    </Box>
  );
}

export default Chat;
