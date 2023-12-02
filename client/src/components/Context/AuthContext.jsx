import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [headers, setHeaders] = useState(false);

  useEffect(() => {
    // Check if the token is present in cookies
    const token = cookies["token"];
    if (token) {
      // Token exists, user is logged in
      setIsLoggedIn(true);
      setHeaders({ "authorization": token });
    } else {
      // Token does not exist, user is not logged in
      setIsLoggedIn(false);
    }
  }, [cookies]);

  const login = (token) => {
    setCookie("token", token, { path: "/" });
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    setIsLoggedIn(false);
  };

  const onLogin = (role) => {
    if (role) {
      setIsAdmin(true);
      setCookie("isAdmin", true, { path: "/" });
    } else {
      setIsAdmin(false);
    }
  };

  const authContextValue = {
    isLoggedIn,
    headers,
    isAdmin,
    onLogin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};