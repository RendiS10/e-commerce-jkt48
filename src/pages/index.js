// Main Pages Index - Export all page categories
// Authentication
export * as Auth from "./auth";

// Shop/Shopping
export * as Shop from "./shop";

// Checkout Process
export * as CheckoutPages from "./checkout";

// User Account
export * as Account from "./account";

// Common Pages
export * as Common from "./common";

// Admin Panel
export * as Admin from "./admin";

// Backward compatibility - direct exports for common imports
export { Login, Register } from "./auth";
export { Home, ProductDetail } from "./shop";
export {
  Checkout as CheckoutPage,
  CheckoutDetail,
  Payment,
  PaymentNew,
} from "./checkout";
export { Profile, Orders } from "./account";
export { Error } from "./common";
