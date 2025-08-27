import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    // Find user for display information
    const user = users.find((u) => u.user_id === userId);

    // Prevent deleting admin users
    if (user?.role === "admin") {
      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Menghapus",
        text: "User dengan role admin tidak dapat dihapus untuk keamanan sistem.",
        confirmButtonText: "OK",
        confirmButtonColor: "#cd0c0d",
      });
      return;
    }

    // SweetAlert konfirmasi sebelum hapus user
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus User",
      text: "Apakah Anda yakin ingin menghapus user ini?",
      html: `
        <div class="text-center">
          <p><strong>Nama:</strong> ${user?.full_name || "Unknown"}</p>
          <p><strong>Email:</strong> ${user?.email || "Unknown"}</p>
          <p><strong>Role:</strong> ${user?.role || "user"}</p>
          <p><strong>Status:</strong> ${
            user?.status === "active" ? "Aktif" : "Tidak Aktif"
          }</p>
          <p><strong>Terdaftar:</strong> ${formatDate(
            user?.created_at || user?.createdAt
          )}</p>
          <p class="text-sm text-red-600 mt-3 font-medium">
            ⚠️ PERINGATAN: Tindakan ini tidak dapat dibatalkan!
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Semua data user termasuk pesanan, review, dan riwayat akan ikut terhapus.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus User",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://e-commerce-jkt48-prototype-production.up.railway.app/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // SweetAlert sukses user dihapus
        await Swal.fire({
          icon: "success",
          title: "User Berhasil Dihapus!",
          text: "User telah berhasil dihapus dari sistem beserta semua data terkait.",
          confirmButtonText: "OK",
          confirmButtonColor: "#cd0c0d",
        });

        fetchUsers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);

      // SweetAlert error hapus user
      Swal.fire({
        icon: "error",
        title: "Gagal Hapus User",
        text:
          error.message ||
          "Terjadi kesalahan saat menghapus user. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <div className="text-sm text-gray-500">
            Total Users: {users.length}
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-600">Admin Users</h3>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter((user) => user.role === "admin").length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
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
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {user.full_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at || user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.role !== "admin" ? (
                        <button
                          onClick={() => deleteUser(user.user_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Admin - Tidak dapat dihapus
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;
