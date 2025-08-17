import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const CustomerChat = ({ user, onClose }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("Customer connected to socket");
      setIsConnected(true);

      // Join customer room
      newSocket.emit("join_chat", {
        userId: user.user_id,
        role: "customer",
        userName: user.full_name,
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Customer disconnected from socket");
      setIsConnected(false);
    });

    newSocket.on("new_message", (data) => {
      console.log("New message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("message_sent", (data) => {
      console.log("Message sent confirmation:", data);
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("message_error", (data) => {
      console.error("Message error:", data);
      alert("Failed to send message: " + data.error);
    });

    newSocket.on("user_typing", (data) => {
      if (data.senderRole === "admin") {
        setAdminTyping(data.isTyping);
      }
    });

    newSocket.on("admin_status", (data) => {
      setIsAdminOnline(data.isOnline);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Load message history
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [user]);

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    const messageData = {
      message: newMessage.trim(),
      senderId: user.user_id,
      senderRole: "customer",
      recipientId: null, // Broadcast to all admins
    };

    socket.emit("send_message", messageData);
    setNewMessage("");

    // Stop typing indicator
    socket.emit("typing", {
      senderRole: "customer",
      isTyping: false,
    });
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !isConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        senderRole: "customer",
        isTyping: true,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", {
        senderRole: "customer",
        isTyping: false,
      });
    }, 2000);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96 flex flex-col">
        {/* Chat Header */}
        <div className="bg-[#cd0c0d] text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-[#cd0c0d] rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h3 className="font-semibold text-sm">Admin JKT48 Shop</h3>
              <p className="text-xs opacity-90">
                {isAdminOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2">
            <p className="text-yellow-700 text-xs">Mencoba menghubungkan...</p>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm mt-8">
              <p>Belum ada pesan</p>
              <p>Mulai percakapan dengan admin!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender_type === "customer"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender_type === "customer"
                      ? "bg-[#cd0c0d] text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  <p>{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_type === "customer"
                        ? "text-red-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {adminTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border px-3 py-2 rounded-lg rounded-bl-none text-sm">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd0c0d] focus:border-transparent text-sm"
              disabled={!isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="bg-[#cd0c0d] text-white px-4 py-2 rounded-lg hover:bg-[#a80a0b] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
