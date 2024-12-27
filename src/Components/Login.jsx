import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Link,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apiService";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Roles } from '../utils/rbac';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3D52A0',
      light: '#7091E6',
      dark: '#8697C4',
    },
    secondary: {
      main: '#ADBBDA',
      light: '#EDE8F5',
      dark: '#5F739C',
    },
    background: {
      default: '#F5F7FF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            '&:hover fieldset': {
              borderColor: '#7091E6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3D52A0',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const endpoint = values.role === 'OnboardingManager' 
          ? '/api/OnboardingManager/login'
          : '/api/admin-login';

        console.log('Sending request to:', endpoint, 'with data:', {
          email: values.email,
          password: '***'
        });

        const response = await axiosInstance.post(endpoint, {
          email: values.email,
          password: values.password,
        });

        console.log('Full response:', response);

        if (response.data?.statusCode === 200 && response.data?.status === "Success") {
          const { accessToken, refreshToken, role } = response.data?.data || {};
          console.log('Response data:', response.data?.data);

          if (accessToken && refreshToken) {
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("username", values.email);
            localStorage.setItem("email", values.email);

            if (values.role === 'OnboardingManager') {
              const { onboardingManagerId, firstName, lastName } = response.data.data;
              localStorage.setItem("userId", onboardingManagerId);
              localStorage.setItem("userRole", 'OnboardingManager');
              localStorage.setItem("role", Roles.ONBOARDING_MANAGER.toString());
              localStorage.setItem("userInfo", JSON.stringify({
                id: onboardingManagerId,
                firstName,
                lastName,
                email: values.email,
                role: values.role
              }));
            } else {
              // For Super Admin
              console.log('Admin Role from response:', role);
              // Store the numeric role value first
              localStorage.setItem("role", role.toString());
              // Then store the role name
              localStorage.setItem("userRole", 'SuperAdmin');
              localStorage.setItem("userInfo", JSON.stringify({
                email: values.email,
                role: 'SuperAdmin'
              }));
            }

            toast.success("Login successful!");
            setTimeout(() => navigate("/employees", { replace: true }), 1000);
          } else {
            console.error('Missing tokens in response:', response.data);
            toast.error("Login failed. No tokens received.");
          }
        } else {
          console.error('Login failed with response:', response.data);
          toast.error(response.data?.message || "Login failed");
        }
      } catch (error) {
        console.error('Login error details:', {
          error: error,
          response: error.response,
          data: error.response?.data,
          status: error.response?.status,
          message: error.message
        });
        const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container 
        component="main" 
        maxWidth={false}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F5F7FF 0%, #E8ECFF 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'radial-gradient(circle at 50% 0%, rgba(112, 145, 230, 0.1) 0%, rgba(61, 82, 160, 0) 70%)',
            pointerEvents: 'none',
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(61, 82, 160, 0.2)',
                }}
              >
                <LockOutlinedIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
            </motion.div>

            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                mb: 4,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Welcome Back
            </Typography>

            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <InputLabel>Select Role</InputLabel>
                <Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  label="Select Role"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Select a role</em>
                  </MenuItem>
                  <MenuItem value="SuperAdmin">Super Admin</MenuItem>
                  <MenuItem value="OnboardingManager">Onboarding Manager</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                    {formik.errors.role}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Container>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
};

export default Login;
