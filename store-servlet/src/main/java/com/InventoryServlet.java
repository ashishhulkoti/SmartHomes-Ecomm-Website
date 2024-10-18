package com;

import com.Models.Product;
import com.google.gson.Gson;
import java.util.ArrayList;
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
import java.util.List;

@WebServlet("/api/inventory/*")
public class InventoryServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        switch (path) {
            case "/products":
                getAllProducts(resp);
                break;
            case "/products/on-sale":
                getOnSaleProducts(resp);
                break;
            case "/products/rebates":
                getProductsWithRebates(resp);
                break;
            default:
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Not Found");
        }
    }

    private void getAllProducts(HttpServletResponse resp) throws IOException {
        List<Product> products = new ArrayList<>();
        try (Connection conn = MySQLDataStoreUtilities.initializeDatabase();
             PreparedStatement ps = conn.prepareStatement("SELECT productName, productPrice, quantityAvailable FROM products")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Product product = new Product();
                product.setProductName(rs.getString("productName"));
                product.setProductPrice(rs.getInt("productPrice"));
                product.setQuantityAvailable(rs.getInt("quantityAvailable"));
                products.add(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String json = new Gson().toJson(products);
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }

    private void getOnSaleProducts(HttpServletResponse resp) throws IOException {
        List<Product> products = new ArrayList<>();
        try (Connection conn = MySQLDataStoreUtilities.initializeDatabase();
             PreparedStatement ps = conn.prepareStatement("SELECT productName, productPrice FROM products WHERE onSale = 1")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Product product = new Product();
                product.setProductName(rs.getString("productName"));
                product.setProductPrice(rs.getInt("productPrice"));
                products.add(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String json = new Gson().toJson(products);
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }

    private void getProductsWithRebates(HttpServletResponse resp) throws IOException {
        List<Product> products = new ArrayList<>();
        try (Connection conn = MySQLDataStoreUtilities.initializeDatabase();
             PreparedStatement ps = conn.prepareStatement("SELECT productName, productPrice FROM products WHERE manufacturerRebates = 1")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Product product = new Product();
                product.setProductName(rs.getString("productName"));
                product.setProductPrice(rs.getInt("productPrice"));
                products.add(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String json = new Gson().toJson(products);
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }
}
