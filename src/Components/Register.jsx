import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Box, Button, TextField, CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../apiService"; // Import your Axios instance
import "react-toastify/dist/ReactToastify.css";
import "./Styles/Form.css";

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/employees", { replace: true });
        }
    }, [navigate]);

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .matches(/^[A-Za-z\s-]{2,30}$/, "First name must be 2-30 characters and contain only alphabets, spaces, or hyphens.")
            .required("First name is required"),
        lastName: Yup.string()
            .matches(/^[A-Za-z\s-]{2,30}$/, "Last name must be 2-30 characters and contain only alphabets, spaces, or hyphens.")
            .required("Last name is required"),
        email: Yup.string().email("Enter a valid email address").required("Email is required"),
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
            )
            .required("Password is required"),
        confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
        contact: Yup.string().matches(/^\d{10}$/, "Contact number must be 10 digits.").required("Contact number is required"),
    });

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            ...values,
            contact: `+91${values.contact.trim()}`, // Ensure contact has the +91 prefix
        };

        try {
            // Use axiosInstance to make the POST request
            const response = await axiosInstance.post("/api/admin-registration/create", payload);
            toast.success("Registration successful!");
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
            toast.error(errorMessage);

            if (error.response?.data?.errors) {
                // Set formik errors dynamically if server provides field-specific errors
                const { errors } = error.response.data;
                Object.keys(errors).forEach((key) => {
                    formik.setFieldError(key, errors[key][0]);
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            contact: "",
            roleId: 1,
        },
        validationSchema,
        onSubmit,
    });

    const renderTextField = (name, label, type = "text", adornment = false) => (
        <TextField
            fullWidth
            id={name}
            name={name}
            label={label}
            margin="normal"
            variant="outlined"
            type={type}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            InputProps={adornment ? { startAdornment: "+91 " } : null}
        />
    );

    return (
        <Box
            className="register-container"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f4f4f9",
                padding: "20px",
            }}
        >
            <ToastContainer />
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    padding: "30px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    {renderTextField("firstName", "First Name")}
                    {renderTextField("lastName", "Last Name")}
                    {renderTextField("email", "Email")}
                    {renderTextField("password", "Password", "password")}
                    {renderTextField("confirmPassword", "Confirm Password", "password")}
                    {renderTextField("contact", "Contact", "text", true)}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                    </Button>
                </form>
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <Typography variant="body2">
                        Already registered?{" "}
                        <Link to="/login" style={{ color: "#6c63ff", textDecoration: "none" }}>
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
