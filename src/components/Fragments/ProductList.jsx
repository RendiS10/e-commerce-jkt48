import React from "react";
import ProductCard from "../Elements/ProductCard";
import styles from "./ProductList.module.css";

const products = [
  {
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    name: "The north coat",
    price: 260,
    oldPrice: 360,
    rating: 5,
    reviews: 85,
    link: "#detail-north-coat",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    name: "Gucci duffle bag",
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 65,
    link: "#detail-gucci-bag",
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    name: "RGB liquid CPU Cooler",
    price: 160,
    oldPrice: 170,
    rating: 4,
    reviews: 65,
    link: "#detail-cpu-cooler",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    name: "Small BookSelf",
    price: 360,
    oldPrice: null,
    rating: 4,
    reviews: 65,
    link: "#detail-bookshelf",
  },
];

function ProductList() {
  return (
    <div className={styles.list}>
      {products.map((p, idx) => (
        <ProductCard
          key={p.name}
          image={p.image}
          name={p.name}
          price={p.price}
          oldPrice={p.oldPrice}
          rating={p.rating}
          reviews={p.reviews}
          link={p.link}
        />
      ))}
    </div>
  );
}

export default ProductList;
