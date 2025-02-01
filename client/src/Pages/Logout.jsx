import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';

function Logout() {
    const navigate = useNavigate();

    // Function to handle manual logout (navigate to login page)
    const handleClick = () => {
        const res = axiosInstance.post('/logout')
        navigate('/login');
    };

    // Function to check authentication status
    const handleAuth = async () => {
        try {
            const res = await axiosInstance.get('/checkAuth', { withCredentials: true });
            if (!res.data) {
                // If the user is not authenticated, redirect to the login page
                navigate('/login');
            }
        } catch (error) {
            console.error('Auth Check Failed:', error);
            // If there's an error (e.g., network issue), redirect to the login page
            navigate('/login');
        }
    };

    // Check authentication status when the component mounts
    useEffect(() => {
        handleAuth();
    }, []);

    return (
        <>
            <div className="h-screen flex justify-center items-center flex-col">
                <div className="p-4 font-semibold">
                    Hello <span className="text-primary">User</span>, Thank You for Joining Our Website
                </div>
                <button className="btn btn-primary" onClick={handleClick}>
                    Logout
                </button>
            </div>
        </>
    );
}

export default Logout;