import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apiService"; // Import the shared Axios instance

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to employees page if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/employees", { replace: true });
    }
  }, [navigate]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Use axiosInstance for the POST request
        const response = await axiosInstance.post("/api/admin-login", values);

        // Access the nested accessToken and refreshToken
        const accessToken = response.data?.data?.accessToken;
        const refreshToken = response.data?.data?.refreshToken;

        if (accessToken && refreshToken) {
          // Save tokens and user information to localStorage
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("username", values.email);
          localStorage.setItem("email", values.email);

          toast.success(response.data?.message || "Login successful!");
          setTimeout(() => navigate("/employees", { replace: true }), 1000); // Redirect to employees
        } else {
          toast.error("Login failed. No tokens received.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            name="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            name="password"
          />
          <Box textAlign="right" sx={{ mt: 1 }}>
  <Link
    component="button"
    variant="body2"
    sx={{ cursor: "pointer" }}
    onClick={() => navigate("/forgot-password")}
    type="button" // Add type="button" here
  >
    Forgot Password?
  </Link>
</Box>

<Button
  type="submit" // This ensures the button is for form submission
  fullWidth
  variant="contained"
  color="primary"
  sx={{ marginTop: 2 }}
  disabled={isLoading}
>
  {isLoading ? "Logging in..." : "Login"}
</Button>

        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Don't have an account?{" "}
          <Link href="/" underline="hover" sx={{ cursor: "pointer" }}>
            Create an account
          </Link>
        </Typography>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Login;
