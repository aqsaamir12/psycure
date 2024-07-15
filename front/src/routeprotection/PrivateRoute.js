import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import FullPageLoader from '../components/pages/PageNotFound/FullPageLoader';

const PrivateRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const isAuthenticated = token ? true : false;
            setIsAuthenticated(isAuthenticated);
            setIsLoading(false);
        };

            checkAuthentication();
       
    }, []);

    if (isLoading) {
        return <FullPageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
