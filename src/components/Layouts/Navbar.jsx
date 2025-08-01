import React from "react";

function Navbar() {
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
        <a
          href="/"
          className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
        >
          Home
        </a>
        <a
          href="#"
          className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
        >
          Cek Keranjang
        </a>
        <a
          href="#"
          className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
        >
          Status Pemesanan
        </a>
        <a
          href="/register"
          className="text-[#cd0c0d] no-underline text-base relative pb-[2px] transition-colors after:content-[''] after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#cd0c0d] after:transition-all after:duration-500 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:-translate-x-1/2 hover:after:w-full hover:after:left-1/2 hover:after:-translate-x-1/2 font-normal"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
