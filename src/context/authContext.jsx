import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();
export const API_URL = 'https://statcalculatorbackend.vercel.app';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [error, setError] = useState(null); // State to handle errors
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
    }, [token])
    const registerUser = async (data) => {
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'User registration failed!');
            }

            const userData = await response.json();
            setUser(userData.user); // Adjust according to your API response
            setToken(userData.token); // Adjust according to your API response
            console.log('User created successfully:', userData);
            setError(null); // Clear previous errors
        } catch (error) {
            console.log('Error during registration:', error);
            setError(error.message); // Update the error state
        }
    };

    const signInUser = async (data) => {
        try {
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed!');
            }

            const userData = await response.json();
            setUser(userData); // Adjust according to your API response
            setToken(userData.token); // Adjust according to your API response
            console.log('User logged in successfully:', userData);
            setError(null); // Clear previous errors
        } catch (error) {
            console.log('Error during login:', error);
            setError(error.message); // Update the error state
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, registerUser, signInUser, error }}>
            {children}
        </AuthContext.Provider>
    );
};
