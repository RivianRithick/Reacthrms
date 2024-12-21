const protectedRoutes = [
  // ... other protected routes
  {
    path: '/employee-job-locations',
    element: <EmployeeJobLocation />,
    role: ['admin', 'hr'] // Adjust the roles according to your needs
  }
]; 