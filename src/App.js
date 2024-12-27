import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import MainLayout from "./Components/Layout/MainLayout";
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'notistack';
import 'react-toastify/dist/ReactToastify.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Lazy load components
const Login = lazy(() => import("./Components/Login"));
const OnboardingManagerLogin = lazy(() => import("./Components/OnboardingManagerLogin"));
const ForgotPassword = lazy(() => import("./Components/ForgotPassword"));
const AdminResetPassword = lazy(() => import("./Components/AdminResetPassword"));
const Client = lazy(() => import("./Components/Client"));
const Employee = lazy(() => import("./Components/Employee"));
const Department = lazy(() => import("./Components/Department"));
const JobRole = lazy(() => import("./Components/JobRole"));
const ClientAssign = lazy(() => import("./Components/EmployeeRoleAssign"));
const AssignedEmployee = lazy(() => import("./Components/AssignedEmployee"));
const PrivateRoute = lazy(() => import("./Components/PrivateRoute"));
const EmployeeJobLocation = lazy(() => import("./Components/EmployeeJobLocation"));
const EmployeeSalary = lazy(() => import("./Components/EmployeeSalary"));
const EmployeeSalaryForm = lazy(() => import("./Components/EmployeeSalaryForm"));
const Dashboard = lazy(() => import("./Components/Dashboard"));
const OnboardingManager = lazy(() => import("./Components/OnboardingManager"));
const Recruiter = lazy(() => import("./Components/Recruiter"));
const Unauthorized = lazy(() => import("./Components/Unauthorized"));

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: '#F5F7FF'
  }}>
    <div className="loading-spinner"></div>
  </div>
);

const App = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Router>
          <ToastContainer />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login SetUserName={setUserName} SetEmail={setEmail} />} />
              <Route path="/onboarding-manager/login" element={<OnboardingManagerLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<AdminResetPassword />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route
                  path="/dashboard"
                  element={
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/recruiters"
                  element={
                    <MainLayout>
                      <Recruiter />
                    </MainLayout>
                  }
                />
                <Route
                  path="/onboarding-managers"
                  element={
                    <MainLayout>
                      <OnboardingManager />
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
          </Suspense>
        </Router>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
