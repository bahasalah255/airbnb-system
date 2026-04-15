import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtenir le jeton CSRF et vérifier si l'utilisateur est connecté au montage
        axios.get('/sanctum/csrf-cookie').then(() => {
            checkAuth();
        });
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        await axios.get('/sanctum/csrf-cookie');
        await axios.post('/login', credentials);
        await checkAuth();
    };

    const register = async (userData) => {
        await axios.get('/sanctum/csrf-cookie');
        await axios.post('/register', userData);
        await checkAuth();
    };

    const logout = async () => {
        await axios.post('/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
