# Project NEO 5 - E-Commerce Website

## **Project Scope and Requirements**

### **Objective**

The goal of **Project NEO 5** is to build a scalable and user-friendly e-commerce website for selling various products. The site will be accessible globally, allowing users to browse freely without requiring an account. Account creation will be mandatory for interactions such as adding items to the cart, making purchases, and accessing payment options.

---

### **Key Features**

#### **User Features**

1. **Browse Products**:
   - Users can explore products without creating an account.
2. **Account Creation**:
   - Required for cart interactions, payments, and profile updates.
3. **Shopping Cart**:
   - Add/remove/update items (quantity, color, etc.).
   - Real-time price updates.
4. **Payment Gateway**:
   - Secure payments via **Stripe**.
5. **Account Management**:
   - Update profile details (e.g., language preference, dark/light mode toggle).
6. **Favorites Tab**:
   - Save products for later viewing.
7. **Comments/Reviews**:
   - Leave comments on products (subject to admin approval).

#### **Admin Features**

1. **Admin Dashboard**:
   - Access to the following tabs:
     - **Statistics**: View sales, user engagement, and other metrics.
     - **Product List**: Display all products with CRUD (Create, Read, Update, Delete) functionality.
     - **Add Product**: Add new products to the catalog.
     - **Update Product**: Modify existing product details.
     - **User List**: Manage users (grant/deny access, remove users).
     - **Comment List**: Approve/deny or remove user comments.
2. **Role-Based Access Control (RBAC)**:
   - Two initial roles: **Admin** and **User**.
   - Admins have top-level privileges for managing the site.

---

### **Additional Features**

1. **F.O.M.O (Fear of Missing Out) Section**:
   - Timed offers displayed on the Hero Page.
   - Maximum of 5 products per category.
   - Slider functionality (auto or clickable, TBD).
2. **Multiple Product Categories**:
   - Displayed below the main product list.
3. **Complex Cart**:
   - Advanced functionality for quantity adjustments, color/size selection, and real-time updates.
4. **Static Pages**:
   - **About Us**: Information about the company.
   - **Contact Us**: Contact form or details for customer support.
   - **News/Blog**: Updates, promotions, or articles.

---

### **Target Audience**

- **Primary Audience**: Anyone visiting the site is a potential customer.
- **Design Focus**:
  - Intuitive and easy-to-navigate interface.
  - Encourage visitors to create accounts and make purchases.
- **Admin Focus**:
  - Provide top-level privileges for efficient site management.

---

### **Success Metrics**

1. **User Engagement**:
   - Track visits (hourly, daily, monthly).
   - Monitor cart abandonment rates.
   - Measure conversion rates (visitors to buyers).
2. **Sales Performance**:
   - Track total sales revenue.
   - Monitor average order value (AOV).
3. **Customer Satisfaction**:
   - Collect feedback through reviews and ratings.
   - Monitor return/refund rates.
4. **Admin Efficiency**:
   - Measure time taken to perform CRUD operations.
   - Track response times for comment approvals/removals.

---

### **Technical Stack**

- **Frontend**: React.js, TailwindCSS 4.0.
- **Backend**: Node.js with Express.
- **Database**: MongoDB (with potential for additional databases).
- **Payment Gateway**: Stripe.
- **Deployment**: Netlify/Vercel (frontend), Render/Heroku (backend), MongoDB Atlas (database).
- **Version Control**: GitHub (monorepo structure).

---

### **Deliverables for Step 1**

1. **Project Charter**:
   - High-level document outlining objectives, scope, and success metrics.
2. **Feature List**:
   - Prioritized list of must-have and nice-to-have features.
3. **User Stories**:
   - Descriptions of how users will interact with the system.
4. **Wireframes**:
   - Low-fidelity sketches of key pages (homepage, product page, cart, checkout, admin dashboard).
5. **Risk Assessment**:
   - Identification of potential risks and mitigation strategies.
6. **Success Metrics Plan**:
   - Detailed plan for measuring project success.

---

### **Next Steps**

1. Finalize wireframes and design prototypes using **Figma**.
2. Set up the development environment (frontend, backend, database).
3. Begin backend development with a focus on API creation and database integration.

---

# Development Environment Setup

This document outlines the steps taken to set up the development environment for **Project NEO 5**, an e-commerce website built with React.js (frontend), Node.js with Express (backend), and MongoDB (database). The project follows a **monorepo structure** and uses modern tools like **Vite**, **TailwindCSS**, and **TypeScript**.

---

## **Step 1: Choose a Package Manager**

We use **pnpm** for faster and more efficient dependency management.

## **Step 2: Set Up the Monorepo Structure**

The project follows a **monorepo** structure to manage both the frontend and backend in a single repository.

## **Step 3: Set Up the Frontend (React.js)**

The frontend is built using **ReactJS** with **VIte** and **TailwindCSS**.

## **Step 4: Set Up the Backend (Node.js with Express)**

The backend is built using **NodeJS** with **Express** and **Javascript**.

## **Step 5: Set Up the MongoDB**

The database is hosted on **MongoDB Atlas**

## **Step 6: Step 6: Set Up Environment Variables**

Use **dotEnv** to manage environment variables

## **Step 7: Set Up Git Ignore**

Add a .gitignore file in the root of the monorepo to exclude unnecessary files from version control.

## **Step 8: Run the Projects**

Run projects **separately** on different ports for **FRONTEND** and **BACKEND**

---

<!-- # Design the UI/UX -->

# Build the Backend

**RESTful APIs**:

Functional APIs for core features (e.g., products, users, orders).

**Database Integration**:

MongoDB connected with schemas and CRUD operations.

**Authentication**:

JWT-based authentication with protected routes.

**Payment Integration**:

Stripe integration with webhook support.

**Error Handling**:

Centralized error-handling middleware with logging.

Documentation:

API documentation using **Postman\***.

### **Contact**

For questions or further details, please contact:  
Jackster042  
feemail042@gmail.com  
[Your GitHub Profile]

---
