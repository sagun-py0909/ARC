# ARC

This is a Next.js ecommerce frontend connected to a Medusa v2 backend.

## Getting Started

### 1. Setup Backend

Navigate to `my-medusa-store` and set up the backend.

```bash
cd my-medusa-store
# Ensure .env has DATABASE_URL and Stripe keys (see my-medusa-store/README.md)
npm install
npm run seed
npm run dev
```

**Important:** Note the `PUBLISHABLE_API_KEY` printed at the end of the seeding script. You will need this for the frontend.

### 2. Setup Frontend

In the root directory:

```bash
npm install
```

Create a `.env.local` file (or update environment variables) with:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_... (key from backend seed)
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the store.
