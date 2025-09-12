import React, { createContext, useState, useContext } from 'react';
 
const AuthContext = createContext(null);
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 
  const login = (userData) => {
    // Simulando login: se o usuário tem a role 'admin', nós o armazenamos
    if (userData.role === 'admin') {
      setUser(userData);
      // Em um app real, armazenaríamos o token no localStorage
    }
  };
 
  const logout = () => {
    setUser(null);
    // Limparia o token do localStorage
  };
 
  const isAdmin = user && user.role === 'admin';
 
  return (
<AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
</AuthContext.Provider>
  );
};
 
export const useAuth = () => useContext(AuthContext);