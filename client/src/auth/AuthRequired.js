import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

export default function AuthRequired({ children }) {

  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/accounts/login" replace={true} />
  }

  return children;
}