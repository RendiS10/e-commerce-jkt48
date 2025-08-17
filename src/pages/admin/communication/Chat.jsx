import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../../main.jsx";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const AdminChat = () => {
  const { user } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCustomers, setOnlineCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  // Get with_user from URL params
  const withUserId = searchParams.get("with_user");

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Admin connected to chat server");
      setIsConnected(true);

      // Join admin room
      newSocket.emit("join_chat", {
        userId: user.user_id,
        userRole: "admin",
        userName: user.full_name,
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Admin disconnected from chat server");
      setIsConnected(false);
    });

    newSocket.on("online_customers", (customers) => {
      setOnlineCustomers(customers);
    });

    newSocket.on("customer_online", (customer) => {
      setOnlineCustomers((prev) => [...prev, customer]);
    });

    newSocket.on("customer_offline", (customer) => {
      setOnlineCustomers((prev) =>
        prev.filter((c) => c.userId !== customer.userId)
      );
    });

    newSocket.on("new_message", (messageData) => {
      // Only add to messages if it's for the selected customer or it's a broadcast
      if (
        !selectedCustomer ||
        messageData.sender_id === selectedCustomer.user_id ||
        messageData.recipient_id === selectedCustomer.user_id ||
        !messageData.recipient_id
      ) {
        setMessages((prev) => [...prev, messageData]);
      }
    });

    newSocket.on("message_sent", (messageData) => {
      console.log("Message sent successfully:", messageData);
      // Add the sent message to messages immediately
      setMessages((prev) => [...prev, messageData]);
    });

    newSocket.on("user_typing", ({ userId, userName, isTyping }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(`${userId}:${userName}`);
        } else {
          newSet.delete(`${userId}:${userName}`);
        }
        return newSet;
      });
    });

    newSocket.on("message_error", ({ error }) => {
      console.error("Message error:", error);
      alert("Failed to send message: " + error);
    });

    newSocket.on("session_ended", (data) => {
      console.log("Session ended:", data);
      setMessages([]);
      setIsEndingSession(false);
      setShowEndSessionConfirm(false);
      alert(
        `Chat session ended successfully. ${data.deletedMessages} messages deleted.`
      );
      // Refresh chat users list
      window.location.reload();
    });

    newSocket.on("session_error", ({ error }) => {
      console.error("Session error:", error);
      setIsEndingSession(false);
      alert("Failed to end session: " + error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, selectedCustomer]);

  // Load chat users (customers who have sent messages)
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadChatUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/messages/chat-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setChatUsers(data);

          // Auto-select customer from URL parameter
          if (withUserId && data.length > 0) {
            const targetCustomer = data.find(
              (item) => item.user && item.user.user_id == withUserId
            );
            if (targetCustomer) {
              setSelectedCustomer(targetCustomer.user);
            }
          }
        }
      } catch (error) {
        console.error("Error loading chat users:", error);
      }
    };

    loadChatUsers();
  }, [user, withUserId]);

  // Load messages for selected customer
  useEffect(() => {
    if (!user || !selectedCustomer) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/messages?with_user=${selectedCustomer.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [user, selectedCustomer]);

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected || !selectedCustomer)
      return;

    const messageData = {
      message: newMessage.trim(),
      senderId: user.user_id,
      senderRole: "admin",
      recipientId: selectedCustomer.user_id,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  // Handle end chat session
  const handleEndSession = () => {
    if (!selectedCustomer) return;
    setShowEndSessionConfirm(true);
  };

  const confirmEndSession = () => {
    if (!socket || !isConnected || !selectedCustomer) return;

    setIsEndingSession(true);
    socket.emit("end_chat_session", {
      customerId: selectedCustomer.user_id,
    });
  };

  const cancelEndSession = () => {
    setShowEndSessionConfirm(false);
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !isConnected || !selectedCustomer) return;

    socket.emit("typing", {
      recipientId: selectedCustomer.user_id,
      senderRole: "admin",
      isTyping: e.target.value.length > 0,
    });
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setMessages([]);
  };

  if (!user || user.role !== "admin") {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <AdminLayout>
      <div className="h-full flex">
        {/* Customer List Sidebar */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Customer Chat</h2>
            <div className="flex items-center text-sm text-gray-500">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {/* Online Customers */}
          {onlineCustomers.length > 0 && (
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-green-600 mb-2">
                Online Now
              </h3>
              {onlineCustomers.map((customer) => (
                <div
                  key={customer.socketId}
                  onClick={() =>
                    handleSelectCustomer({
                      user_id: customer.userId,
                      full_name: customer.userName,
                    })
                  }
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedCustomer?.user_id === customer.userId
                      ? "bg-purple-100"
                      : ""
                  }`}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm">{customer.userName}</span>
                  {typingUsers.has(
                    `${customer.userId}:${customer.userName}`
                  ) && (
                    <span className="ml-auto text-xs text-gray-500">
                      typing...
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Previous Chat Users */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Previous Chats
            </h3>
            {chatUsers.length === 0 ? (
              <div className="text-sm text-gray-500">No chat history</div>
            ) : (
              chatUsers.map((chatUser) => (
                <div
                  key={chatUser.user.user_id}
                  onClick={() => handleSelectCustomer(chatUser.user)}
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedCustomer?.user_id === chatUser.user.user_id
                      ? "bg-purple-100"
                      : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      {chatUser.user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {chatUser.user.full_name}
                    </div>
                    {chatUser.latestMessage && (
                      <div className="text-xs text-gray-500 truncate">
                        {chatUser.latestMessage.message}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedCustomer ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    {selectedCustomer.full_name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {onlineCustomers.find(
                      (c) => c.userId === selectedCustomer.user_id
                    )
                      ? "Online"
                      : "Offline"}
                  </div>
                </div>

                {/* End Session Button */}
                <button
                  onClick={handleEndSession}
                  disabled={isEndingSession}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isEndingSession ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Mengakhiri...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Akhiri Sesi
                    </>
                  )}
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`flex mb-4 ${
                        message.sender_id === user.user_id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender_id === user.user_id
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-800 border"
                        }`}
                      >
                        {message.sender_id !== user.user_id && (
                          <div className="text-xs font-semibold mb-1 text-gray-600">
                            {message.sender_name ||
                              message.Sender?.full_name ||
                              selectedCustomer.full_name}
                          </div>
                        )}
                        <div>{message.message}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender_id === user.user_id
                              ? "text-purple-200"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(
                            message.created_at ||
                              message.createdAt ||
                              new Date()
                          ).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!isConnected}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
                {!isConnected && (
                  <div className="text-sm text-red-500 mt-2">
                    Not connected to chat server
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="text-lg font-medium mb-2">
                  Select a customer to start chatting
                </h3>
                <p className="text-sm">
                  Choose a customer from the list to view conversation history
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* End Session Confirmation Modal */}
      {showEndSessionConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Akhiri Sesi Chat
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Apakah Anda yakin ingin mengakhiri sesi chat dengan{" "}
                <span className="font-semibold">
                  {selectedCustomer?.full_name}
                </span>
                ?
              </p>
              <p className="text-red-600 text-sm mt-2">
                ⚠️ Semua riwayat chat akan dihapus dan tidak dapat dikembalikan!
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={cancelEndSession}
                disabled={isEndingSession}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={confirmEndSession}
                disabled={isEndingSession}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEndingSession ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Mengakhiri...
                  </>
                ) : (
                  "Ya, Akhiri Sesi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminChat;
