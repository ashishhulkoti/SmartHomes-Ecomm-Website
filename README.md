# SmartHomes-Ecomm-Website

SmartHomes is an online retailer for smart home devices. This web application allows customers to browse and purchase products, manage orders, leave product reviews, and view analytics on product trends. Store managers can handle product inventory, view sales reports, and update product listings. The application integrates both SQL and NoSQL databases to store customer information, transactions, and product reviews.

## Features

### Customer Features:
- **Product Browsing & Shopping Cart:**
  Customers can browse through various product categories, including Smart Doorbells, Smart Doorlocks, Smart Speakers, Smart Lightings, and Smart Thermostats. They can add products to their cart and manage the cart before checkout.

- **Order Placement:**
  Customers can place orders with options for store pickup or home delivery. They can also cancel orders or check the order status.

- **Product Reviews:**
  Customers can write reviews for products they have purchased. Reviews include ratings, text comments, and are stored in a NoSQL (MongoDB) database.

### Store Manager Features:
- **Product Management:**
  Store managers can add, update, or delete products from the inventory. This includes managing product details such as name, price, description, and whether the product is on sale or has a manufacturer rebate.

- **Inventory Reports:**
  Store managers can generate reports on product inventory, including a bar chart showing the quantity of products in stock and lists of products currently on sale or with rebates.

- **Sales Reports:**
  Sales reports include details on products sold, total sales for each product, and daily sales transactions. Visualizations are generated using Google Charts for a clear understanding of the sales data.

### Additional Features:
- **Search Auto-Completion:**
  The application offers search auto-completion for product searches. As users type, product suggestions are dynamically provided based on the product catalog.

- **Trending Products:**
  Customers can view trending data, such as the top-rated products, top-selling products, and locations where the most products are sold.

## Technologies Used

- **Frontend:**
  - React.js
  - HTML/CSS/JavaScript
  - Google Charts for data visualization

- **Backend:**
  - Java Servlets
  - Apache Tomcat Server
  - Maven for dependency management
  - MySQL (for storing user accounts, orders, product data)
  - MongoDB (for storing product reviews)

## How to Run the Application

### Prerequisites:
- **Node.js** and **npm** installed
- **Apache Tomcat** server installed and running
- **MySQL** database setup with the required tables for users, products, orders, stores, and transactions
- **MongoDB** setup for storing product reviews
- **Maven** installed for managing backend dependencies

### Steps to Run:

#### Frontend Setup:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/SmartHomes-Ecomm-Website.git
   cd SmartHomes-Ecomm-Website
