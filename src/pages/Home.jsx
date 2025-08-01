import React from "react";
import Header from "../components/Layouts/Header.jsx";
import Navbar from "../components/Layouts/Navbar.jsx";
import HeroSection from "../components/Fragments/HeroSection.jsx";
import CategoryList from "../components/Fragments/CategoryList.jsx";
import Footer from "../components/Layouts/Footer.jsx";
function Home() {
  return (
    <>
      <header>
        <Header />
      </header>
      <Navbar />
      <main>
        <HeroSection />
        <CategoryList />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Home;
