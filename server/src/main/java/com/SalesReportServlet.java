package com;

import com.Models.DailySales;
import com.Models.SoldProduct;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/sales-report/*")
public class SalesReportServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        switch (path) {
            case "/products":
                getSoldProducts(resp);
                break;
            case "/daily-transactions":
                getDailySalesTransactions(resp);
                break;
            default:
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Not Found");
        }
    }

    private void getSoldProducts(HttpServletResponse resp) throws IOException {
        List<SoldProduct> soldProducts = new ArrayList<>();
        try (Connection conn = MySQLDataStoreUtilities.initializeDatabase();
             PreparedStatement ps = conn.prepareStatement("SELECT p.productName, AVG(p.productPrice) as productPrice, SUM(o.quantity) as quantity, SUM(o.totalSales) as totalSales"+
             " FROM orderTransaction o, products p WHERE o.productId=p.productId GROUP BY p.productName;")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                SoldProduct product = new SoldProduct();
                product.setProductName(rs.getString("productName"));
                product.setProductPrice(rs.getInt("productPrice"));
                product.setQuantitySold(rs.getInt("quantity"));
                product.setTotalSales(rs.getInt("totalSales"));
                soldProducts.add(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String json = new Gson().toJson(soldProducts);
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }

    private void getDailySalesTransactions(HttpServletResponse resp) throws IOException {
        List<DailySales> dailySalesList = new ArrayList<>();
        try (Connection conn = MySQLDataStoreUtilities.initializeDatabase();
             PreparedStatement ps = conn.prepareStatement("SELECT purchaseDate, SUM(totalSales) as totalSales FROM orderTransaction GROUP BY purchaseDate")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                DailySales dailySales = new DailySales();
                dailySales.setDate(rs.getDate("purchaseDate").toString());
                dailySales.setTotalSales(rs.getInt("totalSales"));
                dailySalesList.add(dailySales);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String json = new Gson().toJson(dailySalesList);
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }
}
