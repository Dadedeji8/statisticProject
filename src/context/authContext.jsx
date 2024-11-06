import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();
export const API_URL = 'https://statcalculatorbackend.vercel.app';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true to indicate loading

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setToken(parsedUser.token);
        }
        setLoading(false); // Loading complete
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Sync `user` with `localStorage`
        }
    }, [user]);

    const registerUser = async (data) => {
        try {
            const response = await fetch(`${API_URL}/api/signup`, {
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
            signInUser(data)
            const userData = await response.json();
            setUser(userData.user);
            setToken(userData.token);
            setError(null); // Clear previous errors
            console.log('User created successfully:', userData);
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
            setUser(userData);
            setToken(userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setError(null); // Clear previous errors
            console.log('User logged in successfully:', userData);
        } catch (error) {
            console.log('Error during login:', error);
            setError(error.message); // Update the error state
        }
    };



    const logOut = () => {
        localStorage.clear()

    }


    return (
        <AuthContext.Provider value={{ user, token, registerUser, signInUser, error, loading, logOut }}>
            {!loading && children} {/* Render children only after loading is complete */}
        </AuthContext.Provider>
    );
};
