import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerChat from "../Fragments/CustomerChat";

function Navbar() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex items-center py-5 px-[90px] bg-white font-inter sticky top-0 z-[100] shadow-[0_2px_16px_rgba(205,12,13,0.08)]">
      <div className="font-bold text-[1.5rem] tracking-[1px] text-[#cd0c0d]">
        JKT48 Shop
      </div>
      <div className="flex gap-[3rem] items-center justify-center ml-auto">
        <div className="flex items-center bg-[#f5f5f5] rounded-[6px] px-[10px] ml-10 transition-colors border-2 border-transparent focus-within:border-[#cd0c0d] focus-within:bg-white">
          <input
            className="border-none bg-transparent py-2.5 px-2.5 outline-none text-base w-[220px]"
            type="text"
            placeholder="What are you looking for?"
          />
          <svg
            className="w-6 h-6 cursor-pointer stroke-[#222] fill-none transition-colors hover:stroke-[#e40046]"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <Link
          to="/"
          className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
        >
          Home
        </Link>
        <Link
          to="/checkout"
          className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
        >
          Cek Keranjang
        </Link>
        <Link
          to="/orders"
          className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
        >
          Status Pemesanan
        </Link>
        {/* Jika belum login tampilkan Sign Up, jika sudah login tampilkan avatar dan nama dengan dropdown */}
        {!user ? (
          <Link
            to="/register"
            className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
          >
            Sign Up
          </Link>
        ) : (
          <>
            {/* Chat Button - Only show if user is logged in */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="relative flex items-center justify-center w-10 h-10 bg-[#cd0c0d] text-white rounded-full hover:bg-[#a80a0b] transition-colors"
              title="Live Chat"
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
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 px-3 py-1 bg-[#f5f5f5] rounded-lg focus:outline-none"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <div className="w-8 h-8 rounded-full bg-[#cd0c0d] flex items-center justify-center text-white font-bold text-lg">
                  {user.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-[#222] font-medium text-base max-w-[120px] truncate">
                  {user.full_name || user.email}
                </span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="#222"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#ffeaea] rounded-t-lg"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Setting
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#ffeaea] rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Customer Chat Component */}
      {user && chatOpen && (
        <CustomerChat user={user} onClose={() => setChatOpen(false)} />
      )}
    </nav>
  );
}

export default Navbar;
