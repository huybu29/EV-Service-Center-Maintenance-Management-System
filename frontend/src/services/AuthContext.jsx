import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const [user, setUser] = useState(null);


  useEffect(() => {
 
    const token = localStorage.getItem("accessToken");
   
    const userInfo = token ? jwtDecode(token) : null;
   
    
    if (token) {
      axios
        .get(`http://localhost:8067/api/users/${userInfo.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          
        })
        .catch((err) => {
          console.error("Không thể lấy thông tin người dùng:", err);
          logout();
        });
    } else {
      
      setUser(null);
    }
  }, [isLoggedIn]);

  const login = (token, refreshToken) => {
  
    localStorage.setItem("accessToken", token);

    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    
    setIsLoggedIn(true);
  };

  const logout = () => {
   
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); 
    
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};