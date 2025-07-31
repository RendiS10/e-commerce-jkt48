import Header from "../../components/Layouts/Header.jsx";
import HeroSection from "../../components/Fragments/HeroSection.jsx";
import CategoryList from "../../components/Fragments/CategoryList.jsx";
import Footer from "../../components/Layouts/Footer.jsx";

function Home() {
  return (
    <>
      <header>
        <Header />
      </header>
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
