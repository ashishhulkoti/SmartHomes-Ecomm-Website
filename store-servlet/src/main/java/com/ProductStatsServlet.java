package com;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import java.util.Arrays;

@WebServlet("/api/productStats")
public class ProductStatsServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        
        try {
            // MongoDB Operations
            MongoClient mongoClient = MongoDBDataStoreUtilities.getMongoClient();
            MongoDatabase database = mongoClient.getDatabase("eCommReview");
            MongoCollection<Document> reviewsCollection = database.getCollection("ProductReviews");

            // 1. Top five most liked products (based on ReviewRating)
            List<Document> topLikedProducts = reviewsCollection.aggregate(Arrays.asList(
                // Group by ProductModelName and sum the ReviewRating for each product
                Aggregates.group("$ProductModelName", Accumulators.avg("avgRating", "$ReviewRating")),
                // Sort by average rating in descending order
                Aggregates.sort(Sorts.descending("avgRating")),
                // Limit to top 5 results
                Aggregates.limit(5)
            )).into(new ArrayList<>());

            // 2. Top five zip-codes where maximum number of products sold (based on StoreZip)
            List<Document> topZipCodes = reviewsCollection.aggregate(Arrays.asList(
                // Group by StoreZip and count occurrences
                Aggregates.group("$StoreZip", Accumulators.sum("productCount", 1)),
                // Sort by total products sold in descending order
                Aggregates.sort(Sorts.descending("productCount")),
                // Limit to top 5 results
                Aggregates.limit(5)
            )).into(new ArrayList<>());

            // // MySQL Operations
            // Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = MySQLDataStoreUtilities.initializeDatabase();
            // 3. Top five most sold products regardless of rating
            String topSoldProductsQuery = "SELECT o.productId, p.productName, COUNT(*) as totalSales FROM orderTransaction o, products p " +
                                          "WHERE o.productId=p.productId " +
                                          "GROUP BY o.productId ORDER BY totalSales DESC LIMIT 5";
            PreparedStatement preparedStatement = connection.prepareStatement(topSoldProductsQuery);
            ResultSet resultSet = preparedStatement.executeQuery();

            List<Map<String, Object>> topSoldProducts = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> product = new HashMap<>();
                product.put("productId", resultSet.getInt("productId"));
                product.put("totalSales", resultSet.getInt("totalSales"));
                topSoldProducts.add(product);
            }

            resultSet.close();
            preparedStatement.close();
            connection.close();

            // Prepare JSON response
            String jsonResponse = buildJsonResponse(topLikedProducts, topZipCodes, topSoldProducts);
            response.getWriter().write(jsonResponse);

        } catch (Exception e) {
            response.getWriter().write("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }

    // Helper method to build JSON response
    private String buildJsonResponse(List<Document> topLikedProducts, List<Document> topZipCodes, List<Map<String, Object>> topSoldProducts) {
        StringBuilder jsonResponse = new StringBuilder("{");

        // Top Liked Products
        jsonResponse.append("\"topLikedProducts\": [");
        for (Document product : topLikedProducts) {
            jsonResponse.append("{\"productModelName\": \"").append(product.getString("_id")).append("\",")
                    .append("\"avgRating\": ").append(product.getDouble("avgRating")).append("},");
        }
        if (!topLikedProducts.isEmpty()) jsonResponse.setLength(jsonResponse.length() - 1); // Remove last comma
        jsonResponse.append("],");

        // Top Zip Codes
        jsonResponse.append("\"topZipCodes\": [");
        for (Document zipCode : topZipCodes) {
            jsonResponse.append("{\"storeZip\": \"").append(zipCode.getString("_id")).append("\",")
                    .append("\"productCount\": ").append(zipCode.getInteger("productCount")).append("},");
        }
        if (!topZipCodes.isEmpty()) jsonResponse.setLength(jsonResponse.length() - 1); // Remove last comma
        jsonResponse.append("],");

        // Top Sold Products
        jsonResponse.append("\"topSoldProducts\": [");
        for (Map<String, Object> product : topSoldProducts) {
            jsonResponse.append("{\"productId\": ").append(product.get("productId")).append(",")
                    .append("\"totalSales\": ").append(product.get("totalSales")).append("},");
        }
        if (!topSoldProducts.isEmpty()) jsonResponse.setLength(jsonResponse.length() - 1); // Remove last comma
        jsonResponse.append("]");

        jsonResponse.append("}");
        return jsonResponse.toString();
    }
}
