import React from "react";
import WishlistSection from "../components/Fragments/WishlistSection";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";

// Dummy data for wishlist and recommendations
const wishlist = [
  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    name: "Gucci duffle bag",
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 65,
    link: "#detail-gucci-bag",
    discount: 35,
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    name: "RGB liquid CPU Cooler",
    price: 1960,
    oldPrice: null,
    rating: 4,
    reviews: 65,
    link: "#detail-cpu-cooler",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    name: "GP11 Shooter USB Gamepad",
    price: 550,
    oldPrice: null,
    rating: 4,
    reviews: 65,
    link: "#detail-gamepad",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    name: "Quilted Satin Jacket",
    price: 750,
    oldPrice: null,
    rating: 4,
    reviews: 65,
    link: "#detail-jacket",
  },
];

const recommendations = [
  {
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    name: "ASUS FHD Gaming Laptop",
    price: 960,
    oldPrice: 1160,
    rating: 5,
    reviews: 65,
    link: "#detail-laptop",
    discount: 35,
  },
  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    name: "IPS LCD Gaming Monitor",
    price: 1160,
    oldPrice: null,
    rating: 5,
    reviews: 65,
    link: "#detail-monitor",
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    name: "HAVIT HV-G92 Gamepad",
    price: 560,
    oldPrice: null,
    rating: 5,
    reviews: 65,
    link: "#detail-havit-gamepad",
    isNew: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    name: "AK-900 Wired Keyboard",
    price: 200,
    oldPrice: null,
    rating: 5,
    reviews: 65,
    link: "#detail-keyboard",
  },
];

function Whistlist() {
  return (
    <>
      <header>
        <Header />
      </header>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <WishlistSection
          title={"Wishlist (4)"}
          products={wishlist}
          showMoveAll={true}
          onMoveAll={() => {}}
        />
        <div className="flex items-center gap-2 mt-8 mb-2">
          <span className="w-2 h-6 bg-[#cd0c0d] rounded mr-2 inline-block"></span>
          <span className="text-lg font-medium text-[#222]">Just For You</span>
        </div>
        <WishlistSection
          title={""}
          products={recommendations}
          showSeeAll={true}
          onSeeAll={() => {}}
        />
      </div>
      <Footer />
    </>
  );
}

export default Whistlist;
