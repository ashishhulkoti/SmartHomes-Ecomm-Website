import React, { useEffect, useState } from "react";
import "./Orders.css"; // Create this CSS file for styling

const Orders = () => {
  const [orders, setOrders] = useState([]);
  sessionStorage.setItem('customerId', 6543);
  const customerId = sessionStorage.getItem('customerId');

  useEffect(() => {
    // Fetch orders using fetch API
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8080/store-servlet/api/orders?customerId=${customerId}`);
        if (response.ok) {
          const data = await response.json();
          // Sort orders by purchaseDate in descending order (most recent first)
          const sortedOrders = data.orders.sort(
            (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
          );
          setOrders(sortedOrders);
        } else {
          console.error("Error fetching orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [customerId]);

  const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <div className="orders-container">
      {orders.map((order) => {
        const totalPrice = calculateTotalPrice(order.products);
        const totalAmount = totalPrice + order.products[0].shippingCost; // Assuming all products have the same shipping cost

        return (
          <div key={order.orderId} className="order-block">
            <div className="order-header">
              <h2>Order ID: {order.orderId}</h2>
              <p>Purchase Date: {order.purchaseDate}</p>
            </div>
            <div className="products-container">
              {order.products.map((product) => (
                <div key={product.productId} className="product-subblock">
                  <div className="product-details">
                    <h3>{product.productName}</h3>
                    <p>Quantity: {product.quantity}</p>
                    <p>Price: ${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <p>Total Price: ${totalPrice}</p>
              <p>Shipping Cost: ${order.products[0].shippingCost}</p>
              <hr />
              <p className="total-amount">Total: ${totalAmount}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
