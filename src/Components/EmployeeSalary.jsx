import React, { useState, useCallback, useMemo } from 'react';
import useDebounce from '../hooks/useDebounce';
import { useSalaryData } from '../hooks/useSalaryData';
import axiosInstance from '../apiService';
import { useNavigate } from 'react-router-dom';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Container,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    AttachMoney as MoneyIcon,
    AccountBalance as BankIcon,
    CalendarToday as CalendarIcon,
    Payment as PaymentIcon,
    Home as HomeIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
    Payments as PaymentsIcon,
    CurrencyExchange as CurrencyExchangeIcon,
    Settings as SettingsIcon,
    SearchOff as SearchOffIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

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
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(61, 82, 160, 0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
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
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    borderColor: 'rgba(61, 82, 160, 0.08)',
                },
                head: {
                    backgroundColor: 'rgba(245, 247, 255, 0.95)',
                    fontWeight: 600,
                    color: '#3D52A0',
                    borderBottom: '2px solid',
                    borderColor: 'rgba(61, 82, 160, 0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: 'rgba(245, 247, 255, 0.5)',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(61, 82, 160, 0.04)',
                        transform: 'scale(1.001) translateZ(0)',
                        boxShadow: '0 4px 20px rgba(61, 82, 160, 0.08)',
                    },
                    transition: 'all 0.2s ease-in-out',
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
    },
});

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            duration: 0.4,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
};

