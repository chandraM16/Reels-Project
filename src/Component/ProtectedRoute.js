import React from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "./Context/GlobalContext";
const ProtectedRoute = ({ children }) => {
  const { user } = useGlobalContext();

  console.log("Check user in Private: ", user);
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
