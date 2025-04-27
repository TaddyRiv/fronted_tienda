import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // Si no hay token → redirige al login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay roles permitidos y el rol del user no está en la lista → acceso denegado
  if (allowedRoles && !allowedRoles.includes(user.rol_id)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
