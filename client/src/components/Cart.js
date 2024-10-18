import React, { useContext } from 'react';
//import { useCart } from './CartContext';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    //const { cart, setCart} = useCart();
    const { cart, setCart} = useContext(CartContext);
    const navigate = useNavigate();

    console.log('Cart contents:', cart);


    // const addToCart = (product) => {
    //     console.log('Adding to cart:', product);
    //     setCart(prevCart => {
    //         const existingProduct = prevCart.find(item => item.id === product.id);
    //         if (existingProduct) {
    //             return prevCart.map(item =>
    //                 item.id === product.id
    //                     ? { ...item, quantity: item.quantity + 1 }
    //                     : item
    //             );
    //         } else {
    //             return [...prevCart, { ...product, quantity: 1 }];
    //         }
    //     });
    //     console.log("Cart after adding:", cart);
    //   };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== id));
    };

    const updateQuantity = (id, quantity) => {
        setCart(prevCart => 
            prevCart.map(item =>
                item.productId === id
                    ? { ...item, quantity: Math.max(0, quantity) }
                    : item
            )
        );
    };


    const handleIncrement = (id) => {
        updateQuantity(id, cart.find(item => item.productId === id).quantity + 1);
    };

    const handleDecrement = (id) => {
        updateQuantity(id, cart.find(item => item.productId === id).quantity - 1);
    };

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);

    console.log("total is here : "+totalPrice);

    return (
        <div className="cart-container">
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cart.map(item => (
                        <div key={item.productId} className="cart-item">
                            <img src={`${process.env.PUBLIC_URL}/assets/${item.image}`} alt={item.productName} />
                            <div className="cart-item-info">
                                <h3>{item.productName}</h3>
                                <p>${item.productPrice}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => handleDecrement(item.productId)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleIncrement(item.productId)}>+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                            </div>
                        </div>
                    ))}


                    {/* Total Price Section */}
                    <div className="cart-total">
                        <h3>Total Price: ${totalPrice}</h3>
                    </div>

                    {/* Cart Actions */}
                    <div className="cart-actions">
                        <button onClick={() => navigate('/')}>Continue Shopping</button>
                        <button onClick={() => navigate('/checkout')}>Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
