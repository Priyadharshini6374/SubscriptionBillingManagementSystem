import { Navigate, Outlet } from "react-router-dom";

function CustomerProtectedRoute() {
  const token = localStorage.getItem("customerToken");

  const user = JSON.parse(
    localStorage.getItem("customerUser") || "null"
  );

  // No customer login
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Only Customer can access these pages
  if (user.role !== "CUSTOMER") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default CustomerProtectedRoute;