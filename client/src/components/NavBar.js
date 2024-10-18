import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';  // You can add styles to make it responsive
//import { useAuth } from './AuthContext';  // Assuming you have an AuthContext to handle login state
import AnalyticsSidebar from './AnalyticsSidebar';



const NavBar = () => {
  const { isLoggedIn, logout } = useState(true); // Example: use context to check if logged in
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = () => {
    logout();  // Logic to handle logout
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <button className="icon-button" onClick={toggleSidebar}>  
        Trending
        </button>
        <h1>Smart Homes</h1>
      </div>
      {isSidebarOpen && <AnalyticsSidebar onClose={toggleSidebar} />}

      <div className="navbar-right">
        <Link to="/">Home</Link>
        <div className="dropdown">
          <button className="dropbtn">Admin</button>
          <div className="dropdown-content">
            {/* <Link to="/login" state={{ role: 'manager' }}>Store Manager</Link> */}
            <Link to="/storemanager" >Store Manager</Link>
            <Link to="/salesman">Salesman</Link>
          </div>
        </div>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">View Orders</Link>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
