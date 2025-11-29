import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/authAPI";

export default function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        const performLogout = async () => {
            try {
                await authAPI.logout();
                navigate("/login");
            } catch (error) {
                console.error("Logout failed:", error);
                navigate("/login");
            }
        };
        performLogout();
    }, [navigate]);
  return null;
}