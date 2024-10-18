import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";

// Main Login Component
const Login = ({ role = 'customer' }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showSignUp, setShowSignUp] = useState(false);
    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [signUpError, setSignUpError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const frompg = location.state?.frompg || 'products';
    // Handle login
    
    if(frompg === "manager"){
        role="manager";
    }
    else if(frompg === "sales"){
        role="sales"
    }
    const handleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:8080/store-servlet/api/login', {
                params: {
                    username: username,
                    password: password,
                    role: role
                }
            });
            const data = response.data;
            if (data.status === 'success') {
                // Set session token to role if login is successful
                sessionStorage.setItem('token', role);
                alert('Login successful');
                if(frompg === "checkout")
                    navigate("/checkout");
                else if(frompg === "products")
                    navigate("/");
                else if(frompg === "manager")
                    navigate("/storemanager");
                else if(frompg === "sales")
                    navigate("/salesmanager");

                // Redirect or take action after successful login
            } else {
                setLoginError('Invalid username or password');
            }
        } catch (error) {
            setLoginError('Error logging in. Please try again.');
        }
    };

    // Handle sign-up
    const handleSignUp = async () => {
        try {
            const response = await axios.post('http://localhost:8080/store-servlet/api/login', {
                username: signUpUsername,
                password: signUpPassword,
                role: 'customer' // Always creating a customer account
            });
            const data = response.data;
            if (data.status === 'user added successfully') {
                alert('Customer account created successfully!');
                setShowSignUp(false); // Close the signup modal
            } else {
                setSignUpError('Error creating account. Please try again.');
            }
        } catch (error) {
            setSignUpError('Error creating account. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>

            <div style={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
            </div>

            {loginError && <p style={styles.errorText}>{loginError}</p>}

            <div style={styles.buttonContainer}>
                <button onClick={handleLogin} style={styles.loginButton}>Login</button>
                <button onClick={() => setShowSignUp(true)} style={styles.signUpButton}>Sign Up</button>
            </div>

            {/* Sign Up Modal */}
            {showSignUp && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>Sign Up</h2>

                        <div style={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={signUpUsername}
                                onChange={(e) => setSignUpUsername(e.target.value)}
                                style={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        {signUpError && <p style={styles.errorText}>{signUpError}</p>}

                        <button onClick={handleSignUp} style={styles.createAccountButton}>Create Customer Account</button>
                        <button onClick={() => setShowSignUp(false)} style={styles.closeButton}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '300px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    loginButton: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    signUpButton: {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        color: 'blue',
        textDecoration: 'underline',
        border: 'none',
        cursor: 'pointer',
    },
    errorText: {
        color: 'red',
        marginTop: '10px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        textAlign: 'center',
    },
    createAccountButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    closeButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default Login;
