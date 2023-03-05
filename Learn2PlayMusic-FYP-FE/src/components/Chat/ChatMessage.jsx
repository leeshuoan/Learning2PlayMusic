import React from 'react'
import { Grid, ListItemText, Divider } from '@mui/material'

const ChatMessage = ({ message, userInfo }) => {
  const chatTimestamp = message.createdAt.toDate().toLocaleDateString() + " " + message.createdAt.toDate().toLocaleTimeString()
  let msgAlign = "right"
  if (userInfo.userInfo.id != message.uid) {
    msgAlign = "left"
  }

  return (
    <>
      <ListItemText align={msgAlign} primary={message.text}></ListItemText>
      <ListItemText align={msgAlign} secondary={chatTimestamp}></ListItemText>
      <Divider />
    </>
  )
}

export default ChatMessage