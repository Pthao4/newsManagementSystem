import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth"

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu phân quyền
  if (roles && roles.length > 0) {
    const userRole = user.role || user.roles;
    
    const hasPermission = Array.isArray(userRole)
      ? userRole.some((r) => roles.includes(r))
      : roles.includes(userRole);

    if (!hasPermission) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
