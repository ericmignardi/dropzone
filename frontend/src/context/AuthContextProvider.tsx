import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { axiosInstance } from "../services/api";
import type { User, LoginData, RegisterData } from "../types/auth";
import { socket } from "../hooks/useSocket";

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const verify = async () => {
    setIsVerifying(true);
    try {
      const response = await axiosInstance.get("/auth/verify");
      if (response.status === 200) {
        setUser(response.data.user);
        if (!socket.connected) socket.connect();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsRegistering(true);
    try {
      const response = await axiosInstance.post("/auth/register", data);
      if (response.status === 201) {
        setUser(response.data.user);
        if (!socket.connected) socket.connect();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setIsRegistering(false);
    }
  };

  const login = async (data: LoginData) => {
    setIsLoggingIn(true);
    try {
      const response = await axiosInstance.post("/auth/login", data);
      if (response.status === 200) {
        setUser(response.data.user);
        if (!socket.connected) socket.connect();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.status === 200) {
        setUser(null);
        socket.disconnect();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const value = {
    user,
    verify,
    isVerifying,
    register,
    isRegistering,
    login,
    isLoggingIn,
    logout,
    isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
