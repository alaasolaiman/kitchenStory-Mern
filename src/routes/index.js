import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/Signup";
import Dashboard from "../pages/Dashboard";

const routes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Navigate to="/login" />}></Route>
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default routes;
