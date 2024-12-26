import React, { useState, useCallback, useMemo } from 'react';
import axiosInstance from '../apiService';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    MenuItem,
    Paper,
    Alert,
    Snackbar,
    Container,
    IconButton,
    InputAdornment,
    CircularProgress,
    Divider,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    AttachMoney as MoneyIcon,
    Home as HRAIcon,
    Work as WorkIcon,
    CardGiftcard as BonusIcon,
    AccountBalance as BankIcon,
    CalendarToday as CalendarIcon,
    Payment as PaymentIcon,
    CurrencyExchange as CurrencyIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSalaryData } from '../hooks/useSalaryData';

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
        success: {
            main: '#059669',
            light: '#34d399',
            dark: '#065f46',
        },
        warning: {
            main: '#d97706',
            light: '#fbbf24',
            dark: '#92400e',
        },
        error: {
            main: '#dc2626',
            light: '#f87171',
            dark: '#991b1b',
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
        h5: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h6: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #F5F7FF 0%, #E8ECFF 100%)',
                    minHeight: '100vh',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    color: '#FFFFFF',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    '&.MuiButton-outlined': {
                        background: 'transparent',
                        borderColor: '#3D52A0',
                        color: '#3D52A0',
                        '&:hover': {
                            background: 'rgba(61, 82, 160, 0.04)',
                            borderColor: '#2A3B7D',
                            transform: 'translateY(-1px)',
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
                    backdropFilter: 'blur(8px)',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                    border: '1px solid rgba(61, 82, 160, 0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
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
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#7091E6',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3D52A0',
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                    '&.MuiChip-filled': {
                        background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                        color: '#FFFFFF',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(61, 82, 160, 0.1)',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backdropFilter: 'blur(8px)',
                },
            },
        },
    },
});

