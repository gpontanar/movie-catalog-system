import React, { useState, useEffect } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Default to null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser)); // Parse and set user from localStorage
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user'); // Clear invalid data
            }
        }
        setLoading(false);
    }, []);

    const logoutUser = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logoutUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;