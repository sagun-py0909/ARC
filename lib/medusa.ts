import Medusa from "@medusajs/js-sdk"

// Initialize Medusa client
// Publishable key should be set in .env.local via NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
// The key is generated when seeding the backend.
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_449b504d2c24e94bcd5fdbb21141279a3d60b676bcb7294b86c24ec5dc82d049"
})
