// Admin Pages - Organized by Domain
// Authentication
export * as Auth from "./auth";

// Dashboard & Analytics
export * as Dashboard from "./dashboard";

// Product Management
export * as Products from "./products";

// Sales Management
export * as Sales from "./sales";

// User Management
export * as Users from "./users";

// Content Management
export * as Content from "./content";

// Communication
export * as Communication from "./communication";

// Backward compatibility - direct exports
export { AdminLogin } from "./auth";
export { Dashboard as AdminDashboard, DashboardFixed } from "./dashboard";
export {
  Products as AdminProducts,
  Categories,
  ProductImages,
  ProductVariants,
} from "./products";
export { Orders as AdminOrders, Payments, Transactions } from "./sales";
export { Users as AdminUsers, Reviews, Complaints } from "./users";
export { NewsProduct } from "./content";
export { Chat as AdminChat, Messages } from "./communication";
