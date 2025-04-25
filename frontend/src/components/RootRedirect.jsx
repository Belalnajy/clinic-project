import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/Auth/useAuth";

const RootRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const validRoles = ["doctor", "secretary", "manager"];
  const role = validRoles.includes(user.role) ? user.role : "unauthorized";

  return <Navigate to={`/dashboard/${role}`} replace />;
};

export default RootRedirect;
