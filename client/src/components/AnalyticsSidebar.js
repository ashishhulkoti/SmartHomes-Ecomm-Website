import React, { useEffect, useState } from 'react';
import './AnalyticsSidebar.css'; // Create a new CSS file to style the sidebar

const AnalyticsSidebar = ({ onClose }) => {

    const [analyticsData, setAnalyticsData] = useState({
        topLikedProducts: [],
        topZipCodes: [],
        topSoldProducts: []
      });


      useEffect(() => {
        // Fetch analytics data from the API
        fetch('http://localhost:8080/store-servlet/api/productStats')
          .then((response) => response.json())
          .then((data) => {
            setAnalyticsData(data);
          })
          .catch((error) => {
            console.error('Error fetching analytics data:', error);
          });
      }, []);

  return (
    <div className="sidebar">
      <button className="close-button" onClick={onClose}>X</button>
      <div className="analytics-section">
        <h3>Top 5 Most Liked Products</h3>
        <ul>
          {analyticsData.topLikedProducts.map((product, index) => (
            <li key={index}>{product.productModelName} (Rating: {product.avgRating ?? 'N/A'})</li>
          ))}
        </ul>
      </div>
      <div className="analytics-section">
        <h3>Top 5 Zip Codes with Most Products Sold</h3>
        <ul>
          {analyticsData.topZipCodes.map((zip, index) => (
            <li key={index}>Zip Code: {zip.storeZip} (Products Sold: {zip.productCount ?? 'N/A'})</li>
          ))}
        </ul>
      </div>
      <div className="analytics-section">
        <h3>Top 5 Most Sold Products</h3>
        <ul>
          {analyticsData.topSoldProducts.map((product, index) => (
            <li key={index}>Product ID: {product.productId} (Total Sales: {product.totalSales})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsSidebar;