const EmployeeSalary = React.memo(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [salaryToDelete, setSalaryToDelete] = useState(null);
    const navigate = useNavigate();

    // Use debounced search query
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Use salary data hook
    const {
        salaries,
        isLoading,
        error,
        deleteSalary
    } = useSalaryData(debouncedSearchQuery);

    // Memoize filtered salaries
    const filteredSalaries = useMemo(() => {
        if (!salaries) return [];
        const searchLower = debouncedSearchQuery.toLowerCase();
        return salaries.filter(salary => 
            Object.values(salary).some(value => 
                String(value).toLowerCase().includes(searchLower)
            )
        );
    }, [salaries, debouncedSearchQuery]);

    // Handler functions with useCallback
    const handleDelete = useCallback((id) => {
        setSalaryToDelete(id);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        try {
            await deleteSalary.mutateAsync(salaryToDelete);
            toast.success('Salary record deleted successfully');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete salary record';
            toast.error(errorMessage);
        } finally {
            setDeleteDialogOpen(false);
            setSalaryToDelete(null);
        }
    }, [salaryToDelete, deleteSalary]);

    const formatCurrency = useCallback((amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" sx={{ py: 2 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ 
                        position: 'sticky',
                        top: 0,
                        zIndex: 1200,
                        backgroundColor: 'background.default',
                        pt: 2,
                        pb: 3,
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    color: "primary.main",
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <PaymentIcon sx={{ fontSize: 40 }} />
                                Employee Salary Management
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip
                                    icon={<MoneyIcon />}
                                    label={`Total Records: ${filteredSalaries.length}`}
                                    color="primary"
                                    sx={{ 
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                        '& .MuiChip-icon': { color: 'white' }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Search and Add Button Section */}
                        <Paper 
                            elevation={0}
                            sx={{ 
                                backgroundColor: 'background.paper',
                                borderRadius: 3,
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 20px rgba(61, 82, 160, 0.15)',
                            }}
                        >
                            <TextField
                                placeholder="Search salary records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ 
                                    flex: 1, 
                                    minWidth: '200px',
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255,255,255,0.9)',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                            <Button
                                variant="contained"
                                onClick={() => navigate('/salary/create')}
                                startIcon={<AddIcon />}
                                sx={{
                                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                    boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                        boxShadow: '0 6px 16px rgba(61, 82, 160, 0.3)',
                                    }
                                }}
                            >
                                Add New Salary Record
                            </Button>
                        </Paper>
                    </Box>

                    <ToastContainer />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Salary Records Table */}
                        <Paper 
                            elevation={0}
                            sx={{ 
                                backgroundColor: 'background.paper',
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                                height: 'calc(100vh - 200px)',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                                backdropFilter: 'blur(10px)',
                                mt: 2,
                            }}
                        >
                            {isLoading ? (
                                <Box sx={{ 
                                    display: "flex", 
                                    justifyContent: "center", 
                                    alignItems: "center",
                                    height: "100%",
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
                                        Loading salary records...
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer sx={{ height: '100%' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ 
                                                    background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <MoneyIcon sx={{ color: 'primary.main' }} />
                                                        Basic Salary
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <HomeIcon sx={{ color: 'primary.main' }} />
                                                        HRA
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <AccountBalanceWalletIcon sx={{ color: 'primary.main' }} />
                                                        Gross
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PaymentsIcon sx={{ color: 'primary.main' }} />
                                                        Net Pay
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CurrencyExchangeIcon sx={{ color: 'primary.main' }} />
                                                        Currency
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarIcon sx={{ color: 'primary.main' }} />
                                                        Effective Date
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ 
                                                    width: '120px',
                                                    background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                                        <SettingsIcon sx={{ color: 'primary.main' }} />
                                                        Actions
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <AnimatePresence>
                                                {filteredSalaries.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell 
                                                            colSpan={7} 
                                                            align="center"
                                                            sx={{ 
                                                                py: 8,
                                                                background: 'linear-gradient(145deg, rgba(245,247,255,0.5), rgba(232,236,255,0.5))'
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                                <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                                                <Typography variant="h6" gutterBottom color="primary">
                                                                    No salary records found
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Try adjusting your search criteria or add a new salary record
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredSalaries.map((salary) => (
                                                        <motion.tr
                                                            key={salary.id}
                                                            variants={itemVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="hidden"
                                                            component={TableRow}
                                                            sx={{
                                                                '&:nth-of-type(odd)': {
                                                                    backgroundColor: 'rgba(245, 247, 255, 0.5)',
                                                                },
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(61, 82, 160, 0.04)',
                                                                    transform: 'scale(1.001) translateZ(0)',
                                                                    boxShadow: '0 4px 20px rgba(61, 82, 160, 0.08)',
                                                                },
                                                                transition: 'all 0.2s ease-in-out',
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <MoneyIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                                                    {formatCurrency(salary.basic, salary.currency)}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <HomeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                                                    {formatCurrency(salary.hra, salary.currency)}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AccountBalanceWalletIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                                                    {formatCurrency(salary.gross, salary.currency)}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PaymentsIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                                                    {formatCurrency(salary.netPay, salary.currency)}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip 
                                                                    icon={<CurrencyExchangeIcon />}
                                                                    label={salary.currency}
                                                                    size="small"
                                                                    sx={{ 
                                                                        background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                                                        color: 'white',
                                                                        '& .MuiChip-icon': { color: 'white' }
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <CalendarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                                                    {new Date(salary.effectiveDate).toLocaleDateString()}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                                                                    <Tooltip title="Edit Record">
                                                                        <IconButton
                                                                            color="primary"
                                                                            onClick={() => navigate(`/salary/edit/${salary.id}`)}
                                                                            size="small"
                                                                            sx={{
                                                                                background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                                                                color: 'white',
                                                                                '&:hover': {
                                                                                    background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                                                                    transform: 'translateY(-2px)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Record">
                                                                        <IconButton
                                                                            color="error"
                                                                            onClick={() => handleDelete(salary.id)}
                                                                            size="small"
                                                                            sx={{
                                                                                background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                                                                                color: 'white',
                                                                                '&:hover': {
                                                                                    background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                                                                                    transform: 'translateY(-2px)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))
                                                )}
                                            </AnimatePresence>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>

                        {/* Delete Confirmation Dialog */}
                        <Dialog
                            open={deleteDialogOpen}
                            onClose={() => setDeleteDialogOpen(false)}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    width: '100%',
                                    maxWidth: 400,
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                }
                            }}
                        >
                            <DialogTitle sx={{ 
                                pb: 1,
                                color: 'error.main',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                borderBottom: '2px solid',
                                borderColor: 'error.light'
                            }}>
                                <DeleteIcon />
                                Confirm Deletion
                            </DialogTitle>
                            <DialogContent sx={{ mt: 2 }}>
                                <Typography>
                                    Are you sure you want to delete this salary record? This action cannot be undone.
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, pt: 0 }}>
                                <Button 
                                    onClick={() => setDeleteDialogOpen(false)}
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={confirmDelete}
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    sx={{
                                        background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </motion.div>
                </motion.div>
            </Container>
        </ThemeProvider>
    );
});

export default EmployeeSalary; 