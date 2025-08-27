import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../main.jsx";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatUsers();
    // Polling untuk update real-time
    const interval = setInterval(fetchChatUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/messages/chat-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setChatUsers(data);
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (customer) => {
    // Navigate ke chat dengan customer ini
    navigate(`/admin/chat?with_user=${customer.user_id}`);
  };

  const filteredUsers = chatUsers.filter(
    (item) =>
      item.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 1 week
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
      });
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading chat users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Chat Messages
          </h1>
          <button
            onClick={() => navigate("/admin/chat")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 12h8M8 8h8M8 16h6M3 20l1.5-1.5A2 2 0 015.5 18H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
            </svg>
            Open Live Chat
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Chat Users List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
              >
                <path d="M8 12h8M8 8h8M8 16h6M3 20l1.5-1.5A2 2 0 015.5 18H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No chat messages
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No customers have sent messages yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((item) => (
                <div
                  key={item.user?.user_id}
                  onClick={() => handleChatClick(item.user)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {item.user?.full_name?.charAt(0)?.toUpperCase() ||
                          item.user?.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.user?.full_name ||
                            item.user?.email ||
                            "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.latestMessage &&
                            formatTime(item.latestMessage.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {item.latestMessage?.message || "No messages yet"}
                        </p>
                        {item.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {item.unreadCount}
                          </span>
                        )}
                      </div>
                      {item.user?.email && (
                        <p className="text-xs text-gray-400">
                          {item.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Chat Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredUsers.length}
              </div>
              <div className="text-sm text-blue-600">Total Conversations</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {filteredUsers.reduce(
                  (sum, item) => sum + (item.unreadCount || 0),
                  0
                )}
              </div>
              <div className="text-sm text-red-600">Unread Messages</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  filteredUsers.filter((item) => {
                    if (!item.latestMessage) return false;
                    const now = new Date();
                    const messageDate = new Date(item.latestMessage.createdAt);
                    return now - messageDate < 24 * 60 * 60 * 1000; // Last 24 hours
                  }).length
                }
              </div>
              <div className="text-sm text-green-600">Active Today</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;
