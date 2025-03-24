import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }

  const { isLoading, isLoggedIn } = authContext;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;