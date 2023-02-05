// import React, { useState } from "react";
// import {
//   IconButton,
//   InputBase,
//   List,
//   ListItem,
//   ListItemText,
//   Drawer,
// } from "@mui/material";
// import SendIcon from "@material-ui/icons/Send";

// // This is the styles that we can place it into another file?

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     height: "100vh",
//   },
//   chatWindow: {
//     width: "70%",
//     padding: theme.spacing(2),
//     display: "flex",
//     flexDirection: "column",
//   },
//   chatHeader: {
//     width: "100%",
//     padding: theme.spacing(2),
//   },
//   chatBody: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     overflow: "auto",
//   },
//   inputContainer: {
//     padding: theme.spacing(2),
//     display: "flex",
//     alignItems: "center",
//   },
//   input: {
//     marginLeft: theme.spacing(1),
//     flex: 1,
//   },
//   iconButton: {
//     padding: 10,
//   },
//   chatList: {
//     width: "30%",
//     display: "flex",
//     flexDirection: "column",
//     padding: theme.spacing(2),
//   },
// }));
// const Chat = () => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const chats = [
//     { id: 1, name: "John Doe" },
//     { id: 2, name: "Jane Doe" },
//     { id: 3, name: "Jim Doe" },
//   ];
// };

// export default Chat;

// // old old code
// import { useEffect, useState } from "react";
// import {
//   Container,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   InputBase,
// } from "@mui/material";

// import SendIcon from "@mui/icons-material/Send";

// const ChatBase = () => {
//   // const theme = useTheme();
//   // const navigate = useNavigate();
//   const [message, setMessage] = useState("");
//   // // messages should be fetched from dynamodb ========
//   // // const [messages, setMessages] = useState([]);
//   // // this is a dummy data for testing
//   // const [messages, setMessages] = useState([
//   //   { 1: "Hello" },
//   //   { 2: "How are you?" },
//   // ]);
//   // // useEffect(() => {
//   // //   // Fetch existing messages from the backend
//   // //   // ...

//   // //   // Return a cleanup function to handle component unmounting
//   // //   return () => {
//   // //     // Clean up any resources, such as event listeners or network connections
//   // //     // ...
//   // //   };
//   // // }, []);

//   const handleSendMessage = () => {
//     // Send the message to the backend
//     // ...

//     // Clear the message input field
//     setMessage("");
//   };
//   return (
//     <div>
//       <Container maxWidth="xl" sx={{ width: 0.9, pt: 20 }}>
//         <Paper>
//           <SendIcon
//             aria-label="send"
//             onClick={handleSendMessage}
//             sx={{ pt: 1 }}></SendIcon>
//         </Paper>
//       </Container>
//     </div>
//   );
// };
// export default ChatBase;
