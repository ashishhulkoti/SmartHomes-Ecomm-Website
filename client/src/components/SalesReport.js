import React, { useState, useEffect, useRef } from 'react';

const SalesReport = () => {
  const [productsData, setProductsData] = useState([]);
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const chartRef = useRef(null);

  // Fetch product sales data and daily transactions when the component mounts
  useEffect(() => {
    fetchProductSalesData();
    fetchDailyTransactions();
    loadGoogleCharts();
  }, []);

  // Load the Google Charts library
  const loadGoogleCharts = () => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['bar'] });
        window.google.charts.setOnLoadCallback(drawProductSalesChart);
      };
      document.body.appendChild(script);
    } else {
      window.google.charts.setOnLoadCallback(drawProductSalesChart);
    }
  };

  // Fetch data from the sales-report API for products
  const fetchProductSalesData = async () => {
    try {
      const response = await fetch('http://localhost:8080/store-servlet/api/sales-report/products');
      const data = await response.json();
      setProductsData(data);
    } catch (error) {
      console.error('Error fetching products sales data:', error);
    }
  };

  // Fetch data from the sales-report API for daily transactions
  const fetchDailyTransactions = async () => {
    try {
      const response = await fetch('http://localhost:8080/store-servlet/api/sales-report/daily-transactions');
      const data = await response.json();
      setDailyTransactions(data);
    } catch (error) {
      console.error('Error fetching daily transactions data:', error);
    }
  };

  // Draw the bar chart for product sales
  const drawProductSalesChart = () => {
    if (productsData.length === 0 || !window.google) return;

    const chartData = new window.google.visualization.arrayToDataTable([
      ['Product Name', 'Total Sales'], // Headers
      ...productsData.map((product) => [product.productName, product.totalSales]), // Map the data
    ]);

    const options = {
      title: 'Product Sales Report',
      width: 900,
      height: 500,
      legend: { position: 'none' },
      bars: 'horizontal', // Horizontal bars
      axes: {
        x: {
          0: { side: 'top', label: 'Total Sales ($)' },
        },
      },
      bar: { groupWidth: '90%' },
    };

    const chart = new window.google.charts.Bar(chartRef.current);
    chart.draw(chartData, options);
  };

  // Trigger chart redraw when products data is updated
  useEffect(() => {
    if (productsData.length > 0 && window.google) {
      drawProductSalesChart();
    }
  }, [productsData]);

  return (
    <div>
      <h1>Sales Report</h1>

      {/* Table for products sold */}
      <h2>Products Sold</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Price</th>
            <th>Quantity Sold</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {productsData.length > 0 ? (
            productsData.map((product) => (
              <tr key={product.productName}>
                <td>{product.productName}</td>
                <td>{product.productPrice}</td>
                <td>{product.quantitySold}</td>
                <td>{product.totalSales}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bar chart for product sales */}
      <h2>Product Sales Bar Chart</h2>
      <div ref={chartRef} style={{ width: '900px', height: '500px' }}></div>

      {/* Table for daily sales transactions */}
      <h2>Daily Sales Transactions</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {dailyTransactions.length > 0 ? (
            dailyTransactions.map((transaction) => (
              <tr key={transaction.date}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.totalSales}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;
