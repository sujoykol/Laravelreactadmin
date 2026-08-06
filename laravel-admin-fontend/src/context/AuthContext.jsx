import { createContext, useState } from "react";
import { loginUser, changePassword } from "../services/authService";
import { setToken, clearToken } from "../utils/storage";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {

        const data = await loginUser({
            email,
            password,
        });

        // Store access & refresh tokens
        setToken(
            data.access_token,
            data.refresh_token
        );

        // Store user
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        // Store roles
        localStorage.setItem(
            "roles",
            JSON.stringify(data.roles || [])
        );

        // Store permissions
        localStorage.setItem(
            "permissions",
            JSON.stringify(data.permissions || [])
        );

        setUser(data.user);

        return data;
    };

    const logout = () => {

        clearToken();

        setUser(null);

    };

    const changeUserPassword = async (
        currentPassword,
        newPassword,
        confirmPassword
    ) => {

        try {

            const response = await changePassword({
                old_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            toast.success(
                response.message || "Password changed successfully"
            );

            return {
                success: true,
                data: response,
            };

        } catch (error) {

            const response = error.response?.data;

            if (response?.errors) {

                Object.values(response.errors).forEach((messages) => {
                    toast.error(messages[0]);
                });

            } else if (response?.message) {

                toast.error(response.message);

            } else {

                toast.error("Failed to change password");

            }

            return {
                success: false,
                error: response,
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                changeUserPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}