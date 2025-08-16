import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../main.jsx";
import AdminLayout from "../../components/admin/AdminLayout.jsx";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    sender_id: "",
    receiver_id: "",
    message_text: "",
    is_read: false,
  });
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
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
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const url = editingMessage
        ? `http://localhost:5000/api/messages/${editingMessage.message_id}`
        : "http://localhost:5000/api/messages";

      const response = await fetch(url, {
        method: editingMessage ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMessages();
        setShowForm(false);
        setEditingMessage(null);
        setFormData({
          sender_id: "",
          receiver_id: "",
          message_text: "",
          is_read: false,
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setFormData({
      sender_id: message.sender_id,
      receiver_id: message.receiver_id,
      message_text: message.message_text,
      is_read: message.is_read,
    });
    setShowForm(true);
  };

  const handleDelete = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const markAsRead = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_read: true }),
        }
      );

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading messages...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Messages Management
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingMessage(null);
              setFormData({
                sender_id: "",
                receiver_id: "",
                message_text: "",
                is_read: false,
              });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Send New Message
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingMessage ? "Edit Message" : "Send New Message"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender
                  </label>
                  <select
                    value={formData.sender_id}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Sender</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver
                  </label>
                  <select
                    value={formData.receiver_id}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Receiver</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={formData.message_text}
                    onChange={(e) =>
                      setFormData({ ...formData, message_text: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    required
                    placeholder="Type your message here..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_read"
                    checked={formData.is_read}
                    onChange={(e) =>
                      setFormData({ ...formData, is_read: e.target.checked })
                    }
                    className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <label
                    htmlFor="is_read"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as Read
                  </label>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    {editingMessage ? "Update" : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message) => (
                <tr
                  key={message.message_id}
                  className={message.is_read ? "" : "bg-blue-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {message.Sender?.full_name || "N/A"}
                      </div>
                      <div className="text-gray-500">
                        {message.Sender?.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {message.Receiver?.full_name || "N/A"}
                      </div>
                      <div className="text-gray-500">
                        {message.Receiver?.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate">{message.message_text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        message.is_read
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {message.is_read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(message.sent_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {!message.is_read && (
                      <button
                        onClick={() => markAsRead(message.message_id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(message)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(message.message_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {messages.filter((m) => !m.is_read).length > 0 && (
            <div className="bg-blue-50 px-6 py-3 border-t">
              <p className="text-sm text-blue-700">
                You have {messages.filter((m) => !m.is_read).length} unread
                message(s)
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;
