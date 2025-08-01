import { Navigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const loginResponseData = JSON.parse(
    localStorage.getItem("loginResponse") || "{}"
  );

  const isAuthenticated =
    loginResponseData.username && loginResponseData.isCustomerExist;

  // return isAuthenticated ? children : <Navigate to="/login" replace />;
  return true ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
