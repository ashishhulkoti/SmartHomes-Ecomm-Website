import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css'; // Assume this file contains relevant styles
import { Link, useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token !== 'manager') {
            navigate('/login', { state: { frompg: 'manager' } });
        }
    }, [navigate]);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [popupMode, setPopupMode] = useState(''); // 'edit' or 'add'
    const [productCategory, setProductCategory] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/store-servlet/api/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value) {
            const filtered = products.filter(product =>
                // product.productId.toString().includes(e.target.value)
                product.productId.toString() === e.target.value
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    };

    const handleRemove = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/store-servlet/api/products/${id}`);
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setProductCategory(product.productCategory);
        setPopupMode('edit');
    };

    const handleAdd = () => {
        setEditProduct({});
        setProductCategory('');
        setPopupMode('add');
    };

    const handleSave = async () => {
        try {
            const url = popupMode === 'edit'
                ? `http://localhost:8080/store-servlet/api/products/${editProduct.productId}`
                : 'http://localhost:8080/store-servlet/api/products';

            const method = popupMode === 'edit' ? 'PUT' : 'POST';

            await axios({
                method,
                url,
                data: { ...editProduct, productCategory }
            });
            fetchProducts(); // Refresh the product list
            setEditProduct(null); // Close the popup
            setProductCategory('');
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleCancel = () => {
        setProductCategory('');
        setEditProduct(null);
    };

    return (
        <div className="admin-page">
            <div style={{ textAlign:'start' }}>
                <Link to="/inventory" className="add-button">Inventory</Link>
                <Link to="/sales" className="add-button">Sales Report</Link>
                <Link onClick={handleAdd} className="add-button">
                Add Product
                    </Link>
            </div>
            <br></br><br></br>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by product ID"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                
            </div>

            <h2 style={{ textAlign: 'left' }}>Products</h2>

            <div className="products-list">
                {filteredProducts.map(product => (
                    <div key={product.productId} className="product-item">
                        <img src={`./assets/${product.image}`} alt={product.productName} />
                        <div className="product-details">
                            <p>ID: {product.productId}</p>
                            <p>Name: {product.productName}</p>
                            <p>Category: {product.productCategory}</p>
                            <p>Price: ${product.productPrice}</p>
                        </div>
                        <div className="product-actions">
                            <button onClick={() => handleRemove(product.productId)}>Remove</button>
                            <button onClick={() => handleEdit(product)}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            {editProduct !== null && (
                <div className="popup-modal">
                    <div className="modal-content">
                        <h3>{popupMode === 'edit' ? 'Edit Product' : 'Add Product'}</h3>
                        <p>Product ID</p>
                        <input
                            type="text"
                            placeholder="Product ID"
                            value={editProduct.productId ?? ''}
                            onChange={(e) => setEditProduct({ ...editProduct, productId: parseInt(e.target.value) })}
                            disabled={popupMode === 'edit'}
                        />
                        <br />

                        <p>Product Category</p>
                        <input
                            type="text"
                            placeholder="Category"
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                        />
                        <br />

                        <p>Name</p>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editProduct.productName ?? ''}
                            onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                        />
                        <br />

                        <p>Price</p>
                        <input
                            type="number"
                            placeholder="Price"
                            value={editProduct.productPrice ?? ''}
                            onChange={(e) => setEditProduct({ ...editProduct, productPrice: parseFloat(e.target.value) })}
                        />
                        <br />

                        <p>Description</p>
                        <input
                            type="text"
                            placeholder="Description"
                            value={editProduct.productDesc ?? ''}
                            onChange={(e) => setEditProduct({ ...editProduct, productDesc: e.target.value })}
                        />
                        <br />

                        <p>Image</p>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={editProduct.image ?? ''}
                            onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                setEditProduct({ ...editProduct, image: e.target.files[0].name });
                            }}
                        />
                        <br /><br />

                        <div className="modal-actions">
                            <button onClick={handleSave}>Done</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
