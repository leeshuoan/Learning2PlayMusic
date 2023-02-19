import React, { useState, useEffect, useRef } from "react";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const region = "your-aws-region";
const apiGatewayEndpoint = "your-api-gateway-endpoint";
const teacherId = "your-teacher-id";
const studentId = "your-student-id";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [connectionId, setConnectionId] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    // Retrieve conversation history
    //from lambda
    };
    getConversationHistory();

    // Connect to WebSocket
    const connectToWebSocket = () => {
      const endpoint = `${apiGatewayEndpoint}/production`;
      const authToken = AWS.config.credentials.get().sessionToken;
      const connectionUrl = `${endpoint}?token=${authToken}`;
      ws.current = new WebSocket(connectionUrl);
      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setConnectionId(uuidv4()); // Generate a new connection ID
      };
      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.connectionId === connectionId) {
          setMessages((prevMessages) => [...prevMessages, data]); // Add new message to state
        }
      };
    };
    connectToWebSocket();

    return () => {
      // Close WebSocket connection on component unmount
      ws.current.close();
    };
  }, []);

  const handleNewMessage = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const dynamoDb = new AWS.DynamoDB.DocumentClient({ region });
    const params = {
      TableName: "Chat",
      Item: {
        conversationId: `${teacherId}_${studentId}`,
        timestamp: Date.now(),
        author: teacherId,
        messageBody: newMessage,
        recipient: studentId
      }
    };
    dynamoDb.put(params, (error) => {
      if (error) {
        console.log(error);
      } else {
        const messageData = {
          connectionId: connectionId,
          message: {
            conversationId: `${teacherId}_${studentId}`,
            timestamp: Date.now(),
            author: teacherId,
            messageBody: newMessage,
            recipient: studentId
          }
        };
        ws.current.send(JSON.stringify(messageData)); // Send new message to WebSocket
        setNewMessage("");
      }
    });
  };

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.timestamp}>{message.messageBody}</li>
        ))}
      </ul>
      <div>
        <input type="text" value={newMessage} onChange={handleNewMessage} />
        <button></button>
        </div>  
    </div>)};
