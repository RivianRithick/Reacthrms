import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios"; // Axios instance for API calls

const baseUrl = process.env.REACT_APP_BASE_URL;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Formik configuration for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // API call to send reset password email
        const response = await axios.post(`${baseUrl}/api/forgot-password`, values);

        if (response.status === 200) {
          toast.success(response.data?.message || "Reset password email sent!");
        } else {
          toast.error(response.data?.message || "Something went wrong, please try again.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An error occurred. Please try again.";
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
      <ToastContainer /> {/* For notifications */}
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
          Forgot Password
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            name="email"
            autoComplete="email"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Remembered your password?{" "}
          <Button
            variant="text"
            color="primary"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
