// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//     const login = (token, username, email) => {
//         localStorage.setItem('token', token);
//         localStorage.setItem('username', username);
//         localStorage.setItem('email', email);
//         setIsAuthenticated(true);
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('username');
//         localStorage.removeItem('email');
//         setIsAuthenticated(false); // Update authentication state
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };
