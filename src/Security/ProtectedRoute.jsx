import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {" "}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>{" "}
      </div>
    );
  }
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (
    allowedUserTypes.length > 0 &&
    !allowedUserTypes.includes(user.userType)
  ) {
    const redirectMap = {
      student: "/studentcontrolpanel",
      school: "/schoolcontrolpanel",
      admin: "/admincontrolpanel",
    };
    return <Navigate to={redirectMap[user.userType] || "/login"} replace />;
  }
  return children;
};
export default ProtectedRoute;
