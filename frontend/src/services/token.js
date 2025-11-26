import { jwtDecode } from "jwt-decode";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";


export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) sessionStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) sessionStorage.setItem(REFRESH_KEY, refreshToken);
};


export const getAccessToken = () => sessionStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => sessionStorage.getItem(REFRESH_KEY);

// SỬA: Xóa trong sessionStorage
export const clearTokens = () => {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
};


export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};


export const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now;
};