import React, { useState, useEffect } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        isAdmin: false,
    });

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          setUser(JSON.parse(storedUser));
      }
      console.log('User initialized:', storedUser);
  }, []);

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: false,
        });
    };

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;