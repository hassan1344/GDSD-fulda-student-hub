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
  const [receiverUsers, setReceiverUsers] = useState([]); // Added back receiverUsers
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const socketRef = useRef(null);
  const token = getToken();
  const currentUserName = token ? jwtDecode(token).userName : null;
  const currentUserType = token ? jwtDecode(token).userType : null;

  // Initialize Socket
  const initializeSocket = () => {
    if (!token) {
      console.error("No token available. Cannot initialize socket.");
      return;
    }

    socketRef.current = io("https://fulda-student-hub.publicvm.com", {
      query: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected.");
      fetchConversations();
    });

    socketRef.current.on("createConversation", (conversation) => {
      setConversations((prev) => [...prev, conversation]);
      if (
        conversation.receiver_id === localStorage.getItem("receiverId") &&
        conversation.conversation_id
      ) {
        setCurrentConversation(conversation);
        fetchChats(conversation.conversation_id);
        localStorage.removeItem("receiverId");
      }
    });

    socketRef.current.on("sendMessage", (message) => {
      if (message.conversation_id === currentConversation?.conversation_id) {
        setMessages((prev) => [...prev, message]);
      }
      updateLastMessageInConversation(message);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  };

  // Fetch Conversations
  const fetchConversations = () => {
    setLoadingConversations(true);
    socketRef.current.emit("getConversations");
    socketRef.current.on("getConversations", async (fetchedConversations) => {
      setLoadingConversations(false);
      setConversations(fetchedConversations);

      const receiverId = localStorage.getItem("receiverId");
      if (receiverId) {
        const existingConversation = fetchedConversations.find(
          (conv) =>
            conv.sender_id === receiverId || conv.receiver_id === receiverId
        );

        if (existingConversation) {
          handleChatClick(existingConversation);
        } else {
          socketRef.current.emit("createConversation", {
            receiver_id: receiverId,
          });
        }
        localStorage.removeItem("receiverId");
      } else {
        // Automatically fetch messages for the first conversation or keep current conversation loaded
        if (currentConversation) {
          fetchChats(currentConversation.conversation_id);
        }
      }

      // **Add the old logic here for setting receiverUsers**
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
      setReceiverUsers(updatedReceiverUsers); // Set receiverUsers
    });
  };

  // Fetch Chats
  const fetchChats = (conversationId) => {
    if (!conversationId || !socketRef.current || !currentConversation) return;

    setLoadingChats(true);
    socketRef.current.emit("getChats", { conversation_id: conversationId });
    socketRef.current.on("getChats", async (chats) => {
      setLoadingChats(false);
      setMessages(chats);

      if (currentConversation) {
        const userName =
          currentConversation.sender_id === currentUserName
            ? currentConversation.receiver?.user_name
            : currentConversation.sender?.user_name;

        if (userName) {
          const profile = await getProfileByUsername(userName);
          setReceiverUser(profile); // **Old logic for setting receiverUser**
        } else {
          console.error("No username found in the current conversation.");
        }
      }
    });
  };

  // console.log("receiverUser", receiverUser);

  // Update Last Message in Conversation
  const updateLastMessageInConversation = (message) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.conversation_id === message.conversation_id
          ? { ...conv, last_message: message.message }
          : conv
      )
    );
  };

  // Handle Chat Click
  const handleChatClick = (conversation) => {
    // console.log("conversation in handle chat click", conversation);
    if (currentConversation?.conversation_id === conversation.conversation_id)
      return;

    setCurrentConversation(conversation);
    fetchChats(conversation.conversation_id);
  };

  // Send Message
  const sendMessage = () => {
    if (!messageInput || !currentConversation) {
      alert("Please enter a message.");
      return;
    }

    const payload = {
      sender_id: currentUserName,
      message: messageInput,
      conversation_id: currentConversation.conversation_id,
      created_at: new Date().toISOString(),
    };

    socketRef.current.emit("sendMessage", payload);
    setMessageInput("");
  };

  // useEffect to Initialize Socket on Token Change
  useEffect(() => {
    initializeSocket();

    // Automatically load current conversation's chats if available after a refresh
    if (currentConversation) {
      fetchChats(currentConversation.conversation_id);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, currentConversation]);

  return (
    <div className="background-container min-h-screen">
      {currentUserType && currentUserType === "LANDLORD" ? (
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
                  ? receiverUsers.find(
                      (user) => user.user_id === conversation.receiver.user_name
                    )
                  : receiverUsers.find(
                      (user) => user.user_id === conversation.sender.user_name
                    );

              return (
                <li
                  key={conversation.conversation_id}
                  onClick={() => handleChatClick(conversation)}
                  className={`cursor-pointer p-2 rounded mb-2 ${
                    currentConversation?.conversation_id ===
                    conversation.conversation_id
                      ? "bg-blue-100"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <strong>
                        {otherParticipant?.first_name}{" "}
                        {otherParticipant?.last_name}
                      </strong>
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
                <span className="mr-2">💬</span>
                {receiverUser?.first_name} {receiverUser?.last_name}
              </h3>
              <ul className="mb-4 max-h-72 overflow-y-auto">
                {messages.map((message) => (
                  <li
                    key={`${message.chat_id}-${message.createdAt}`}
                    className="mb-2 flex"
                  >
                    <div
                      className={`flex ${
                        message.sender_id === currentUserName
                          ? "ml-auto"
                          : "mr-auto"
                      }`}
                    >
                      <span
                        className={`${
                          message.sender_id === currentUserName
                            ? "bg-gray-300"
                            : "bg-green-300"
                        } p-2 rounded text-sm`}
                      >
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
              <p className="font-semibold text-lg">
                {receiverUser?.first_name} {receiverUser?.last_name}
              </p>
              <p className="text-gray-500">Email: {receiverUser?.email}</p>
              <p className="text-gray-500">
                Phone: {receiverUser?.phone_number}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">No user selected</div>
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
