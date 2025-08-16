import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../main.jsx";
import AdminLayout from "../../components/admin/AdminLayout.jsx";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    order_id: "",
    subject: "",
    description: "",
    complaint_status: "open",
  });
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchComplaints();
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
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
        setUsers(data.filter((u) => u.role === "customer"));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const url = editingComplaint
        ? `http://localhost:5000/api/complaints/${editingComplaint.complaint_id}`
        : "http://localhost:5000/api/complaints";

      const response = await fetch(url, {
        method: editingComplaint ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchComplaints();
        setShowForm(false);
        setEditingComplaint(null);
        setFormData({
          user_id: "",
          order_id: "",
          subject: "",
          description: "",
          complaint_status: "open",
        });
      }
    } catch (error) {
      console.error("Error saving complaint:", error);
    }
  };

  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    setFormData({
      user_id: complaint.user_id,
      order_id: complaint.order_id || "",
      subject: complaint.subject,
      description: complaint.description,
      complaint_status: complaint.complaint_status,
    });
    setShowForm(true);
  };

  const handleDelete = async (complaintId) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${complaintId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchComplaints();
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { bg: "bg-red-100", text: "text-red-800", label: "Open" },
      in_progress: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "In Progress",
      },
      resolved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Resolved",
      },
      closed: { bg: "bg-gray-100", text: "text-gray-800", label: "Closed" },
    };

    const config = statusConfig[status] || statusConfig.open;
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading complaints...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complaints Management
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingComplaint(null);
              setFormData({
                user_id: "",
                order_id: "",
                subject: "",
                description: "",
                complaint_status: "open",
              });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Add New Complaint
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingComplaint ? "Edit Complaint" : "Add New Complaint"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <select
                    value={formData.user_id}
                    onChange={(e) =>
                      setFormData({ ...formData, user_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Customer</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Order (Optional)
                  </label>
                  <select
                    value={formData.order_id}
                    onChange={(e) =>
                      setFormData({ ...formData, order_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">No related order</option>
                    {orders.map((order) => (
                      <option key={order.order_id} value={order.order_id}>
                        Order #{order.order_id} - Rp{" "}
                        {parseFloat(order.total_amount).toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    required
                    placeholder="Detailed description of the complaint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.complaint_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complaint_status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    {editingComplaint ? "Update" : "Create"}
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <tr key={complaint.complaint_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{complaint.complaint_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {complaint.User?.full_name || "N/A"}
                      </div>
                      <div className="text-gray-500">
                        {complaint.User?.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="font-medium">{complaint.subject}</div>
                    <div className="text-gray-500 truncate">
                      {complaint.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(complaint.complaint_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(complaint)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(complaint.complaint_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Complaints;
