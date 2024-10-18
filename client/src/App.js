import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Products from "./components/Products";
//import { CartProvider } from './components/CartContext';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import NavBar from './components/NavBar';
import AdminPage from './components/AdminPage';
import SalesReport from './components/SalesReport';
import Inventory from './components/InventoryPage';
import Login from './components/Login';
import ProductDetails from './components/ProductDetails';
// import ViewOrders from './components/ViewOrders';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Orders from './components/Orders';


function App() {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
      <Router>
        {/* <div>
          <h1>Applications</h1>
        </div> */}
        <div className="App">
        {<NavBar />}
        <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            {/* <Route path="/view-orders" element={<ViewOrders />} /> */}
        </Routes>
        <Routes>
          <Route path="/storemanager" element={<AdminPage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<SalesReport />} />
        </Routes>
        </div>
      </Router>

      

  );
}

export default App;
