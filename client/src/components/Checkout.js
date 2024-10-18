import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext'; // Import CartContext to clear the cart


// Hardcoded store locations by zipcode
const storeLocations = {
    "10001": "Store 1, New York",
    "90001": "Store 2, Los Angeles",
    "60601": "Store 3, Chicago",
    "94101": "Store 4, San Francisco",
    "73301": "Store 5, Austin",
    "30301": "Store 6, Atlanta",
    "85001": "Store 7, Phoenix",
    "80201": "Store 8, Denver",
    "33101": "Store 9, Miami",
    "20001": "Store 10, Washington, D.C."
};

const Checkout = () => {



    const [personalInfo, setPersonalInfo] = useState({ name: '', street: '', city: '', state: '', zip: '' });
    const [creditCard, setCreditCard] = useState({ cardNumber: '', expiration: '', cvv: '' });
    const [deliveryOption, setDeliveryOption] = useState('home');
    const [pickupZip, setPickupZip] = useState('');
    const [storeLocation, setStoreLocation] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [confirmationNumber, setConfirmationNumber] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    const { cart, setCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Get token from session storage
        const token = sessionStorage.getItem('token');

        // Check if the token is not equal to "customer"
        if (token !== 'customer') {
            // Navigate to login page with the frompg parameter set to "products"
            navigate('/login', { state: { frompg: 'checkout' } });
        }
    }, [navigate]);


    // Function to handle input changes for personal information
    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prevState => ({ ...prevState, [name]: value }));
    };

    // Function to handle credit card input
    const handleCreditCardChange = (e) => {
        const { name, value } = e.target;
        setCreditCard(prevState => ({ ...prevState, [name]: value }));
    };

    // Function to handle zip code change for in-store pickup
    const handlePickupZipChange = (e) => {
        setPickupZip(e.target.value);
        if (storeLocations[e.target.value]) {
            setStoreLocation(storeLocations[e.target.value]);
        } else {
            setStoreLocation('No store found for this zipcode');
        }
    };

    // Function to generate a random confirmation number
    const generateConfirmationNumber = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Function to calculate delivery/pickup date (2 weeks from today)
    const calculateDeliveryDate = () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 14);
        return currentDate.toDateString();
    };

    // Function to handle order placement
    const handlePlaceOrder = () => {
        setConfirmationNumber(generateConfirmationNumber());
        setDeliveryDate(calculateDeliveryDate());
        setOrderPlaced(true);
        console.log(cart);
        setCart([]);
    };

    return (
        <div className="checkout-container">
            {!orderPlaced ? (
                <div>
                    <h2>Checkout</h2>

                    {/* Personal Information */}
                    <div>
                        <h3>Personal Information</h3>
                        <input 
                            type="text" 
                            name="name" 
                            value={personalInfo.name} 
                            onChange={handlePersonalInfoChange} 
                            placeholder="Name" 
                        />
                        <br></br>
                        <br></br>
                        <input 
                            type="text" 
                            name="street" 
                            value={personalInfo.street} 
                            onChange={handlePersonalInfoChange} 
                            placeholder="Street" 
                        />
                        <br></br>
                        <br></br>
                        <input 
                            type="text" 
                            name="city" 
                            value={personalInfo.city} 
                            onChange={handlePersonalInfoChange} 
                            placeholder="City" 
                        />
                         &ensp;
                        <input 
                            type="text" 
                            name="state" 
                            value={personalInfo.state} 
                            onChange={handlePersonalInfoChange} 
                            placeholder="State" 
                        />
                        <br></br>
                        <br></br>
                        <input 
                            type="text" 
                            name="zip" 
                            value={personalInfo.zip} 
                            onChange={handlePersonalInfoChange} 
                            placeholder="Zip Code" 
                        />
                    </div>

                    {/* Credit Card Information */}
                    <div>
                        <h3>Credit Card Information</h3>
                        <input 
                            type="text" 
                            name="cardNumber" 
                            value={creditCard.cardNumber} 
                            onChange={handleCreditCardChange} 
                            placeholder="Card Number" 
                        />
                        <br></br>
                        <br></br>
                        <input 
                            type="text" 
                            name="expiration" 
                            value={creditCard.expiration} 
                            onChange={handleCreditCardChange} 
                            placeholder="Expiration Date (MM/YY)" 
                        />

                        &ensp;
                        <input 
                            type="text" 
                            name="cvv" 
                            value={creditCard.cvv} 
                            onChange={handleCreditCardChange} 
                            placeholder="CVV" 
                        />
                    </div>

                    {/* Delivery Option */}
                    <div>
                        <h3>Delivery Option</h3>
                        <select 
                            value={deliveryOption} 
                            onChange={(e) => setDeliveryOption(e.target.value)}
                        >
                            <option value="home">Home Delivery</option>
                            <option value="pickup">In-Store Pickup</option>
                        </select>
                    </div>
                    <br></br>

                    {/* If In-Store Pickup is selected, show zip code field */}
                    {deliveryOption === 'pickup' && (
                        <div>
                            <input 
                                type="text" 
                                value={pickupZip} 
                                onChange={handlePickupZipChange} 
                                placeholder="Enter Zip Code for Store Pickup" 
                            />
                            {storeLocation && <p>Store Location: {storeLocation}</p>}
                        </div>
                    )}

                    {/* Cart Actions */}
                    <div className="checkout-actions">
                        <button onClick={() => navigate('/cart')}>Back to Cart</button>
                        <button onClick={handlePlaceOrder}>Place Order</button>
                    </div>
                </div>
            ) : (
                // Order Confirmation
                <div className="order-confirmation">
                    <h3>Order Placed Successfully!</h3>
                    <p>Confirmation Number: {confirmationNumber}</p>
                    <p>Estimated Delivery/Pickup Date: {deliveryDate}</p>
                    <button onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
