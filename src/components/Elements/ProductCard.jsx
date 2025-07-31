import React from "react";
import styles from "./ProductCard.module.css";

function ProductCard({
  image,
  name,
  price,
  oldPrice,
  rating,
  reviews,
  onWishlist,
  onView,
  link,
}) {
  return (
    <a
      href={link}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.imgWrap}>
        <img src={image} alt={name} />
        <div className={styles.actions}>
          <button
            className={styles.icon}
            title="Wishlist"
            onClick={(e) => {
              e.preventDefault();
              onWishlist && onWishlist();
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#cd0c0d"
              strokeWidth="2"
            >
              <path d="M10 17s-6-4.35-6-8.5A3.5 3.5 0 0 1 10 5a3.5 3.5 0 0 1 6 3.5C16 12.65 10 17 10 17z" />
            </svg>
          </button>
          <button
            className={styles.icon}
            title="View"
            onClick={(e) => {
              e.preventDefault();
              onView && onView();
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#222"
              strokeWidth="2"
            >
              <circle cx="10" cy="10" r="7" />
              <circle cx="10" cy="10" r="3" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.priceWrap}>
          <span className={styles.price}>${price}</span>
          {oldPrice && <span className={styles.oldPrice}>${oldPrice}</span>}
        </div>
        <div className={styles.ratingWrap}>
          <span className={styles.stars}>
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </span>
          <span className={styles.reviews}>({reviews})</span>
        </div>
      </div>
    </a>
  );
}

export default ProductCard;
