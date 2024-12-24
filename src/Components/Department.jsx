import React, { useState, useCallback, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
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
  Cancel as CancelIcon,
  SearchOff as SearchOffIcon,
  Tag as TagIcon,
  Settings as SettingsIcon,
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
            {!showForm && (
              <>
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
                    <DomainIcon sx={{ fontSize: 40 }} />
                    Department Management
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      icon={<DomainIcon />}
                      label={`Total Records: ${filteredDepartments.length}`}
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
                    placeholder="Search by Department Name..."
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
                    onClick={() => setShowForm(true)}
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
                    Add New Department
                  </Button>
                </Paper>
              </>
            )}
          </Box>

          <ToastContainer />

          {showForm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  p: { xs: 2, sm: 3, md: 4 },
                  maxWidth: 800,
                  margin: '0 auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <IconButton
                    onClick={resetForm}
                    sx={{
                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CancelIcon />
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
                    <DomainIcon sx={{ fontSize: 40 }} />
                    {selectedDepartment ? "Edit Department" : "Create Department"}
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
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
                          <DomainIcon />
                          Department Details
                        </Typography>
                      </Box>
                    </Grid>

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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon sx={{ color: 'primary.main' }} />
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
                        placeholder="Enter department code"
                        error={touched.departmentCode && !department.departmentCode}
                        helperText={touched.departmentCode && !department.departmentCode ? "Department code is required" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CodeIcon sx={{ color: 'primary.main' }} />
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Department Name"
                        name="name"
                        value={department.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        required
                        placeholder="Enter department name"
                        error={touched.name && !department.name}
                        helperText={touched.name && !department.name ? "Department name is required" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DomainIcon sx={{ color: 'primary.main' }} />
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
                          onClick={resetForm}
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
                          disabled={!department.clientRegistrationId || !department.name || !department.departmentCode}
                          startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
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
                          {isLoading ? 'Saving...' : (selectedDepartment ? 'Update Department' : 'Create Department')}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Departments List Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
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
                    py: 8,
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
                      Loading departments...
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                            fontWeight: 600,
                            color: 'primary.main',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TagIcon sx={{ color: 'primary.main' }} />
                              #
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                            fontWeight: 600,
                            color: 'primary.main',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CodeIcon sx={{ color: 'primary.main' }} />
                              Department Code
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                            fontWeight: 600,
                            color: 'primary.main',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DomainIcon sx={{ color: 'primary.main' }} />
                              Name
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                            fontWeight: 600,
                            color: 'primary.main',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon sx={{ color: 'primary.main' }} />
                              Client
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
                          {filteredDepartments.length === 0 ? (
                            <TableRow>
                              <TableCell 
                                colSpan={5} 
                                align="center"
                                sx={{ 
                                  py: 8,
                                  background: 'linear-gradient(145deg, rgba(245,247,255,0.5), rgba(232,236,255,0.5))'
                                }}
                              >
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                  <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                  <Typography variant="h6" gutterBottom color="primary">
                                    No departments found
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Try adjusting your search criteria or add a new department
                                  </Typography>
                                </Box>
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
                                    <TagIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                    {index + 1}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CodeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                    {department.departmentCode}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DomainIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                    {department.name}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                    {clients.find(c => c.id === (department.clientRegistrationId || department.clientId))?.name || 'N/A'}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                                    <Tooltip title="Edit Department">
                                      <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(department)}
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
                                    <Tooltip title="Delete Department">
                                      <IconButton
                                        color="error"
                                        onClick={() => handleDelete(department.id)}
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
            </motion.div>
          )}
        </motion.div>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
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
              Are you sure you want to delete this department? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              variant="outlined"
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
      </Container>
    </ThemeProvider>
  );
});

export default Department;
