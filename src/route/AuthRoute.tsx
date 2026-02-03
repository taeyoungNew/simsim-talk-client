import { JSX, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate, useNavigate } from "react-router-dom";

export default function AuthRoute({ children }: { children: JSX.Element }) {
  const { isLogin } = useSelector((state: RootState) => state.User);
  const isAuth = useSelector((state: RootState) => state.User.isLogin);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/login", { replace: true });
    }
  });
  if (!isLogin) {
    return <Navigate to="/login" replace></Navigate>;
  }

  return children;
}
