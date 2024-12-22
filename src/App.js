import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import AdminResetPassword from "./Components/AdminResetPassword";
import Client from "./Components/Client";
import Employee from "./Components/Employee";
import Department from "./Components/Department";
import JobRole from "./Components/JobRole";
import ClientAssign from "./Components/EmployeeRoleAssign";
import AssignedEmployee from "./Components/AssignedEmployee";
import PrivateRoute from "./Components/PrivateRoute";
import EmployeeJobLocation from "./Components/EmployeeJobLocation";
import EmployeeSalary from "./Components/EmployeeSalary";
import EmployeeSalaryForm from "./Components/EmployeeSalaryForm";
import MainLayout from "./Components/Layout/MainLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./Components/Dashboard";

const App = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={<Login SetUserName={setUserName} SetEmail={setEmail} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<AdminResetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/clients"
            element={
              <MainLayout>
                <Client />
              </MainLayout>
            }
          />
          <Route
            path="/employees"
            element={
              <MainLayout>
                <Employee />
              </MainLayout>
            }
          />
          <Route
            path="/department"
            element={
              <MainLayout>
                <Department />
              </MainLayout>
            }
          />
          <Route
            path="/jobRole"
            element={
              <MainLayout>
                <JobRole />
              </MainLayout>
            }
          />
          <Route
            path="/employee-role-assign"
            element={
              <MainLayout>
                <ClientAssign />
              </MainLayout>
            }
          />
          <Route
            path="/assigned-employee"
            element={
              <MainLayout>
                <AssignedEmployee />
              </MainLayout>
            }
          />
          <Route
            path="/employee-job-locations"
            element={
              <MainLayout>
                <EmployeeJobLocation />
              </MainLayout>
            }
          />
          <Route
            path="/salaries"
            element={
              <MainLayout>
                <EmployeeSalary />
              </MainLayout>
            }
          />
          <Route
            path="/salary/create"
            element={
              <MainLayout>
                <EmployeeSalaryForm />
              </MainLayout>
            }
          />
          <Route
            path="/salary/edit/:id"
            element={
              <MainLayout>
                <EmployeeSalaryForm />
              </MainLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
