'use client'; // Mark this as a Client Component
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, no user is logged in

  // Function to update the user's data
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Function to log out the user
  const logoutUser = () => {
    setUser(null); // Clear the user's data
    localStorage.removeItem('token'); // Remove the token from localStorage
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
