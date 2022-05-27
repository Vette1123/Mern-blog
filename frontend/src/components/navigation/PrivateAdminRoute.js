import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateAdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user?.isAdmin ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateAdminRoute;
