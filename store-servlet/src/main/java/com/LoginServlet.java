package com;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;
import java.io.BufferedReader;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    // Path to your JSON file
    private static String JSON_FILE_PATH;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Retrieve parameters from URL query string
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String role = request.getParameter("role");

        JSON_FILE_PATH = getServletContext().getRealPath("/WEB-INF/LoginCredentials.json");
        // Read and parse JSON file
        JSONParser parser = new JSONParser();
        try (FileReader reader = new FileReader(JSON_FILE_PATH)) {
            // Parse the JSON file
            JSONObject jsonObject = (JSONObject) parser.parse(reader);

            // Get the "users" object
            JSONObject users = (JSONObject) jsonObject.get("users");

            boolean loginSuccess = false;

            // Check the role and validate credentials
            switch (role) {
                case "customer":
                    loginSuccess = checkCredentials(users, "customers", username, password);
                    break;
                case "manager":
                    loginSuccess = checkSingleUser(users, "manager", username, password);
                    break;
                case "sales":
                    loginSuccess = checkSingleUser(users, "sales", username, password);
                    break;
                default:
                    loginSuccess = false;
            }

            // Send response
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            JSONObject jsonResponse = new JSONObject();
            if (loginSuccess) {
                jsonResponse.put("status", "success");
            } else {
                jsonResponse.put("status", "failed");
            }
            out.print(jsonResponse);
            out.flush();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSON_FILE_PATH = getServletContext().getRealPath("/WEB-INF/LoginCredentials.json");
        // Parse the request body (JSON)
        BufferedReader reader = request.getReader();
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line);
        }
        String requestBody = stringBuilder.toString();

        // Parse the JSON body
        JSONParser parser = new JSONParser();
        try {
            JSONObject newUser = (JSONObject) parser.parse(requestBody);

            String username = (String) newUser.get("username");
            String password = (String) newUser.get("password");
            String role = (String) newUser.get("role");

            // Read and update the JSON file
            try (FileReader fileReader = new FileReader(JSON_FILE_PATH)) {
                JSONObject jsonObject = (JSONObject) parser.parse(fileReader);
                JSONObject users = (JSONObject) jsonObject.get("users");

                switch (role) {
                    case "customer":
                        addNewUser(users, "customers", username, password);
                        break;
                    case "manager":
                        updateSingleUser(users, "manager", username, password);
                        break;
                    case "sales":
                        updateSingleUser(users, "sales", username, password);
                        break;
                    default:
                        // Invalid role
                        response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid role specified.");
                        return;
                }

                // Write updated JSON back to the file
                try (FileWriter fileWriter = new FileWriter(JSON_FILE_PATH)) {
                    fileWriter.write(jsonObject.toJSONString());
                    fileWriter.flush();
                }

                // Send success response
                response.setContentType("application/json");
                PrintWriter out = response.getWriter();
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("status", "user added successfully");
                out.print(jsonResponse);
                out.flush();

            } catch (IOException | ParseException e) {
                e.printStackTrace();
            }

        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    // Method to validate multiple customer credentials
    private boolean checkCredentials(JSONObject users, String roleKey, String username, String password) {
        JSONArray usersArray = (JSONArray) users.get(roleKey);

        for (Object obj : usersArray) {
            JSONObject user = (JSONObject) obj;
            String storedUsername = (String) user.get("username");
            String storedPassword = (String) user.get("password");

            if (storedUsername.equals(username) && storedPassword.equals(password)) {
                return true;
            }
        }
        return false;
    }

    // Method to validate single user (manager or salesman)
    private boolean checkSingleUser(JSONObject users, String roleKey, String username, String password) {
        JSONObject user = (JSONObject) users.get(roleKey);
        String storedUsername = (String) user.get("username");
        String storedPassword = (String) user.get("password");

        return storedUsername.equals(username) && storedPassword.equals(password);
    }

    // Method to add a new user to the customers array
    private void addNewUser(JSONObject users, String roleKey, String username, String password) {
        JSONArray usersArray = (JSONArray) users.get(roleKey);
        JSONObject newUser = new JSONObject();
        newUser.put("username", username);
        newUser.put("password", password);
        usersArray.add(newUser);
    }

    // Method to update or overwrite a single user (manager or salesman)
    private void updateSingleUser(JSONObject users, String roleKey, String username, String password) {
        JSONObject user = new JSONObject();
        user.put("username", username);
        user.put("password", password);
        users.put(roleKey, user);
    }
}
