import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Navbar from "../../components/NavBar";
import Disclaimer from "../../components/Disclaimer";
import apiClient from "../../services/apiClient";
import { jwtDecode } from "jwt-decode";
import LandlordNavbar from "../../components/LandlordNavbar";
import { getProfileByUsername } from "../../services/profileServices";

const getToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("No access token available");
    return null;
  }
  return accessToken;
};


const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [receiverUser, setReceiverUser] = useState(null);
  const [receiverUsers, setReceiverUsers] = useState([]);

  const socketBaseUrl = "wss://fulda-student-hub.publicvm.com:8000/socket.io";
  const token = getToken();
  const socket = io(`${socketBaseUrl}?token=${token}`);

  const currentUserName = token ? jwtDecode(token).userName : null;
  const currentUserType = token ? jwtDecode(token).userType : null;

  // Ref to track if a conversation creation is already in progress
  const creatingConversationRef = useRef(false);

  useEffect(() => {
    if (!token) {
      console.error("No token available. Cannot initialize socket.");
      return;
    }
    // Initialize socket connection

    socket.on("connect", () => {
      // console.log("Socket connected:", jwtDecode(token).userType);
      socket.emit("getConversations");
    });

    socket.on("createConversation", (conversation) => {
      setConversations((prevConversations) => {
        const conversationExists = prevConversations.some(
          (conv) => conv.conversation_id === conversation.conversation.conversation_id
        );

        if (!conversationExists) {
          return [...prevConversations, conversation.conversation];
        }

        return prevConversations;
      });

      const receiverId = localStorage.getItem('receiverId');
      if (receiverId && conversation.conversation.receiver_id === receiverId) {
        setCurrentConversation(conversation.conversation);
        fetchChats(conversation.conversation.conversation_id);
        localStorage.removeItem('receiverId');
      }

      creatingConversationRef.current = false;
    });

    socket.on("getConversations", async (fetchedConversations) => {
      setConversations(fetchedConversations);
      const receiverId = localStorage.getItem('receiverId');
      if (receiverId) {
        const existingConversation = fetchedConversations.find(
          (conv) =>
            conv.sender_id === receiverId ||
            conv.receiver_id === receiverId
        );

        if (existingConversation) {
          setCurrentConversation(existingConversation);
          fetchChats(existingConversation.conversation_id);
          localStorage.removeItem('receiverId');
        } else if (!creatingConversationRef.current) {
          creatingConversationRef.current = true;
          socket.emit("createConversation", { receiver_id: receiverId });
        }
      }

      const updatedReceiverUsers = [];
      for (const conversation of fetchedConversations) {
        let data;
        if (conversation.sender_id === currentUserName) {
          data = await getProfileByUsername(conversation.receiver.user_name);
        } else {
          data = await getProfileByUsername(conversation.sender.user_name);
        }
        updatedReceiverUsers.push(data);
      }
      setReceiverUsers(updatedReceiverUsers);
    });

    socket.on("getChats", async (chats) => {
      let data = null;
      if (currentConversation.sender_id === currentUserName) {
        data = await getProfileByUsername(currentConversation.receiver.user_name);
      } else {
        data = await getProfileByUsername(currentConversation.sender.user_name);
      }

      setReceiverUser(data);
      console.log("receiverUser", receiverUsers);
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

    const receiverId = localStorage.getItem('receiverId');
    if (receiverId && !creatingConversationRef.current) {
      creatingConversationRef.current = true;
      socket.emit("createConversation", { receiver_id: receiverId });
    }



    return () => {
      socket.off("connect");
      socket.off("getConversations");
      socket.off("getChats");
      socket.off("sendMessage");
      socket.off("updatedLastMessage");
      socket.off("createConversation");
    };
  }, [currentConversation, receiverUser]);

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
    if (currentConversation?.conversation_id !== conversationId) {
      socket.emit("getChats", { conversation_id: conversationId });
    }
  };

  return (
    <div className="background-container min-h-screen">
      {currentUserType && currentUserType === 'LANDLORD' ? (
        <LandlordNavbar />
      ) : (
        <Navbar />
      )}
      <div className="custom-container max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 flex h-full">
        {/* Left Panel - Conversations */}
        <div className="w-1/3 p-4 bg-gray-100 rounded-lg mr-6 overflow-y-auto flex-grow">
          <h2 className="text-2xl font-semibold mb-4">Conversations</h2>
          <ul>
            {conversations.map((conversation) => {
              const otherParticipant =
                conversation.sender_id === currentUserName
                  ? receiverUsers.find(user => user.user_id === conversation.receiver.user_name)
                  : receiverUsers.find(user => user.user_id === conversation.sender.user_name);
  
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
                    <div className="flex items-center">
                      <strong>{otherParticipant?.first_name} {otherParticipant?.last_name}</strong>
                    </div>
                    <span className="text-gray-500">
                      {conversation.last_message || "No messages yet"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
  
        {/* Middle Panel - Chat Pane */}
        <div className="w-2/3 p-4 bg-gray-50 rounded-lg mr-6 overflow-y-auto flex-grow">
          {currentConversation ? (
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                <span className="mr-2">💬</span>{receiverUser?.first_name} {receiverUser?.last_name}
              </h3>
              <ul className="mb-4 max-h-72 overflow-y-auto">
                {messages.map((message) => (
                  <li
                    key={`${message.chat_id}-${message.createdAt}`}
                    className="mb-2 flex"
                  >
                    <div className={`flex ${message.sender_id === currentUserName ? "ml-auto" : "mr-auto"}`}>
                      <span className={`${message.sender_id === currentUserName ? "bg-gray-300" : "bg-green-300"} p-2 rounded text-sm`}>
                        {message.message}
                      </span>
                    </div>
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
  
        {/* Right Panel - User Profile */}
        <div className="w-1/4 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">User Profile</h3>
          {receiverUser ? (
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                {receiverUser?.profile_picture_id ? (
                  <img
                    src={receiverUser?.profile_picture_id}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-gray-500 text-3xl">👤</span>
                  </div>
                )}
              </div>
              <p className="font-semibold text-lg">{receiverUser?.first_name} {receiverUser?.last_name}</p>
              <p className="text-gray-500">Email: {receiverUser?.email}</p>
              <p className="text-gray-500">Phone: {receiverUser?.phone_number}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No user selected
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
