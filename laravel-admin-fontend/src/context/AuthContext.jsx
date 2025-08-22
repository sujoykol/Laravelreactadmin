import { createContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const login = async (email, password) => {
    const { data } = await axios.post(API_BASE_URL+"/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await axios.post(API_BASE_URL+"/logout", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully 👋");
  };

   const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const { data } = await axios.post(
        API_BASE_URL + "/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(data.message || "Password changed successfully ✅");
      return true; // ✅ success
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password ❌");
       return false; // ❌ failure
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

