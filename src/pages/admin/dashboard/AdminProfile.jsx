import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner.jsx";
import Swal from "sweetalert2";

const initialProfile = {
  full_name: "",
  email: "",
  phone_number: "",
  address: "",
  city: "",
  postal_code: "",
};

const AdminProfile = () => {
  const [user, setUser] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Gagal mengambil data profile");
      const userData = await response.json();
      setUser({
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        address: userData.address || "",
        city: userData.city || "",
        postal_code: userData.postal_code || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui profile");
      }
      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      Swal.fire({
        icon: "success",
        title: "Profile Berhasil Diperbarui!",
        text: "Informasi profile Anda telah berhasil disimpan.",
        confirmButtonText: "OK",
        confirmButtonColor: "#cd0c0d",
        timer: 2000,
        timerProgressBar: true,
      });
      setSuccess("Profile berhasil diperbarui!");
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui Profile!",
        text: err.message || "Terjadi kesalahan saat menyimpan perubahan.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner message="Memuat profile admin..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Edit Profile Admin
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="full_name"
              value={user.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd0c0d] ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled={true}
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed"
              placeholder="Email"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email tidak dapat diubah
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone_number"
              value={user.phone_number}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd0c0d] ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="Contoh: 08123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kota
            </label>
            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd0c0d] ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="Contoh: Jakarta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kode Pos
            </label>
            <input
              type="text"
              name="postal_code"
              value={user.postal_code}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd0c0d] ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="Contoh: 12345"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Lengkap
          </label>
          <textarea
            name="address"
            value={user.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows="4"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd0c0d] ${
              isEditing
                ? "border-gray-300 bg-white"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="Masukkan alamat lengkap untuk pengiriman"
          />
        </div>
        {isEditing ? (
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={updating}
              className="bg-[#cd0c0d] text-white px-6 py-2 rounded-lg hover:bg-[#b00a0a] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
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
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Simpan Perubahan
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={updating}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-[#cd0c0d] text-white px-4 py-2 rounded-lg hover:bg-[#b00a0a] transition flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminProfile;
