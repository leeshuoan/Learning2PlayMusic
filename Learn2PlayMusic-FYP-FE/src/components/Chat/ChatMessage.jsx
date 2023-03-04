import React from 'react'
import { Grid, ListItemText } from '@mui/material'

const ChatMessage = (message) => {
  const chatTimestamp = message.message.createdAt.toDate().toLocaleDateString() + " " + message.message.createdAt.toDate().toLocaleTimeString()

  console.log(message)
  return (
    <>
      <Grid item xs={12}>
        <ListItemText align="right" primary={message.message.text}></ListItemText>
      </Grid>
      <Grid item xs={12}>
        <ListItemText align="right" secondary={chatTimestamp}></ListItemText>
      </Grid>
    </>
  )
}

export default ChatMessage