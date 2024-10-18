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
import java.io.PrintWriter;
import java.util.List;
import java.util.ArrayList;

@WebServlet("/api/getReviews/*")
public class ReviewServlet extends HttpServlet {


    // MongoDB connection details
    private static final String DATABASE_NAME = "eCommReview";
    private static final String COLLECTION_NAME = "ProductReviews";

    // Fetch reviews by Product Model Name (productId)
    public static List<Document> getReviewsByProductId(String productId) {
        MongoClient mongoClient = MongoDBDataStoreUtilities.getMongoClient();
        List<Document> reviews = new ArrayList<>();
        
        if (mongoClient == null) {
            return reviews;
        }

        try {
            MongoDatabase database = mongoClient.getDatabase(DATABASE_NAME);
            MongoCollection<Document> collection = database.getCollection(COLLECTION_NAME);

            // Query to find reviews by product model name
            Document query = new Document("ProductModelName", productId);
            for (Document doc : collection.find(query)) {
                reviews.add(doc);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            mongoClient.close();
        }

        return reviews;
    }



    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        
        String pathInfo = request.getPathInfo();
        
        // Get the Product ID (Model Name) from request parameters
        String productId = request.getParameter("productId");

        // Fetch reviews for the given product ID
        List<Document> reviews = getReviewsByProductId(productId);

        // Set the response type to JSON
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        // Convert the list of reviews to JSON
        out.println("[");
        for (int i = 0; i < reviews.size(); i++) {
            out.print(reviews.get(i).toJson());
            if (i < reviews.size() - 1) {
                out.println(",");
            }
        }
        out.println("]");
        
        out.flush();
        out.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Parse incoming JSON request body
        StringBuilder jsonBody = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            jsonBody.append(line);
        }

        // Convert the incoming JSON string into a BSON Document
        Document reviewData = Document.parse(jsonBody.toString());

        // Extract the relevant fields from the reviewData
        String productModelName = reviewData.getString("ProductModelName");
        String userId = reviewData.getString("UserID");

        // Initialize MongoDB connection
        MongoClient mongoClient = MongoDBDataStoreUtilities.getMongoClient();
        if (mongoClient == null) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to connect to MongoDB.");
            return;
        }

        try {
            MongoDatabase database = mongoClient.getDatabase(DATABASE_NAME);
            MongoCollection<Document> collection = database.getCollection(COLLECTION_NAME);

            // Query to check if a review by the same user for the same product already exists
            Document query = new Document("ProductModelName", productModelName)
                    .append("UserID", userId);

            // Find the existing review, if any
            Document existingReview = collection.find(query).first();

            if (existingReview != null) {
                // Replace the existing review with the new review data
                collection.replaceOne(query, reviewData);
            } else {
                // Insert the new review into the collection
                collection.insertOne(reviewData);
            }

            // Set response status to 200 (OK)
            response.setStatus(HttpServletResponse.SC_OK);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while processing the review.");
        } finally {
            mongoClient.close();
        }
    }

}
