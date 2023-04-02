import React from 'react'
import { Grid, ListItemText, Divider } from '@mui/material'

const ChatMessage = ({message, userInfo}) => {
  const chatTimestamp = message.createdAt.toDate().toLocaleDateString() + " " + message.createdAt.toDate().toLocaleTimeString()
  let msgAlign = "right"
  if (userInfo.id != message.uid) {
    msgAlign = "left"
  } 

  return (
    <>
      <Grid item xs={12}>
        <ListItemText align={msgAlign} primary={message.text}></ListItemText>
      </Grid>
      <Grid item xs={12}>
        <ListItemText align={msgAlign} secondary={chatTimestamp}></ListItemText>
      </Grid>
      <Divider/>
    </>
  )
}

export default ChatMessage