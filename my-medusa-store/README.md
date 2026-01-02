# My Medusa Store

This project is a Medusa backend setup with PostgreSQL and Stripe configuration.

## Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Ensure the `.env` file contains the correct database URL and Stripe keys.
    ```env
    DATABASE_URL=postgresql://...
    STRIPE_API_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    STORE_CORS=http://localhost:8000,https://docs.medusajs.com
    ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
    AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
    ```

3.  **Start the Server**:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:9000`.

## Admin Panel

The Admin Panel is available at:
[http://localhost:9000/app](http://localhost:9000/app)

**Credentials**:
*   **Email**: `admin@medusa-test.com`
*   **Password**: `supersecret`

## Data Seeding

The database has been seeded with dummy data including:
*   **Products**: T-Shirt, Sweatshirt, Sweatpants, Shorts (with variants).
*   **Shipping Options**: Standard, Express.
*   **Regions**: Europe (EUR).

To re-seed the database (warning: may duplicate data if not cleaned):
```bash
npm run seed
```

## Stripe

The Stripe module is configured in `medusa-config.ts` but is currently commented out or may require specific Medusa v2 configuration adjustments. The environment variables are set for your convenience.
