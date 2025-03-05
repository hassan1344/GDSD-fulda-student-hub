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


  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length <= maxLength 
      ? text 
      : text.slice(0, maxLength) + '...';
  };

  // Initialize Socket
  const initializeSocket = () => {
    if (!token) {
      console.error("No token available. Cannot initialize socket.");
      return;
    }

      socketRef.current = io(process.env.REACT_APP_SOCKET_BASE_URL, {
      query: {
        token,
        endpoint: process.env.REACT_APP_SOCKET_CHAT_ENDPOINT,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected.");
      fetchConversations();
    });

    socketRef.current.on("createConversation", (conversation) => {
      if (!conversation) {
        console.error("Failed to create or receive conversation.");
        return;
      }
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
      fetchConversations();
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
      // Filter out empty conversations
      const validConversations = fetchedConversations.filter(
        (convo) => convo.last_message && convo.last_message.length > 0
      );
      setConversations(validConversations);

      setLoadingConversations(false);

      const receiverId = localStorage.getItem("receiverId");
      if (receiverId) {
        const existingConversation = fetchedConversations.find(
          (conv) =>
            conv.sender_id === receiverId || conv.receiver_id === receiverId
        );

        console.log("Existing conversation:", existingConversation);

        if (existingConversation) {
          handleChatClick(existingConversation);
          localStorage.removeItem("receiverId");
        } else {
          socketRef.current.emit("createConversation", {
            receiver_id: receiverId,
          });
        }
        // localStorage.removeItem("receiverId");
      } else {
        // Automatically fetch messages for the first conversation or keep current conversation loaded
        if (currentConversation) {
          fetchChats(currentConversation.conversation_id);
        }
      }

      // **Add the old logic here for setting receiverUsers**
      try {
        // Extract unique user names from conversations
        const userNames = [
          ...new Set(
            fetchedConversations
              .map((conversation) => conversation.user?.user_name)
              .filter(Boolean) // Remove null/undefined values
          ),
        ];
      
        if (userNames.length === 0) {
          console.warn("No valid users found in conversations.");
          return;
        }
      
        console.log("User names:", userNames);

        // Fetch all user profiles in parallel
        const profiles = await Promise.all(userNames.map(getProfileByUsername));
      
        // Update state using functional update to ensure latest state is used
        setReceiverUsers((prevUsers) => {
          const updatedUsers = profiles.filter(Boolean); // Remove null profiles
          return updatedUsers;
        });
      
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
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
          if (profile != null) {
            // Update: Added a null check for profile and setting empty user to not occur any runtime errors
            setReceiverUser(profile);
          } else {
            setReceiverUser(null);
          }
        } else {
          console.error("No username found in the current conversation.");
        }
      }
    });
  };

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

    // Input sanitization
    let sanitizedMessage = messageInput.trim(); // Remove leading/trailing spaces

    // Prevent empty or excessively long messages
    if (sanitizedMessage.length === 0) {
      alert("Message cannot be empty.");
      return;
    }
    if (sanitizedMessage.length > 100) {
      alert("Message is too long. Limit is 100 characters.");
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

    // Add overflow hidden to body when component mounts
    document.body.style.overflow = 'hidden';

    return () => {
      socketRef.current?.disconnect();
      document.body.style.overflow = 'visible';
    };
  }, [token, currentConversation]);

  // Handle Key Press for Enter to Send Message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="background-container overflow-hidden">
      {currentUserType && currentUserType === "LANDLORD" ? (
        <LandlordNavbar />
      ) : (
        <Navbar />
      )}
      <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-100 via-green-50 to-white overflow-hidden">
      <div className="w-[1200px] p-0 bg-white shadow-lg rounded-lg mt-8 flex h-[600px] overflow-hidden"> 
      {/* Left Panel - Conversations */}
      <div className="w-[350px] p-0 bg-gray-100 rounded-l-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Conversations</h2>
          <div className="h-[540px] overflow-y-auto pr-2">
            <ul>
              {conversations.map((conversation) => {
                const otherParticipant =
                conversation.sender_id === currentUserName
                  ? receiverUsers.find(
                      (user) =>
                        user.user_id === conversation.receiver?.user_name
                    )
                  : receiverUsers.find(
                      (user) => user.user_id === conversation.sender?.user_name
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
                    <div className="justify-between items-center">
                      <div className="flex items-center">
                        <strong>
                          {otherParticipant?.first_name}{" "}
                          {otherParticipant?.last_name}
                        </strong>
                      </div>
                      <div className="text-gray-500">
                       { truncateText(conversation.last_message || "No messages yet", 25) }
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Middle Panel - Chat Pane */}
      <div className="w-[600px] p-0 bg-gray-50 overflow-hidden">
        <div className="p-4">
          {currentConversation ? (
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                <span className="mr-2">💬</span>
                {receiverUser?.first_name} {receiverUser?.last_name}
              </h3>
              <div className="h-[400px] overflow-y-auto pr-2 mb-4">
                <ul>
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
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message"
                  className="border p-2 rounded w-[480px]"
                  onKeyDown={handleKeyPress}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white p-2 rounded ml-2 w-[100px]"
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

      {/* Right Panel - User Profile */}
      <div className="w-[250px] p-0 bg-gray-200 rounded-r-lg overflow-hidden">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">User Profile</h3>
          {receiverUser ? (
            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-gray-500 text-3xl">👤</span>
                </div>
              </div>
              <p className="font-semibold text-lg text-center">
                {receiverUser?.first_name} {receiverUser?.last_name}
              </p>
              <p className="text-gray-500 text-center">Email: {receiverUser?.email}</p>
              <p className="text-gray-500 text-center">
                Phone: {receiverUser?.phone_number}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">No user selected</div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Messages;
