package com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.HashMap;
import java.util.Map;

// Map this servlet to handle POST requests at the endpoint: /getReviews/api/orders
@WebServlet("/api/orders")
public class OrdersServlet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set the response content type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        // Retrieve the customerId from the query parameter
        String customerIdParam = request.getParameter("customerId");
        if (customerIdParam == null || customerIdParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "Missing or invalid customerId parameter.");
            out.print(errorResponse.toString());
            out.flush();
            return;
        }

        int customerId = Integer.parseInt(customerIdParam);

        try {
            // Connect to the database
            Connection conn = MySQLDataStoreUtilities.initializeDatabase();

            // SQL query to get all orders for the given customerId 
    
            String sql = "select o.*, p.productName from orderTransaction o, products p where o.customerId=? AND  o.productId=p.productId";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, customerId);
            ResultSet rs = stmt.executeQuery();

            // Create a map to club orders with the same orderId
            Map<Integer, JSONObject> ordersMap = new HashMap<>();

            // Loop through the result set
            while (rs.next()) {
                int orderId = rs.getInt("orderId");

                // If this orderId is already in the map, just add the product details to the existing order
                JSONObject orderDetails = ordersMap.getOrDefault(orderId, new JSONObject());
                JSONArray productsArray = orderDetails.optJSONArray("products");

                // If the orderDetails object is new, initialize the order details
                if (productsArray == null) {
                    orderDetails.put("customerId", rs.getInt("customerId"));
                    orderDetails.put("customerName", rs.getString("customerName"));
                    orderDetails.put("customerAddr", rs.getString("customerAddr"));
                    orderDetails.put("creditCardNum", rs.getString("creditCardNum"));
                    orderDetails.put("orderId", orderId);
                    orderDetails.put("purchaseDate", rs.getDate("purchaseDate").toString());
                    orderDetails.put("shipDate", rs.getDate("shipDate").toString());
                    orderDetails.put("products", new JSONArray());
                    productsArray = orderDetails.getJSONArray("products");
                }

                // Create a JSON object for the product details
                JSONObject productDetails = new JSONObject();
                productDetails.put("productName", rs.getString("productName"));
                productDetails.put("productId", rs.getInt("productId"));
                productDetails.put("category", rs.getString("category"));
                productDetails.put("quantity", rs.getInt("quantity"));
                productDetails.put("price", rs.getInt("price"));
                productDetails.put("shippingCost", rs.getInt("shippingCost"));
                productDetails.put("discount", rs.getInt("discount"));
                productDetails.put("totalSales", rs.getInt("totalSales"));
                productDetails.put("storeId", rs.getInt("storeId"));
                productDetails.put("storeAddr", rs.getString("storeAddr"));

                // Add the product to the products array
                productsArray.put(productDetails);

                // Put the updated order details back into the map
                ordersMap.put(orderId, orderDetails);
            }

            // Convert the map of orders into a JSON array
            JSONArray ordersArray = new JSONArray(ordersMap.values());

            // Create the final response JSON object
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("orders", ordersArray);

            // Send the response
            out.print(jsonResponse.toString());
            out.flush();

            // Close the resources
            rs.close();
            stmt.close();
            conn.close();

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "An error occurred while processing the request.");
            out.print(errorResponse.toString());
            out.flush();
        }
    }



    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set the response content type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // Parse JSON body from the request
            JSONObject requestBody = new JSONObject(request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual));
            int userId = requestBody.getInt("userId");
            int productId = requestBody.getInt("productId");
            System.out.println("User id is here : "+userId);
            System.out.println("productId id is here : "+productId);
            // Connect to the database
            Connection conn = MySQLDataStoreUtilities.initializeDatabase(); 

            // SQL query to check if the user has bought the product
            String sql = "SELECT * FROM orderTransaction WHERE customerId = ? AND productId = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.setInt(2, productId);
            ResultSet rs = stmt.executeQuery();

            JSONObject jsonResponse = new JSONObject();

            // If the query returns a result, the user has purchased the product
            if (rs.next()) {
                // Create a JSON object to represent the order details
                JSONObject orderDetails = new JSONObject();
                orderDetails.put("customerId", rs.getInt("customerId"));
                orderDetails.put("customerName", rs.getString("customerName"));
                orderDetails.put("customerAddr", rs.getString("customerAddr"));
                orderDetails.put("creditCardNum", rs.getString("creditCardNum"));
                orderDetails.put("orderId", rs.getInt("orderId"));
                orderDetails.put("purchaseDate", rs.getDate("purchaseDate").toString());
                orderDetails.put("shipDate", rs.getDate("shipDate").toString());
                orderDetails.put("productId", rs.getInt("productId"));
                orderDetails.put("category", rs.getString("category"));
                orderDetails.put("quantity", rs.getInt("quantity"));
                orderDetails.put("price", rs.getInt("price"));
                orderDetails.put("shippingCost", rs.getInt("shippingCost"));
                orderDetails.put("discount", rs.getInt("discount"));
                orderDetails.put("totalSales", rs.getInt("totalSales"));
                orderDetails.put("storeId", rs.getInt("storeId"));
                orderDetails.put("storeAddr", rs.getString("storeAddr"));

                // Return the result with purchased status and order details
                jsonResponse.put("purchased", "true");
                jsonResponse.put("orderDetails", orderDetails);
            } else {
                // If no result, return purchased status as false
                jsonResponse.put("purchased", "false");
            }

            // Send the response
            out.print(jsonResponse.toString());
            out.flush();

            // Close the resources
            rs.close();
            stmt.close();
            conn.close();

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "An error occurred while processing the request.");
            out.print(errorResponse.toString());
            out.flush();
        }
    }
}
