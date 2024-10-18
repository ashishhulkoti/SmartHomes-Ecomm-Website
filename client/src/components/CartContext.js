import React, { createContext, useState } from 'react';

// Create Cart Context
export const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
    // const [cart, setCart] = useState([]);
    const [cart, setCart] = useState([]);
    const [items, setItems] = useState(0);
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

    // };

    // const addToCart = (product) => {
    //     setCart((prevCart) => [...prevCart, product]);
    //     console.log("Cart after adding:", cart);  // Ensure the cart updates here
    // };

    // const removeFromCart = (id) => {
    //     setCart(prevCart => prevCart.filter(item => item.id !== id));
    // };

    // const updateQuantity = (id, quantity) => {
    //     setCart(prevCart => 
    //         prevCart.map(item =>
    //             item.id === id
    //                 ? { ...item, quantity: Math.max(0, quantity) }
    //                 : item
    //         )
    //     );
    // };

    return (
        <CartContext.Provider value={{ cart, setCart, items, setItems }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook for using Cart Context
//export const useCart = () => {return useContext(CartContext);};
