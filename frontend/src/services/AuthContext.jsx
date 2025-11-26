import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("accessToken"));
  const [user, setUser] = useState(null);


  useEffect(() => {
 
    const token = sessionStorage.getItem("accessToken");
    
    if (token) {
      axios
        .get("http://localhost:8067/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          console.log(res.data);
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
  
    sessionStorage.setItem("accessToken", token);

    if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
    
    setIsLoggedIn(true);
  };

  const logout = () => {
    // 4. SỬA: Xóa khỏi sessionStorage
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken"); // Xóa cả refresh token nếu có
    
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};