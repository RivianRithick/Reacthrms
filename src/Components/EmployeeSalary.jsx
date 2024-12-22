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
                    paddingTop: '2rem',
                    paddingBottom: '2rem',
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
                head: {
                    backgroundColor: 'rgba(245, 247, 255, 0.95)',
                    fontWeight: 600,
                    color: '#3D52A0',
                    borderBottom: '2px solid',
                    borderColor: 'rgba(61, 82, 160, 0.1)',
                },
                root: {
                    borderColor: 'rgba(61, 82, 160, 0.08)',
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
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            textAlign: "center", 
                            color: "primary.main",
                            marginBottom: 4
                        }}
                    >
                        Employee Salary Management
                    </Typography>

                    <ToastContainer />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Search Section */}
                        <Paper 
                            elevation={0}
                            sx={{ 
                                backgroundColor: 'background.paper',
                                borderRadius: 3,
                                p: 3,
                                mb: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 3,
                                    color: 'text.primary',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&::after': {
                                        content: '""',
                                        flex: 1,
                                        height: '2px',
                                        background: 'linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0))',
                                        ml: 2
                                    }
                                }}
                            >
                                <SearchIcon sx={{ color: 'primary.main' }} />
                                Search Salary Records
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="Search salary records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'background.paper',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'background.paper',
                                            '& fieldset': {
                                                borderWidth: '2px',
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    },
                                }}
                            />
                        </Paper>

                        {/* Salary Records List */}
                        <Paper 
                            elevation={0}
                            sx={{ 
                                backgroundColor: 'background.paper',
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box sx={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                p: 3,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: 'text.primary',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <PaymentIcon sx={{ color: 'primary.main' }} />
                                        Salary Records
                                    </Typography>
                                    <Chip 
                                        label={`Total: ${filteredSalaries.length}`}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: 'primary.light',
                                            color: 'primary.main',
                                            fontWeight: 500,
                                        }}
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/salary/create')}
                                    startIcon={<AddIcon />}
                                >
                                    Add Salary Record
                                </Button>
                            </Box>

                            {isLoading ? (
                                <Box sx={{ 
                                    display: "flex", 
                                    justifyContent: "center", 
                                    alignItems: "center",
                                    minHeight: "400px",
                                    flexDirection: 'column',
                                    gap: 2
                                }}>
                                    <CircularProgress size={48} thickness={4} />
                                    <Typography variant="body1" color="text.secondary">
                                        Loading salary records...
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer 
                                    sx={{ 
                                        maxHeight: 'calc(100vh - 50px)',
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                            height: '8px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            borderRadius: '4px',
                                        },
                                    }}
                                >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ 
                                                    backgroundColor: 'background.paper',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.light',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <MoneyIcon sx={{ color: 'primary.main' }} />
                                                        Basic
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    backgroundColor: 'background.paper',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.light',
                                                }}>HRA</TableCell>
                                                <TableCell sx={{ 
                                                    backgroundColor: 'background.paper',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.light',
                                                }}>Gross</TableCell>
                                                <TableCell sx={{ 
                                                    backgroundColor: 'background.paper',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.light',
                                                }}>Net Pay</TableCell>
                                                <TableCell sx={{ 
                                                    backgroundColor: 'background.paper',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.light',
                                                }}>Currency</TableCell>
                                                <TableCell sx={{ 
                                                    backgroundColor: 'background.paper',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.light',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarIcon sx={{ color: 'primary.main' }} />
                                                        Effective Date
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    backgroundColor: 'background.paper',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.light',
                                                }}>Actions</TableCell>
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
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            <Typography variant="h6" gutterBottom>
                                                                No salary records available
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Try adjusting your search criteria or add a new salary record
                                                            </Typography>
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
                                                                    backgroundColor: 'action.hover',
                                                                },
                                                                '&:hover': {
                                                                    backgroundColor: 'action.selected',
                                                                },
                                                                transition: 'background-color 0.2s ease-in-out',
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <MoneyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                                                    {formatCurrency(salary.basic, salary.currency)}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>{formatCurrency(salary.hra, salary.currency)}</TableCell>
                                                            <TableCell>{formatCurrency(salary.gross, salary.currency)}</TableCell>
                                                            <TableCell>{formatCurrency(salary.netPay, salary.currency)}</TableCell>
                                                            <TableCell>
                                                                <Chip 
                                                                    label={salary.currency}
                                                                    size="small"
                                                                    sx={{ 
                                                                        backgroundColor: 'primary.light',
                                                                        color: 'primary.main',
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
                                                                <Box sx={{ display: "flex", gap: 1 }}>
                                                                    <IconButton
                                                                        color="primary"
                                                                        onClick={() => navigate(`/salary/edit/${salary.id}`)}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: 'primary.light',
                                                                            color: 'primary.main',
                                                                            '&:hover': {
                                                                                backgroundColor: 'primary.main',
                                                                                color: 'white',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={() => handleDelete(salary.id)}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: 'error.light',
                                                                            color: 'error.main',
                                                                            '&:hover': {
                                                                                backgroundColor: 'error.main',
                                                                                color: 'white',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
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
                    </motion.div>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                width: '100%',
                                maxWidth: 400,
                            }
                        }}
                    >
                        <DialogTitle sx={{ 
                            pb: 1,
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <DeleteIcon />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete this salary record? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                                onClick={() => setDeleteDialogOpen(false)}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={confirmDelete}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </motion.div>
            </Container>
        </ThemeProvider>
    );
});

export default EmployeeSalary; 