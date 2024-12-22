import React, { useState, useCallback, useMemo } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import { ToastContainer, toast } from 'react-toastify';
import useDebounce from '../hooks/useDebounce';
import useDepartmentData from '../hooks/useDepartmentData';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Container,
  InputAdornment,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  Domain as DomainIcon,
  Code as CodeIcon,
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

const baseUrl = process.env.REACT_APP_BASE_URL;

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

const Department = React.memo(() => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState({
    name: '',
    departmentCode: '',
    clientRegistrationId: ''
  });
  const [touched, setTouched] = useState({
    clientRegistrationId: false,
    departmentCode: false,
    name: false
  });

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use department data hook with caching
  const { 
    departments, 
    clients,
    isLoading, 
    error, 
    addDepartment, 
    updateDepartment, 
    deleteDepartment 
  } = useDepartmentData(debouncedSearchQuery);

  // Memoize handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDepartment(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!department.clientRegistrationId || !department.name || !department.departmentCode) {
      toast.error("Please fill in all required fields including client selection.");
      return;
    }

    try {
      if (selectedDepartment) {
        await updateDepartment.mutateAsync({
          id: selectedDepartment.id,
          ...department
        });
        toast.success("Department updated successfully!");
      } else {
        await addDepartment.mutateAsync(department);
        toast.success("Department created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error during department operation:", error);
      toast.error(`Operation failed: ${error.message}`);
    }
  }, [department, selectedDepartment, updateDepartment, addDepartment]);

  const handleEdit = useCallback((dept) => {
    setSelectedDepartment(dept);
    setDepartment({
      name: dept.name,
      departmentCode: dept.departmentCode,
      clientRegistrationId: dept.clientRegistrationId || dept.clientId
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setDepartmentToDelete(id);
    setDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!departmentToDelete) return;
    try {
      await deleteDepartment.mutateAsync(departmentToDelete);
      toast.success("Department deleted successfully!");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error(`Error: ${error.message}`);
    }
  }, [departmentToDelete, deleteDepartment]);

  const resetForm = useCallback(() => {
    setDepartment({ 
      name: "", 
      departmentCode: "",
      clientRegistrationId: "" 
    });
    setTouched({
      clientRegistrationId: false,
      departmentCode: false,
      name: false
    });
    setSelectedDepartment(null);
    setShowForm(false);
  }, []);

  // Memoize filtered departments
  const filteredDepartments = useMemo(() => {
    if (!departments) return [];
    return departments.filter((department) =>
      department.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [departments, debouncedSearchQuery]);

  if (error) {
    toast.error("Error loading departments.");
  }

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
            Department Management
          </Typography>

          <ToastContainer />

          {showForm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  maxWidth: 800,
                  margin: '0 auto',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  gap: 1
                }}>
                  <IconButton 
                    onClick={resetForm}
                    sx={{ mr: 1 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    {selectedDepartment ? "Edit Department" : "Create Department"}
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Client"
                        name="clientRegistrationId"
                        value={department.clientRegistrationId}
                        onChange={handleChange}
                        onBlur={() => handleBlur('clientRegistrationId')}
                        required
                        error={touched.clientRegistrationId && !department.clientRegistrationId}
                        helperText={touched.clientRegistrationId && !department.clientRegistrationId ? "Client is required" : ""}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderWidth: '2px',
                            },
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Client
                        </MenuItem>
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              {client.name} ({client.clientCode || 'No Code'})
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department Code"
                        name="departmentCode"
                        value={department.departmentCode}
                        onChange={handleChange}
                        onBlur={() => handleBlur('departmentCode')}
                        required
                        placeholder="Enter department code (e.g., DEP001)"
                        error={touched.departmentCode && !department.departmentCode}
                        helperText={touched.departmentCode && !department.departmentCode ? "Department code is required" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CodeIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department Name"
                        name="name"
                        value={department.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        required
                        placeholder="Enter department name (e.g., Human Resources)"
                        error={touched.name && !department.name}
                        helperText={touched.name && !department.name ? "Department name is required" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DomainIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ 
                    display: "flex", 
                    gap: 2, 
                    mt: 4,
                    justifyContent: 'flex-end'
                  }}>
                    <Button 
                      variant="outlined" 
                      onClick={resetForm}
                      startIcon={<ArrowBackIcon />}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      startIcon={<AddIcon />}
                      disabled={!department.clientRegistrationId || !department.name || !department.departmentCode}
                    >
                      {selectedDepartment ? "Update Department" : "Create Department"}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </motion.div>
          ) : (
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
                  Search Departments
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Search by Department Name..."
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

              {/* Departments List Section */}
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
                      <DomainIcon sx={{ color: 'primary.main' }} />
                      Departments List
                    </Typography>
                    <Chip 
                      label={`Total: ${filteredDepartments.length}`}
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
                    onClick={() => setShowForm(true)}
                    startIcon={<AddIcon />}
                  >
                    Add Department
                  </Button>
                </Box>

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
                        {['#', 'Department Code', 'Name', 'Client', 'Actions'].map((header) => (
                          <TableCell
                            key={header}
                            sx={{ 
                              backgroundColor: 'background.paper',
                              fontWeight: 600,
                              color: 'text.primary',
                              borderBottom: '2px solid',
                              borderColor: 'primary.light',
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <AnimatePresence>
                        {filteredDepartments.length === 0 ? (
                          <TableRow>
                            <TableCell 
                              colSpan={5} 
                              align="center"
                              sx={{ 
                                py: 8,
                                color: 'text.secondary',
                              }}
                            >
                              <Typography variant="h6" gutterBottom>
                                No departments available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Try adjusting your search criteria or add a new department
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDepartments.map((department, index) => (
                            <motion.tr
                              key={department.id}
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
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CodeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {department.departmentCode}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DomainIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {department.name}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <BusinessIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {clients.find(c => c.id === (department.clientRegistrationId || department.clientId))?.name || 'N/A'}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(department)}
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
                                    onClick={() => handleDelete(department.id)}
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
              </Paper>
            </motion.div>
          )}

          <ConfirmationDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={confirmDelete}
          />
        </motion.div>
      </Container>
    </ThemeProvider>
  );
});

export default Department;
