package com;
import java.io.IOException; 
import java.io.PrintWriter; 
import java.sql.Connection; 
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import javax.servlet.ServletException; 
import javax.servlet.annotation.WebServlet; 
import javax.servlet.http.HttpServlet; 
import javax.servlet.http.HttpServletRequest; 
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

// Import Database Connection Class file 
import com.MySQLDataStoreUtilities;


// Servlet Name 
@WebServlet("/test") 
public class testdb extends HttpServlet { 
	private static final long serialVersionUID = 1L; 

	protected void doGet(HttpServletRequest request, 
HttpServletResponse response) 
		throws ServletException, IOException 
	{ 
		try { 

			// Initialize the database 
			Connection con = MySQLDataStoreUtilities.initializeDatabase(); 

			// Create a SQL query to insert data into demo table 
			// demo table consists of two columns, so two '?' is used 
			PreparedStatement st = con 
				.prepareStatement("select * from products"); 

			// For the first parameter, 
			// get the data using request object 
			// sets the data to st pointer 
			// st.setInt(1, Integer.valueOf(request.getParameter("id"))); 

			// Same for second parameter 
			// st.setString(2, request.getParameter("string")); 

			// Execute the insert command using executeUpdate() 
			// to make changes in database 
			ResultSet rs = st.executeQuery(); 


            JSONArray json = new JSONArray();
            ResultSetMetaData rsmd = rs.getMetaData();
            int numColumns = rsmd.getColumnCount();
            while(rs.next()) {
            JSONObject obj = new JSONObject();
            for (int i=1; i<=numColumns; i++) {
                String column_name = rsmd.getColumnName(i);
                obj.put(column_name, rs.getObject(i));
            }
            json.put(obj);
            }
            //return json;


            // String str="";
            // while (rs.next()) { 
  
            //     str  += rs.getString(1) +" "+rs.getString(2)+"\n"; 
            // } 
  
            
			// Close all the connections 
			st.close(); 
			con.close(); 
            
			// Get a writer pointer 
			// to display the successful result 
            
            // response.sendRedirect("Result.jsp?id=" + str);
            
            rs.close(); 
            // System.out.println("Here is the response from db:\n\n"+json.toString());
			PrintWriter out = response.getWriter(); 
			out.println(json.toString());
            // out.println("<html><body><b>Successfully Inserted"
			// 			+ "</b></body></html>"); 
		} 
		catch (Exception e) { 
			e.printStackTrace(); 
		} 
	} 
} 
