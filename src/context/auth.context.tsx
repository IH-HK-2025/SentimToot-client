import React, { useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Import the API URL from the environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Define the shape of the authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  logOutUser: () => void;
  authError: string | null;
}

// Define the shape of the user object
interface User {
  id: number;
  name: string;
  email: string;
}

// Create the AuthContext with an initial value of null (it will be provided later)
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Define props type for AuthProviderWrapper
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProviderWrapper: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const storeToken = (token: string) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      axios
        .get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          const userData: User = response.data;
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(userData);
        })
        .catch((error) => {
          if (error.response) {
            setAuthError(error.response.data.message);
          }
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProviderWrapper, AuthContext };
