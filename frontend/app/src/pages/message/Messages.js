import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Navbar from "../../components/NavBar";
import Disclaimer from "../../components/Disclaimer";
import apiClient from "../../services/apiClient";
import { jwtDecode } from "jwt-decode";

const getToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("No access token available");
    return null;
  }
  return accessToken;
};

const socketBaseUrl = apiClient.defaults.baseURL.replace("/api/v1", ""); // Extract base URL from apiClient
const token = getToken();
const socket = io(`${socketBaseUrl}?token=${token}`);

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  
  const currentUserName = token ? jwtDecode(token).userName : null;

  useEffect(() => {
    if (!token) {
      console.error("No token available. Cannot initialize socket.");
      return;
    }
    // Initialize socket connection

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("getConversations");
    });

    socket.on("getConversations", (conversations) => {
      setConversations(conversations);
    });

    socket.on("getChats", (chats) => {
      console.log("Chats received:", chats);
      setMessages(chats);
    });

    socket.on("sendMessage", (message) => {
      console.log("New message received:", message.message);
      console.log("New message received:", message.sender_id);

      // Update messages state with the new message in the correct conversation
      setMessages((prevMessages) => {
        // Append the new message to the appropriate conversation's message list
        return [...prevMessages, message]; // Keeps the previous messages and adds the new one
      });

      // Update the last message in the conversation list
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.conversation_id === message.conversation_id
            ? { ...conversation, last_message: message.message } // Update the last message of the conversation
            : conversation
        )
      );
    });

    // Handle updated last message in conversation
    socket.on("updatedLastMessage", (message) => {
      console.log("New message received:", message);
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.conversation_id === message.conversation_id
            ? { ...conversation, last_message: message }
            : conversation
        )
      );
    });

    return () => {
      socket.off("connect");
      socket.off("getConversations");
      socket.off("getChats");
      socket.off("sendMessage");
      socket.off("updatedLastMessage");
    };
  }, []);

  const sendMessage = () => {
    if (messageInput && currentConversation) {
      const payload = {
        sender_id: jwtDecode(token).userName,
        message: messageInput,
        conversation_id: currentConversation.conversation_id,
        created_at: new Date().toISOString(),
      };

      // Emit message to the server
      socket.emit("sendMessage", payload);

      // Clear the input field
      setMessageInput("");
    } else {
      alert("Please enter a message.");
    }
  };

  const fetchChats = (conversationId) => {
    console.log("Here11");
    if (currentConversation?.conversation_id !== conversationId) {
      console.log("Here12");
      socket.emit("getChats", { conversation_id: conversationId });
    }
  };

  return (
    <div className="background-container">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 flex">
        <div className="w-1/3 p-4 bg-gray-100 rounded-lg mr-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          <ul>
            {conversations.map((conversation) => {
              // Determine the other participant in the conversation
              const otherParticipant =
                conversation.sender_id === currentUserName
                  ? conversation.receiver.user_name
                  : conversation.sender.user_name;

              return (
                <li
                  key={conversation.conversation_id}
                  onClick={() => {
                    setCurrentConversation(conversation);
                    fetchChats(conversation.conversation_id);
                  }}
                  className={`cursor-pointer p-2 rounded mb-2 ${currentConversation?.conversation_id ===
                      conversation.conversation_id
                      ? "bg-blue-100"
                      : "hover:bg-gray-200"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    {/* Display the other participant's username */}
                    <strong>{otherParticipant}</strong>
                    {/* Display the last message */}
                    <span className="text-gray-500">
                      {conversation.last_message || "No messages yet"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="w-2/3 p-4 bg-gray-50 rounded-lg">
          {currentConversation ? (
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Conversation with {/* Display the other participant's name */}
                {currentConversation.sender_id === currentUserName
                  ? currentConversation.receiver.user_name
                  : currentConversation.sender.user_name}
              </h3>
              <ul className="mb-4 max-h-72 overflow-y-auto">
                {messages.map((message) => (
                  // Create a unique key using a combination of fields
                  <li
                    key={`${message.chat_id}-${message.createdAt}`}
                    className="mb-2"
                  >
                    {/* Display the sender's name */}
                    <strong>
                      {message.sender_id === currentUserName
                        ? "You"
                        : message.sender_id}
                      :
                    </strong>{" "}
                    {message.message}
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message"
                  className="border p-2 rounded w-4/5"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white p-2 rounded ml-2 w-1/5"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
};

export default Messages;
