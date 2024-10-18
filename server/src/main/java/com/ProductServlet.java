package com;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.Iterator;

@WebServlet("/api/products/*")
public class ProductServlet extends HttpServlet {

    private static String JSON_FILE_PATH;
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        String query = request.getParameter("query");

        try {
            Connection con = MySQLDataStoreUtilities.initializeDatabase();
            PreparedStatement st;

            if (query != null && !query.isEmpty()) {
                // Handle search query
                st = con.prepareStatement("SELECT * FROM products WHERE productName LIKE ?");
                st.setString(1, "%" + query + "%");
                // ResultSet rs = st.executeQuery();

                // // Build a JSON array of matching product names
                // JSONArray suggestions = new JSONArray();
                // while (rs.next()) {
                //     suggestions.put(rs.getString("productName"));
                // }

                // // Close resources
                // rs.close();
                // st.close();
                // con.close();

                // // Set response headers and write the JSON array
                // response.setHeader("Access-Control-Allow-Origin", "*");
                // response.setContentType("application/json");
                // PrintWriter out = response.getWriter();
                // out.println(suggestions);
                // return;
            } else if (pathInfo == null || pathInfo.equals("/")) {
                // If no product ID or search query is provided, retrieve all products
                st = con.prepareStatement("SELECT * FROM products");
            } else {
                // Extract product ID from the path
                String productIdStr = pathInfo.substring(1); // Remove the leading "/"
                int productId = Integer.parseInt(productIdStr);
                st = con.prepareStatement("SELECT * FROM products WHERE productId=?");
                st.setInt(1, productId);
            }

            ResultSet rs = st.executeQuery();
            JSONArray json = new JSONArray();
            ResultSetMetaData rsmd = rs.getMetaData();
            int numColumns = rsmd.getColumnCount();
            while (rs.next()) {
                JSONObject obj = new JSONObject();
                for (int i = 1; i <= numColumns; i++) {
                    String column_name = rsmd.getColumnName(i);
                    obj.put(column_name, rs.getObject(i));
                }
                json.put(obj);
            }

            // Close resources
            rs.close();
            st.close();
            con.close();

            // Set response headers and write the JSON array
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.println(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    
        String pathInfo = request.getPathInfo(); // /category/id
        if (pathInfo == null || pathInfo.split("/").length != 3) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format.");
            return;
        }

        String[] pathParts = pathInfo.split("/");
        String category = pathParts[1];
        int productId = Integer.parseInt(pathParts[2]);

        JsonObject productsJson = loadProductsJson();
        if (!productsJson.has(category)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Category not found.");
            return;
        }

        JsonArray products = productsJson.getAsJsonArray(category);
        JsonObject updatedProduct = JsonParser.parseReader(request.getReader()).getAsJsonObject();

        // Find the product by ID and update
        boolean productFound = false;
        for (JsonElement productElement : products) {
            JsonObject product = productElement.getAsJsonObject();
            if (product.get("id").getAsInt() == productId) {
                products.remove(product);
                products.add(updatedProduct);
                productFound = true;
                break;
            }
        }

        if (!productFound) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Product not found.");
            return;
        }

        saveProductsJson(productsJson);
        response.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins, adjust for production
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.getWriter().write("Product updated successfully.");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo(); // /category/id
        if (pathInfo == null || pathInfo.split("/").length != 3) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format.");
            return;
        }

        String[] pathParts = pathInfo.split("/");
        String category = pathParts[1];
        int productId = Integer.parseInt(pathParts[2]);

        JsonObject productsJson = loadProductsJson();
        if (!productsJson.has(category)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Category not found.");
            return;
        }

        JsonArray products = productsJson.getAsJsonArray(category);

        // Find and remove the product by ID
        Iterator<JsonElement> iterator = products.iterator();
        boolean productFound = false;
        while (iterator.hasNext()) {
            JsonObject product = iterator.next().getAsJsonObject();
            if (product.get("id").getAsInt() == productId) {
                iterator.remove();
                productFound = true;
                break;
            }
        }

        if (!productFound) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Product not found.");
            return;
        }

        saveProductsJson(productsJson);
        response.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins, adjust for production
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.getWriter().write("Product deleted successfully.");
    }

    private JsonObject loadProductsJson() throws IOException {
        Reader reader = new FileReader(JSON_FILE_PATH);
        return JsonParser.parseReader(reader).getAsJsonObject();
    }

    private void saveProductsJson(JsonObject productsJson) throws IOException {
        Writer writer = new FileWriter(JSON_FILE_PATH);
        gson.toJson(productsJson, writer);
        writer.flush();
        writer.close();
    }
}
