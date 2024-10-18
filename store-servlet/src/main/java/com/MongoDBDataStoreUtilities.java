package com;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;

public class MongoDBDataStoreUtilities {

    // // MongoDB connection details
    private static final String URI = "mongodb://localhost:27017";
    // private static final String DATABASE_NAME = "eCommReview";
    // private static final String COLLECTION_NAME = "ProductReviews";

    public static MongoClient getMongoClient() {
        try {
            MongoClientURI clientURI = new MongoClientURI(URI);
            return new MongoClient(clientURI);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
