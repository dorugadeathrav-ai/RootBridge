# RootBridge

RootBridge is a full-stack e-commerce marketplace that connects local farmers and small producers directly with urban customers. It emphasizes **location-based product discovery** to ensure perishable goods (like fresh vegetables and milk) are sourced locally (within 30 km), while long-shelf-life goods (like honey and spices) are available from anywhere.

## Description
This project was built for a second-year CSE demonstration. It eliminates unnecessary enterprise bloat (e.g., complex microservices, real-time logistics tracking) in favor of a clean, robust, and functional monolithic REST architecture.

## Features
* **Role-Based Authentication (JWT):** Customers, Vendors, and Admins.
* **Location-Based Discovery (30 km rule):** Haversine formula calculation filters fresh products based on the user's geographic location.
* **Vendor Dashboard:** Vendors can manage their catalog, track stock, and update order statuses.
* **Admin Portal:** Secure portal to manage users, products, vendors, and orders.
* **Cart & Checkout Flow:** Prevents overselling stock and correctly decrements quantity upon successful orders.
* **Responsive UI:** Built with React and Tailwind CSS, following a consistent earth-inspired visual identity.

## Technology Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Vite, Lucide React (Icons).
* **Backend:** Node.js, Express.js, TypeScript.
* **Database:** MongoDB (Mongoose ODM).
* **Authentication:** JSON Web Tokens (JWT), bcryptjs.

## User Roles
* **Customer:** Browses the marketplace, manages a cart, places orders, and views order history. Location is used to highlight fresh products nearby.
* **Vendor:** Adds and manages their own products. Fulfills orders. Can specify if products are "Perishable" or "Long Shelf Life".
* **Admin:** Oversees the entire marketplace. Can delete disruptive users, remove inappropriate products, and monitor the order flow.

## Location-Based Product Discovery
A core feature of RootBridge is the 30 km rule:
* **Perishable Products:** Only visible if the customer is within 30 km of the vendor.
* **Long-Shelf-Life Products:** Visible regardless of distance.
The frontend uses the `navigator.geolocation` API to determine the customer's coordinates, and falls back to manual entry if denied. Distances are calculated using the Haversine formula and displayed directly on the product cards.

## Project Structure
```
RootBridge/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # API logic (auth, cart, order, product, user)
│   ├── middleware/      # JWT protection, role checks, error handling
│   ├── models/          # Mongoose schemas (Cart, Category, Order, Product, User)
│   ├── routes/          # Express routing
│   └── server.ts        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components & layouts
    │   ├── context/     # Auth, Cart, and Location global state
    │   ├── pages/       # Page components (admin, customer, seller auth)
    │   ├── utils/       # API wrappers
    │   └── App.tsx      # Routing configuration
    └── package.json
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd RootBridge
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Variables

Create a `.env` file in the `backend/` directory:
```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/rootbridge
JWT_SECRET=your_super_secret_jwt_key
```

## Running the Project

**1. Start MongoDB:** Ensure your local MongoDB server is running (port 27017).

**2. Start Backend:**
```bash
cd backend
npm run dev
```
*The backend will run on `http://localhost:5001`.*

**3. Start Frontend:**
```bash
cd frontend
npm run dev
```
*The frontend will be accessible at `http://localhost:5173`.*

## Important API Endpoints
* **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
* **Products:** `GET /api/products`, `POST /api/products` (Vendor only)
* **Cart:** `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:id`
* **Orders:** `POST /api/orders`, `GET /api/orders` (Customer), `GET /api/orders/vendor` (Vendor), `GET /api/orders/all` (Admin)
* **Admin Users:** `GET /api/users`, `DELETE /api/users/:id`

## Known Limitations / Future Improvements
* **Location Fallback:** While browser geolocation is supported, manual entry (pincode to coordinates) requires an external Geocoding API (e.g., Google Maps, Mapbox) which is not implemented in this MVP.
* **Payment Gateway:** Currently uses a simulated Cash on Delivery / direct purchase flow. Integration with Stripe/Razorpay would be required for production.
* **Image Uploads:** Product images currently rely on external URL inputs. A cloud storage solution (AWS S3 / Cloudinary) would be needed for direct file uploads.
