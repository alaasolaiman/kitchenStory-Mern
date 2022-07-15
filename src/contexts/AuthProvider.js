import { useContext, createContext, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const callRefresh = () => {
        // const time = JSON.parse(localStorage.getItem("timeToCallToken"));
        // setTimeout(() => {
      const instance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
      });
        // console.log(time);
        instance.get("/token/refresh");
        // callRefresh(time)
    // }, time);
  };

  return (
    <AuthContext.Provider value={{ callRefresh: callRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
