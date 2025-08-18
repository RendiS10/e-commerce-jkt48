import React from "react";
import Header from "../../components/Layouts/Header.jsx";
import Navbar from "../../components/Layouts/Navbar.jsx";
import HeroSection from "../../components/Fragments/HeroSection.jsx";
import CategoryList from "../../components/Fragments/CategoryList.jsx";
import SearchResults from "../../components/Fragments/SearchResults.jsx";
import Footer from "../../components/Layouts/Footer.jsx";
import { useProductSearch } from "../../hooks/useProductSearch.js";

function Home() {
  const {
    searchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchError,
    handleSearchInputChange,
    handleSearchSubmit,
    clearSearch,
    performSearch,
  } = useProductSearch();

  // Handle search retry
  const handleSearchRetry = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <Navbar
        onSearch={handleSearchSubmit}
        searchQuery={searchQuery}
        onSearchChange={handleSearchInputChange}
      />
      <main>
        {/* Show search results if user has searched */}
        {hasSearched ? (
          <SearchResults
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            hasSearched={hasSearched}
            searchError={searchError}
            onRetry={handleSearchRetry}
          />
        ) : (
          /* Show default home content when no search */
          <>
            <HeroSection />
            <CategoryList />
          </>
        )}

        {/* Add clear search button if search is active */}
        {hasSearched && (
          <div className="max-w-6xl mx-auto px-4 pb-8">
            <button
              onClick={() => {
                clearSearch();
                handleSearchInputChange("");
              }}
              className="bg-[#cd0c0d] text-white px-6 py-2 rounded hover:bg-[#a80a0b] transition-colors"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        )}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Home;
