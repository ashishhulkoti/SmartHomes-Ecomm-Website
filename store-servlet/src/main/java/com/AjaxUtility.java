package com;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/product-suggestions")
public class AjaxUtility extends HttpServlet {

    private static final long serialVersionUID = 1L;


    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String query = request.getParameter("query");
        List<String> suggestions = getSuggestionsFromDatabase(query);

        response.setContentType("application/json");
        response.getWriter().write(toJson(suggestions));
    }

    // Method to fetch product suggestions from MySQL database based on query
    private List<String> getSuggestionsFromDatabase(String query) {
        List<String> suggestions = new ArrayList<>();

        // MySQL query to search for product names
        String sql = "SELECT productName FROM products WHERE productName LIKE ? LIMIT 10";
        try {
            Connection conn = MySQLDataStoreUtilities.initializeDatabase();
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, "%" + query + "%"); // Case-insensitive search
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                String productName = rs.getString("productName");
                suggestions.add(productName);
            }
            stmt.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return suggestions;
    }

    // Helper method to convert a List<String> to a JSON array format
    private String toJson(List<String> suggestions) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < suggestions.size(); i++) {
            json.append("\"").append(suggestions.get(i)).append("\"");
            if (i < suggestions.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        return json.toString();
    }
}
