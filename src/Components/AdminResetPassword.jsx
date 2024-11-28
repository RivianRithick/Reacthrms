import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../apiService"; // Import the centralized Axios instance
import "./Styles/Form.css";

const AdminResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const token = searchParams.get("token");
const email = searchParams.get("email");

useEffect(() => {
  if (!token || !email) {
    toast.error("Invalid or expired reset link.");
    setTimeout(() => navigate("/login", { replace: true }), 3000);
  }
}, [token, email, navigate]);

    const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
    
        // Log the token and email for debugging
        console.log("Token being sent:", token);
        console.log("Email being sent:", email);
    
        const response = await axiosInstance.post("/api/reset-password", {
          token,
          email,
          password: values.password,
          confirmpassword: values.confirmPassword,
        });
    
        if (response.status === 200) {
          toast.success("Password reset successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An error occurred. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  });
  return (
    <div className="container">
      <div className="form-wrapper">
        <form onSubmit={formik.handleSubmit} className="form-box">
          <h2 className="form-title">Reset Password</h2>

          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter new password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="errors">
                <span className="text-danger">{formik.errors.password}</span>
              </div>
            )}
          </div>

          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="errors">
                <span className="text-danger">{formik.errors.confirmPassword}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn solid" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
