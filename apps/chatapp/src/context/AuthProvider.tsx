/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { AuthAPI } from "@/lib/api";
import { User } from "@/utils/types";
import React, { useEffect } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: User | undefined;
  callVerifyToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userInfo: undefined,
  callVerifyToken: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User>();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleVerifyToken = useCallback(async () => {
    try {
      const res = await AuthAPI.verifyToken();
      if (res) {
        setLoggedIn(true);
        res.payload && setUserInfo(res.payload);
      }
    } catch (error: any) {
      Cookies.remove("userToken");
      toast.error(error.message);
      setUserInfo(undefined);
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    handleVerifyToken();
  }, [handleVerifyToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        callVerifyToken: handleVerifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
