import React, { useState, useEffect, useRef } from 'react';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [onSaleProducts, setOnSaleProducts] = useState([]);
    const [rebateProducts, setRebateProducts] = useState([]);
    const chartRef = useRef(null); // Reference for the chart

    useEffect(() => {
        const loadGoogleCharts = () => {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/charts/loader.js';
            script.onload = () => {
                window.google.charts.load('current', { packages: ['bar'] });
                window.google.charts.setOnLoadCallback(fetchInventory); // Load data after the library is ready
            };
            document.body.appendChild(script);
        };

        loadGoogleCharts();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await fetch(`http://localhost:8080/store-servlet/api/inventory/products`);
            const data = await response.json();
            console.log("Fetched products:", data);
            setProducts(data);
            drawChart(data); // Call drawChart after fetching data
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    const fetchOnSaleProducts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/store-servlet/api/inventory/products/on-sale`);
            const data = await response.json();
            setOnSaleProducts(data);
        } catch (error) {
            console.error('Error fetching on-sale products:', error);
        }
    };

    const fetchRebateProducts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/store-servlet/api/inventory/products/rebates`);
            const data = await response.json();
            setRebateProducts(data);
        } catch (error) {
            console.error('Error fetching rebate products:', error);
        }
    };

    const drawChart = (data) => {
        const chartData = new window.google.visualization.arrayToDataTable([
            ['Product', 'Quantity Available'], // Header row
            ...data.map(product => [product.productName, product.quantityAvailable]) // Map product data
        ]);

        const options = {
            title: 'Quantity Available Bar Chart',
            width: 900,
            height: 500,
            legend: { position: 'none' },
            bars: 'horizontal', // Required for Material Bar Charts.
            axes: {
                x: {
                    0: { side: 'top', label: 'Quantity Available' } // Top x-axis.
                }
            },
            bar: { groupWidth: '90%' }
        };

        const chart = new window.google.charts.Bar(chartRef.current);
        chart.draw(chartData, options);
    };

    useEffect(() => {
        fetchOnSaleProducts(); // Fetch on-sale products when component mounts
        fetchRebateProducts(); // Fetch rebate products when component mounts
    }, []);

    useEffect(() => {
        // Re-draw the chart when products change
        if (products.length > 0) {
            drawChart(products);
        }
    }, [products]);

    return (
        <div>
            <h1>Inventory</h1>

            <h2>All Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity Available</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(product => (
                            <tr key={product.productName}>
                                <td>{product.productName}</td>
                                <td>{product.productPrice}</td>
                                <td>{product.quantityAvailable}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No products available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Products On Sale</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {onSaleProducts.length > 0 ? (
                        onSaleProducts.map(product => (
                            <tr key={product.productName}>
                                <td>{product.productName}</td>
                                <td>{product.productPrice}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No products on sale.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Products with Manufacturer Rebates</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {rebateProducts.length > 0 ? (
                        rebateProducts.map(product => (
                            <tr key={product.productName}>
                                <td>{product.productName}</td>
                                <td>{product.productPrice}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No products with rebates.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Quantity Available Bar Chart</h2>
            <div ref={chartRef} style={{ width: '900px', height: '500px' }}></div>
        </div>
    );
};

export default Inventory;
