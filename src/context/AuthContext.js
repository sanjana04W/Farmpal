// Authentication Context for FarmPal
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for stored user on app load
    useEffect(() => {
        checkStoredUser();
    }, []);

    const checkStoredUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('farmpal_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error('Error checking stored user:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            setError(null);
            setIsLoading(true);
            const userData = await loginUser(username, password);

            if (userData) {
                await AsyncStorage.setItem('farmpal_user', JSON.stringify(userData));
                setUser(userData);
                return true;
            } else {
                setError('Invalid username or password');
                return false;
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('farmpal_user');
            await logoutUser();
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        isLoading,
        error,
        login,
        logout,
        clearError,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

