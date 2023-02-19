import React, { useState, useEffect, useRef } from "react";
import { API } from "aws-amplify";

const Chat = ({ user, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const connectionIdRef = useRef(null); // to store the connection ID

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const conversationId =
  //         user.id < recipient.id
  //           ? `${user.id}-${recipient.id}`
  //           : `${recipient.id}-${user.id}`;
  //       const response = await API.get("chatApi", `/chat/${conversationId}`);
  //       setMessages(response);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       setError(error.message);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchMessages();

    // initialize WebSocket connection
    const initWebSocketConnection = async () => {
      try {
        const connectionResponse = await API.post("chatApi", "/connect", {
          body: {
            userId: user.id,
          },
        });
        connectionIdRef.current = connectionResponse.connectionId;
        setConnection(
          new WebSocket(
            `wss://EXAMPLE.execute-api.us-west-2.amazonaws.com/production?connectionId=${connectionIdRef.current}`
          )
        );
      } catch (error) {
        console.log(error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initWebSocketConnection();

    // close WebSocket connection on component unmount
    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, [user.id, recipient.id]);

  useEffect(() => {
    // handle incoming WebSocket messages
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((messages) => [...messages, data]);
    };

    if (connection) {
      connection.onopen = () => {
        setIsConnected(true);
      };
      connection.onmessage = handleMessage;
    }

    // clean up connection ID mapping on component unmount
    return () => {
      if (connectionIdRef.current) {
        API.post("chatApi", "/disconnect", {
          body: {
            connectionId: connectionIdRef.current,
          },
        });
      }
    };
  }, [connection]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const conversationId =
        user.id < recipient.id
          ? `${user.id}-${recipient.id}`
          : `${recipient.id}-${user.id}`;
      const response = await API.post("chatApi", "/chat", {
        body: {
          conversationId,
          author: user.id,
          recipient: recipient.id,
          messageBody: message,
        },
      });
      setMessages((messages) => [...messages, response]);
      setMessage("");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return <div></div>;
};