const EmployeeSalaryForm = React.memo(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        basic: 0,
        hra: 0,
        workAllowance: 0,
        statutoryBonus: 0,
        gross: 0,
        employeePF: 0,
        employeeESIC: 0,
        companyContribution: 0,
        insurance: 0,
        ctc: 0,
        employerPF: 0,
        employerESI: 0,
        lwf: 0,
        pt: 0,
        totalDeduction: 0,
        netPay: 0,
        paymentFrequency: 'Monthly',
        currency: 'INR',
        effectiveDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    // Use salary data hook
    const {
        salaryDetails,
        isLoading,
        error: apiError,
        createSalary,
        updateSalary
    } = useSalaryData('', id);

    // Load salary details when available
    React.useEffect(() => {
        if (salaryDetails) {
            setFormData({
                ...salaryDetails,
                effectiveDate: salaryDetails.effectiveDate ? new Date(salaryDetails.effectiveDate).toISOString().split('T')[0] : '',
                endDate: salaryDetails.endDate ? new Date(salaryDetails.endDate).toISOString().split('T')[0] : ''
            });
        }
    }, [salaryDetails]);

    // Handler functions with useCallback
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const validateForm = useCallback(() => {
        const requiredFields = [
            'basic', 'hra', 'workAllowance', 'statutoryBonus', 
            'employeePF', 'employeeESIC', 'companyContribution', 
            'insurance', 'ctc', 'employerPF', 'employerESI', 
            'lwf', 'pt', 'paymentFrequency', 'currency', 'effectiveDate'
        ];

        for (const field of requiredFields) {
            if (!formData[field] && formData[field] !== 0) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }
        return true;
    }, [formData]);

    const validateDates = useCallback(() => {
        if (formData.endDate && formData.effectiveDate) {
            const startDate = new Date(formData.effectiveDate);
            const endDate = new Date(formData.endDate);
            if (endDate < startDate) {
                toast.error('End date cannot be earlier than effective date');
                return false;
            }
        }
        return true;
    }, [formData.endDate, formData.effectiveDate]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!validateDates()) return;
        
        try {
            const token = localStorage.getItem("token");
            let createdBy = "System";
            
            if (token) {
                const decodedToken = jwtDecode(token);
                createdBy = decodedToken?.FirstName || decodedToken?.Email || decodedToken?.email || "System";
            }

            const dataToSubmit = {
                ...formData,
                basic: parseFloat(formData.basic),
                hra: parseFloat(formData.hra),
                workAllowance: parseFloat(formData.workAllowance),
                statutoryBonus: parseFloat(formData.statutoryBonus),
                gross: parseFloat(formData.gross),
                employeePF: parseFloat(formData.employeePF),
                employeeESIC: parseFloat(formData.employeeESIC),
                companyContribution: parseFloat(formData.companyContribution),
                insurance: parseFloat(formData.insurance),
                ctc: parseFloat(formData.ctc),
                employerPF: parseFloat(formData.employerPF),
                employerESI: parseFloat(formData.employerESI),
                lwf: parseFloat(formData.lwf),
                pt: parseFloat(formData.pt),
                totalDeduction: parseFloat(formData.totalDeduction),
                netPay: parseFloat(formData.netPay),
                effectiveDate: formData.effectiveDate ? new Date(formData.effectiveDate + 'T12:00:00').toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate + 'T12:00:00').toISOString() : null,
                id: id ? parseInt(id) : undefined,
                createdBy: createdBy
            };
            
            if (id) {
                await updateSalary.mutateAsync(dataToSubmit);
            } else {
                await createSalary.mutateAsync(dataToSubmit);
            }

            toast.success(`Salary record ${id ? 'updated' : 'created'} successfully`, {
                autoClose: 2000,
                onClose: () => {
                    navigate('/salaries');
                }
            });
        } catch (err) {
            console.error('Error details:', err.response || err);
            const errorMessage = err.response?.data?.message || err.message || 'Operation failed';
            toast.error(errorMessage);
        }
    }, [formData, id, createSalary, updateSalary, navigate, validateForm, validateDates]);

    // Memoize calculations
    const calculateTotals = useCallback(() => {
        const gross = Number(formData.basic) + Number(formData.hra) + 
                     Number(formData.workAllowance) + Number(formData.statutoryBonus);
        
        const totalDeduction = Number(formData.employeePF) + Number(formData.employeeESIC) + 
                             Number(formData.pt) + Number(formData.lwf);
        
        const netPay = gross - totalDeduction;

        setFormData(prev => ({
            ...prev,
            gross,
            totalDeduction,
            netPay
        }));
    }, [formData.basic, formData.hra, formData.workAllowance, formData.statutoryBonus,
        formData.employeePF, formData.employeeESIC, formData.pt, formData.lwf]);

    React.useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: formData.currency,
        }).format(amount);
    }, [formData.currency]);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" sx={{ py: 2 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ 
                        mb: 3, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                onClick={() => navigate('/salaries')}
                                sx={{
                                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    color: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <PaymentIcon sx={{ fontSize: 40 }} />
                                {id ? 'Edit Salary Record' : 'Create New Salary Record'}
                            </Typography>
                        </Box>
                    </Box>

                    <ToastContainer />

                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: { xs: 2, sm: 3, md: 4 },
                            border: '1px solid',
                            borderColor: 'divider',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {isLoading ? (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                minHeight: 400,
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <CircularProgress 
                                    size={48} 
                                    thickness={4}
                                    sx={{
                                        color: 'primary.main',
                                        '& .MuiCircularProgress-circle': {
                                            strokeLinecap: 'round',
                                        }
                                    }}
                                />
                                <Typography variant="h6" color="primary">
                                    {id ? 'Loading salary record...' : 'Preparing form...'}
                                </Typography>
                            </Box>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    {/* Basic Salary Information */}
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            mb: 3,
                                            pb: 2,
                                            borderBottom: '2px solid',
                                            borderColor: 'rgba(61, 82, 160, 0.1)',
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <MoneyIcon />
                                                Basic Salary Information
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Basic Salary"
                                            name="basic"
                                            type="number"
                                            value={formData.basic}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MoneyIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="HRA"
                                            name="hra"
                                            type="number"
                                            value={formData.hra}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <HRAIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Work Allowance"
                                            name="workAllowance"
                                            type="number"
                                            value={formData.workAllowance}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <WorkIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Statutory Bonus"
                                            name="statutoryBonus"
                                            type="number"
                                            value={formData.statutoryBonus}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BonusIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Employee Contributions */}
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            mb: 3,
                                            mt: 4,
                                            pb: 2,
                                            borderBottom: '2px solid',
                                            borderColor: 'rgba(61, 82, 160, 0.1)',
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <BankIcon />
                                                Employee Contributions
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Employee PF"
                                            name="employeePF"
                                            type="number"
                                            value={formData.employeePF}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BankIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Employee ESIC"
                                            name="employeeESIC"
                                            type="number"
                                            value={formData.employeeESIC}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BankIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Employer Contributions */}
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            mb: 3,
                                            mt: 4,
                                            pb: 2,
                                            borderBottom: '2px solid',
                                            borderColor: 'rgba(61, 82, 160, 0.1)',
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <BankIcon />
                                                Employer Contributions
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Employer PF"
                                            name="employerPF"
                                            type="number"
                                            value={formData.employerPF}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BankIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Employer ESI"
                                            name="employerESI"
                                            type="number"
                                            value={formData.employerESI}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BankIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Other Details */}
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            mb: 3,
                                            mt: 4,
                                            pb: 2,
                                            borderBottom: '2px solid',
                                            borderColor: 'rgba(61, 82, 160, 0.1)',
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <PaymentIcon />
                                                Other Details
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="LWF"
                                            name="lwf"
                                            type="number"
                                            value={formData.lwf}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PaymentIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Professional Tax"
                                            name="pt"
                                            type="number"
                                            value={formData.pt}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PaymentIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Calculated Fields */}
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            mb: 3,
                                            mt: 4,
                                            pb: 2,
                                            borderBottom: '2px solid',
                                            borderColor: 'rgba(61, 82, 160, 0.1)',
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <MoneyIcon />
                                                Calculated Totals
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Gross Salary"
                                            value={formatCurrency(formData.gross)}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MoneyIcon sx={{ color: 'success.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Total Deductions"
                                            value={formatCurrency(formData.totalDeduction)}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MoneyIcon sx={{ color: 'error.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Net Pay"
                                            value={formatCurrency(formData.netPay)}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MoneyIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Payment Details */}
                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            mb: 3,
                                            mt: 4,
                                            pb: 2,
                                            borderBottom: '2px solid',
                                            borderColor: 'rgba(61, 82, 160, 0.1)',
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <PaymentIcon />
                                                Payment Details
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Payment Frequency"
                                            name="paymentFrequency"
                                            value={formData.paymentFrequency}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                            <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Currency"
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CurrencyIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="INR">INR</MenuItem>
                                            <MenuItem value="USD">USD</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Effective Date"
                                            name="effectiveDate"
                                            value={formData.effectiveDate}
                                            onChange={handleChange}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="End Date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            helperText="Optional: Leave blank for indefinite period"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarIcon sx={{ color: 'primary.main' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    background: 'rgba(255,255,255,0.9)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,1)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.08)',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ 
                                            mt: 4, 
                                            pt: 3,
                                            borderTop: '2px solid',
                                            borderColor: 'rgba(61, 82, 160, 0.1)',
                                            display: 'flex', 
                                            justifyContent: 'flex-end', 
                                            gap: 2 
                                        }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate('/salaries')}
                                                startIcon={<CancelIcon />}
                                                sx={{
                                                    borderWidth: '2px',
                                                    '&:hover': {
                                                        borderWidth: '2px',
                                                    },
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={isLoading}
                                                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                                    boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                                        boxShadow: '0 6px 16px rgba(61, 82, 160, 0.3)',
                                                    },
                                                    '&:disabled': {
                                                        background: 'rgba(0, 0, 0, 0.12)',
                                                    },
                                                }}
                                            >
                                                {isLoading ? 'Saving...' : (id ? 'Update' : 'Create')}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Paper>

                    <Snackbar 
                        open={!!apiError} 
                        autoHideDuration={6000} 
                        onClose={() => setError(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert 
                            severity="error" 
                            onClose={() => setError(null)}
                            sx={{ 
                                borderRadius: 2,
                                background: 'linear-gradient(145deg, #ef4444, #dc2626)',
                                color: 'white',
                                '& .MuiAlert-icon': {
                                    color: 'white',
                                },
                            }}
                        >
                            {apiError}
                        </Alert>
                    </Snackbar>
                </motion.div>
            </Container>
        </ThemeProvider>
    );
});

export default EmployeeSalaryForm; 