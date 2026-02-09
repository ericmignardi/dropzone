import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Share } from "./pages/Share";
import { NotFound } from "./pages/NotFound";

export const App = () => {
  const { user, verify, isVerifying } = useAuth();

  useEffect(() => {
    verify();
  }, []);

  return (
    <div className="flex min-h-screen justify-center">
      {isVerifying && <div>Verifying user...</div>}
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/register"} element={<Register />} />
        <Route path={"/login"} element={user ? <Navigate to={"/dashboard"} /> : <Login />} />
        <Route path={"/dashboard"} element={user ? <Dashboard /> : <Navigate to={"/login"} />} />
        <Route path={"/share/:shortCode"} element={<Share />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};
