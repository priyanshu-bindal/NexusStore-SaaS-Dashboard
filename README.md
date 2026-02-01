# NexusStore
> A production-ready, multi-vendor e-commerce platform engineered with Next.js 16, Prisma 7, and PostgreSQL.

NexusStore is a modern, high-performance e-commerce solution designed to handle complex business requirements, from multi-vendor product management to transactional email automation and real-time analytics.

## 🛠 Tech Stack

**Core:**
-   ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat&logo=next.js&logoColor=white) **App Router & Server Actions**
-   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) 
-   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
-   ![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=flat&logo=prisma&logoColor=white)

**UI & Styling:**
-   ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
-   **Shadcn UI** (Component Library)
-   **Lucide React** (Iconography)

**Infrastructure & Services:**
-   **UploadThing** (Scalable File Storage)
-   **Resend** (Transactional Emails)
-   **React Email** (Email Templates)
-   **Recharts** (Data Visualization)

**Authentication:**
-   Custom Auth with **NIST-compliant** password hashing (bcrypt).

---

## ✨ Key Features

### 🏢 Merchant Dashboard
A comprehensive command center for store owners.
-   **Product Management:** Full CRUD capabilities with drag-and-drop image uploading via UploadThing.
-   **Visual Analytics:** Real-time sales trend visualization and KPI tracking using Recharts.
-   **Order Fulfillment:** streamlined workflow to manage orders, update statuses (Shipped/Delivered), and trigger automated notifications.

### 🛍️ Customer Experience
Designed for conversion and usability.
-   **Advanced Search & Filtering:** High-performance filtering system maintaining state via URL search parameters, enabling deep-linking and shareability.
-   **Real-time Ratings:** Dynamic review system aggregating 1-5 star ratings directly from the database using Prisma aggregations.
-   **Secure Checkout:** Robust cart management and checkout flow ensuring data integrity.

### 📍 Address Book System
-   Complete address management (CRUD).
-   **Transaction Safety:** Atomic database transactions ensure "Set as Default" logic correctly toggles flags across multiple records.
-   **Order Snapshots:** Addresses are snapshotted at the time of purchase to preserve historical order accuracy even if user profile data changes.

### 📧 Automated Communications
-   **Transactional Emails:** HTML templates rendered with React Email and sent via Resend.
    -   Order Confirmations
    -   Shipping Updates (with tracking context)
    -   Delivery Notifications

---

## 🧠 Complex Engineering Challenges

### 1. Snapshotting vs. Referencing
**Challenge:** Ensuring that historical orders remain accurate even if a user changes their address or a product price updates.
**Solution:** Implemented **Data Snapshotting** in the Prisma schema (`shippingAddress` JSON field on Order, `price` on OrderItem). This creates an immutable record of the transaction state at the moment of purchase, rather than referencing mutable profile data.

### 2. High-Performance URL State Management
**Challenge:** Creating a filterable product grid (Category, Price, Sort) that is SEO-friendly and shareable.
**Solution:** Avoided local React state for filter data. Instead, utilized `useSearchParams` and `useRouter` to push state to the URL. Server Components then read directly from search params to fetch filtered data, ensuring standard browser navigation (Back/Forward) works out of the box.

### 3. Server-Side Data Aggregation
**Challenge:** Efficiently calculating average product ratings without fetching all reviews to the client.
**Solution:** Leveraged Prisma's `aggregate` API (`_avg`, `_count`) within Server Server Actions. This creates a highly performant summary query that runs at the database level, returning only the necessary metrics to the frontend.

---

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/nexus-store.git
    cd nexus-store
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file and add your credentials:
    ```env
    DATABASE_URL="postgresql://..."
    RESEND_API_KEY="re_..."
    UPLOADTHING_SECRET="..."
    UPLOADTHING_APP_ID="..."
    NEXTAUTH_SECRET="..."
    ```

4.  **Database Migration**
    Push the schema to your database:
    ```bash
    npx prisma db push
    ```

5.  **Run the application**
    ```bash
    npm run dev
    ```

---

## 📄 License
[MIT](LICENSE)

<br/>

> **Disclaimer:** This is a personal portfolio project for educational purposes. It is not affiliated with any existing business named NexusStore.
