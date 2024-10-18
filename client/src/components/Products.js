import React, { useState, useEffect } from 'react';
import './Products.css';
import { useNavigate } from "react-router-dom";


// Fetch products from API
const fetchProducts = async (searchTerm = '') => {
    try {
        let url = 'http://localhost:8080/store-servlet/api/products';
        if (searchTerm) {
            url += `?query=${searchTerm}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
};

// Fetch product suggestions for autocomplete
const fetchProductSuggestions = async (query) => {
    try {
        const response = await fetch(`http://localhost:8080/store-servlet/api/product-suggestions?query=${query}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem fetching suggestions:', error);
        return [];
    }
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from API
    fetchProducts().then(data => setProducts(data));
  }, []);

  const goToProductDetails = (product) => {
    navigate(`/product/${product.productId}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      // Fetch product suggestions based on the search term
      fetchProductSuggestions(value).then(data => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const handleSearch = () => {
    fetchProducts(searchTerm).then(data => setProducts(data));
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="products-container">
      <div className="search-bar-container">
        <div className="search-bar">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearchChange} 
            onKeyPress={handleKeyPress}
            placeholder="Search for products..."
          />
          <button className="search-button" onClick={handleSearch}>
          <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt={"Search"} />
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div key={product.productId} className="product" onClick={() => goToProductDetails(product)}>
            <img src={`${process.env.PUBLIC_URL}/assets/${product.image}`} alt={product.productName} />
            <div className="product-info">
              <h2>{product.productName}</h2>
              <p>Price: ${product.productPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
