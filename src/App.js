import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword"; // Updated component name
import AdminResetPassword from "./Components/AdminResetPassword";
// import Register from "./Components/Register";
import Navbar from "./Components/Navbar";
import Client from "./Components/Client";
import Employee from "./Components/Employee";
import Department from "./Components/Department";
import JobRole from "./Components/JobRole";
import ClientAssign from "./Components/EmployeeRoleAssign";
import AssignedEmployee from "./Components/AssignedEmployee";
import PrivateRoute from "./Components/PrivateRoute";

const App = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Register />} /> */}
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={<Login SetUserName={setUserName} SetEmail={setEmail} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<AdminResetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          {/* <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          /> */}
          <Route
            path="/clients"
            element={
              <>
                <Navbar />
                <Client />
              </>
            }
          />
          <Route
            path="/employees"
            element={
              <>
                <Navbar />
                <Employee />
              </>
            }
          />
          <Route
            path="/department"
            element={
              <>
                <Navbar />
                <Department />
              </>
            }
          />
          <Route
            path="/jobRole"
            element={
              <>
                <Navbar />
                <JobRole />
              </>
            }
          />
          <Route
            path="/employee-role-assign"
            element={
              <>
                <Navbar />
                <ClientAssign />
              </>
            }
          />
          <Route
            path="/assigned-employee"
            element={
              <>
                <Navbar />
                <AssignedEmployee />
              </>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
