import React, { useState, useCallback, useMemo } from "react";
import useDebounce from '../hooks/useDebounce';
import useEmployeeRoleAssignData from '../hooks/useEmployeeRoleAssignData';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  Modal,
  Grid,
  InputLabel,
  FormHelperText,
  Container,
  Chip,
  IconButton,
  InputAdornment,
  Avatar,
  Fade,
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Work as WorkIcon,
  Close as CloseIcon,
  BusinessCenter as BusinessCenterIcon,
  PersonRemove as PersonRemoveIcon,
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
    MuiModal: {
      styleOverrides: {
        root: {
          '& .MuiBox-root': {
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(61, 82, 160, 0.08)',
            boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
          },
        },
      },
    },
  },
});

const baseUrl = process.env.REACT_APP_BASE_URL;

const EmployeeRoleAssign = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [loadingMap, setLoadingMap] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Modal and form state
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedJobRoleId, setSelectedJobRoleId] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedSalaryId, setSelectedSalaryId] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use employee role assign data hook
  const {
    employees = [],
    clients = [],
    departments = [],
    locations = [],
    salaries = [],
    isLoading,
    error: apiError,
    assignRole,
    unassignRole
  } = useEmployeeRoleAssignData(assignmentFilter, debouncedSearchQuery);

  // Memoize filtered employees
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    const searchLower = debouncedSearchQuery.toLowerCase();
    return employees.filter((employee) =>
      employee.firstName?.toLowerCase().includes(searchLower) ||
      employee.lastName?.toLowerCase().includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower)
    );
  }, [employees, debouncedSearchQuery]);

  // Memoize filtered departments based on selected client
  const filteredDepartments = useMemo(() => {
    if (!selectedClientId || !departments) return [];
    return departments.filter(dept => dept.clientId === selectedClientId);
  }, [departments, selectedClientId]);

  // Memoize job roles based on selected department
  const jobRoles = useMemo(() => {
    if (!selectedDepartmentId || !departments) return [];
    const department = departments.find(dept => dept.id === selectedDepartmentId);
    return department?.jobRoles || [];
  }, [departments, selectedDepartmentId]);

  // Handler functions with useCallback
  const handleOpenModal = useCallback((employeeId) => {
    setSelectedEmployeeId(employeeId);
    setSelectedClientId("");
    setSelectedDepartmentId("");
    setSelectedJobRoleId("");
    setSelectedLocationId("");
    setSelectedSalaryId("");
    setDateOfJoining("");
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEmployeeId(null);
    setSelectedClientId("");
    setSelectedDepartmentId("");
    setSelectedJobRoleId("");
    setSelectedLocationId("");
    setSelectedSalaryId("");
    setDateOfJoining("");
    setOpenModal(false);
  }, []);

  const updateLoadingMap = useCallback((id, isLoading) => {
    setLoadingMap(prev => ({
      ...prev,
      [id]: isLoading
    }));
  }, []);

  const handleUnassign = useCallback(async (employeeId) => {
    if (!employeeId) {
      setError("Invalid employee ID for unassigning.");
      return;
    }

    updateLoadingMap(employeeId, true);

    try {
      await unassignRole.mutateAsync({ EmployeeRoleAssignId: employeeId });
      setSuccessMessage("Unassigned successfully!");
    } catch (error) {
      setError(`Error in unassigning: ${error.message}`);
    } finally {
      updateLoadingMap(employeeId, false);
    }
  }, [unassignRole]);

  const handleAssignmentAction = useCallback(async () => {
    if (!selectedEmployeeId || !selectedClientId || !selectedDepartmentId || 
        !selectedJobRoleId || !selectedLocationId || !dateOfJoining || !selectedSalaryId) {
      setError("All fields are required for assignment.");
      return;
    }

    const formattedDate = new Date(dateOfJoining).toISOString().split('T')[0];

    const payload = {
      EmployeeRegistrationId: parseInt(selectedEmployeeId),
      ClientRegistrationId: parseInt(selectedClientId),
      DepartmentId: parseInt(selectedDepartmentId),
      JobRoleId: parseInt(selectedJobRoleId),
      JobLocationId: parseInt(selectedLocationId),
      SalaryId: parseInt(selectedSalaryId),
      DateOfJoining: formattedDate
    };

    try {
      await assignRole.mutateAsync(payload);
      setSuccessMessage("Assigned successfully!");
      handleCloseModal();
    } catch (error) {
      console.error('Assignment error:', error);
      setError(`Error in assignment: ${error.message}`);
    }
  }, [
    selectedEmployeeId,
    selectedClientId,
    selectedDepartmentId,
    selectedJobRoleId,
    selectedLocationId,
    selectedSalaryId,
    dateOfJoining,
    assignRole,
    handleCloseModal
  ]);

  const handleClientChange = useCallback((clientId) => {
    setSelectedClientId(clientId);
    setSelectedDepartmentId("");
    setSelectedJobRoleId("");
  }, []);

  const handleDepartmentChange = useCallback((departmentId) => {
    setSelectedDepartmentId(departmentId);
    setSelectedJobRoleId("");
  }, []);

  // Effect for handling messages timeout
  React.useEffect(() => {
    if (successMessage || error || apiError) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, apiError]);

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
            Employee Role Assignment
          </Typography>

          {/* Search and Filters Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
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
                <BusinessCenterIcon sx={{ color: 'primary.main' }} />
                Search & Filters
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      placeholder="Search by name or email..."
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
                  </motion.div>
                </Grid>

                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <InputLabel 
                      sx={{ 
                        mb: 1,
                        color: 'text.primary',
                        fontWeight: 500,
                        fontSize: '0.875rem'
                      }}
                    >
                      Assignment Status
                    </InputLabel>
                    <Select
                      value={assignmentFilter}
                      onChange={(e) => setAssignmentFilter(e.target.value)}
                      displayEmpty
                      fullWidth
                      sx={{
                        backgroundColor: 'background.paper',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <MenuItem value="all">All Employees</MenuItem>
                      <MenuItem value="assigned">Assigned</MenuItem>
                      <MenuItem value="notAssigned">Not Assigned</MenuItem>
                    </Select>
                  </motion.div>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Employees List Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Paper 
              elevation={0}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: 3,
                overflow: 'hidden',
                transform: 'translateZ(0)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(61, 82, 160, 0.03) 0%, rgba(112, 145, 230, 0.03) 100%)',
                  pointerEvents: 'none',
                }
              }}
            >
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'rgba(61, 82, 160, 0.1)',
                background: 'linear-gradient(to right, rgba(245, 247, 255, 0.8), rgba(232, 236, 255, 0.8))',
                backdropFilter: 'blur(8px)',
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <WorkIcon sx={{ color: '#3D52A0' }} />
                  Employees List
                  <Chip 
                    label={`Total: ${filteredEmployees.length}`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(61, 82, 160, 0.08)',
                      color: '#3D52A0',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: 'rgba(61, 82, 160, 0.2)',
                      '& .MuiChip-label': {
                        px: 2
                      }
                    }}
                  />
                </Typography>
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
                    Loading employee data...
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 'calc(100vh - 50px)' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          backgroundColor: 'rgba(245, 247, 255, 0.95)',
                          fontWeight: 600,
                          color: '#3D52A0',
                          borderBottom: '2px solid',
                          borderColor: 'rgba(61, 82, 160, 0.1)',
                        }}>#</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'rgba(245, 247, 255, 0.95)',
                          fontWeight: 600,
                          color: '#3D52A0',
                          borderBottom: '2px solid',
                          borderColor: 'rgba(61, 82, 160, 0.1)',
                        }}>First Name</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'rgba(245, 247, 255, 0.95)',
                          fontWeight: 600,
                          color: '#3D52A0',
                          borderBottom: '2px solid',
                          borderColor: 'rgba(61, 82, 160, 0.1)',
                        }}>Last Name</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'rgba(245, 247, 255, 0.95)',
                          fontWeight: 600,
                          color: '#3D52A0',
                          borderBottom: '2px solid',
                          borderColor: 'rgba(61, 82, 160, 0.1)',
                        }}>Email</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'rgba(245, 247, 255, 0.95)',
                          fontWeight: 600,
                          color: '#3D52A0',
                          borderBottom: '2px solid',
                          borderColor: 'rgba(61, 82, 160, 0.1)',
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <AnimatePresence>
                        {filteredEmployees.length === 0 ? (
                          <TableRow>
                            <TableCell 
                              colSpan={5} 
                              align="center"
                              sx={{ 
                                py: 8,
                                color: 'text.secondary',
                              }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                gap: 2
                              }}>
                                <Typography variant="h6" color="text.secondary">
                                  No employees found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Try adjusting your search or filters
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredEmployees.map((employee, index) => (
                            <motion.tr
                              key={employee.id}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              component={TableRow}
                              sx={{
                                '&:nth-of-type(odd)': {
                                  backgroundColor: 'rgba(245, 247, 255, 0.5)',
                                },
                                '&:nth-of-type(even)': {
                                  backgroundColor: '#ffffff',
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(61, 82, 160, 0.04)',
                                  transform: 'scale(1.001) translateZ(0)',
                                  boxShadow: '0 4px 20px rgba(61, 82, 160, 0.08)',
                                },
                                transition: 'all 0.2s ease-in-out',
                              }}
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 40, 
                                      height: 40,
                                      background: `linear-gradient(135deg, ${employee.firstName?.[0] ? '#3D52A0' : '#8697C4'}, ${employee.firstName?.[0] ? '#7091E6' : '#ADBBDA'})`,
                                      color: 'white',
                                      fontSize: '1rem',
                                      fontWeight: 600,
                                      boxShadow: '0 2px 8px rgba(61, 82, 160, 0.15)',
                                      border: '2px solid white',
                                    }}
                                  >
                                    {(employee.firstName?.[0] || '').toUpperCase()}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {employee.firstName}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {employee.lastName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {employee.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {employee.isAssigned ? (
                                  <Button
                                    variant="contained"
                                    onClick={() => handleUnassign(employee.id)}
                                    disabled={loadingMap[employee.id]}
                                    startIcon={loadingMap[employee.id] ? 
                                      <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 
                                      <PersonRemoveIcon />
                                    }
                                    sx={{
                                      background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                                      color: '#FFFFFF',
                                      borderRadius: '12px',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      padding: '10px 24px',
                                      boxShadow: 'none',
                                      minWidth: 'auto',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                                      },
                                      '&.Mui-disabled': {
                                        background: 'rgba(0, 0, 0, 0.12)',
                                        color: 'rgba(0, 0, 0, 0.26)',
                                      },
                                      transition: 'all 0.2s ease-in-out',
                                    }}
                                  >
                                    Unassign
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    onClick={() => handleOpenModal(employee.id)}
                                    startIcon={<AddIcon />}
                                    sx={{
                                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                                      },
                                      transition: 'all 0.2s ease-in-out',
                                    }}
                                  >
                                    Assign
                                  </Button>
                                )}
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

          {/* Assignment Modal */}
          <Modal 
            open={openModal} 
            onClose={handleCloseModal}
            closeAfterTransition
          >
            <Fade in={openModal}>
              <Box sx={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                maxWidth: '90%',
                maxHeight: '90vh',
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Fixed Header */}
                <Box sx={{ 
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <WorkIcon />
                      Assign Role
                    </Typography>
                    <IconButton 
                      onClick={handleCloseModal}
                      size="small"
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { 
                          backgroundColor: 'error.light',
                          color: 'error.main'
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Scrollable Content */}
                <Box sx={{ 
                  overflowY: 'auto',
                  p: 3,
                  flex: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: 'rgba(0,0,0,0.3)',
                    },
                  },
                }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Client
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedClientId}
                        onChange={(e) => handleClientChange(e.target.value)}
                        displayEmpty
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Select Client</MenuItem>
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {`${client.name} (${client.clientCode || 'No Code'})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Department
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedDepartmentId}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        displayEmpty
                        disabled={!selectedClientId} // Disable if no client is selected
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Select Department</MenuItem>
                        {filteredDepartments.map((department) => (
                          <MenuItem key={department.id} value={department.id}>
                            {`${department.name} (${department.departmentCode || 'No Code'})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Job Role
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedJobRoleId}
                        onChange={(e) => setSelectedJobRoleId(e.target.value)}
                        displayEmpty
                        disabled={!selectedDepartmentId}
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Select Job Role</MenuItem>
                        {jobRoles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {`${role.title} (${role.jobRoleCode || 'No Code'})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Location
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedLocationId}
                        onChange={(e) => setSelectedLocationId(e.target.value)}
                        displayEmpty
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Select Location</MenuItem>
                        {locations.map((location) => (
                          <MenuItem key={location.id} value={location.id}>
                            {`${location.city}, ${location.state}, ${location.country}`}
                            {location.address && ` - ${location.address}`} {/* Optional: Show address if available */}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Salary Structure
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedSalaryId}
                        onChange={(e) => setSelectedSalaryId(e.target.value)}
                        displayEmpty
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Select Salary Structure</MenuItem>
                        {salaries.map((salary) => (
                          <MenuItem 
                            key={salary.id} 
                            value={salary.id}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              padding: '10px'
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {`${salary.currency} ${salary.gross?.toLocaleString() || '0'} (${salary.paymentFrequency || 'Monthly'})`}
                              </Typography>
                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Basic: {salary.currency} {salary.basic?.toLocaleString() || '0'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    HRA: {salary.currency} {salary.hra?.toLocaleString() || '0'}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Gross: {salary.currency} {salary.gross?.toLocaleString() || '0'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Net Pay: {salary.currency} {salary.netPay?.toLocaleString() || '0'}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Typography variant="caption" sx={{ 
                                display: 'block', 
                                mt: 1,
                                color: 'info.main',
                                fontSize: '0.75rem'
                              }}>
                                Effective from: {new Date(salary.effectiveDate).toLocaleDateString()}
                                {salary.endDate && ` to ${new Date(salary.endDate).toLocaleDateString()}`}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        Select the salary structure for the employee
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Date of Joining
                      </InputLabel>
                      <TextField
                        fullWidth
                        type="date"
                        value={dateOfJoining}
                        onChange={(e) => setDateOfJoining(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.paper',
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Fixed Footer with Button */}
                <Box sx={{ 
                  p: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  borderBottomLeftRadius: 'inherit',
                  borderBottomRightRadius: 'inherit',
                }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAssignmentAction}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Assign Role
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>

          {/* Toast Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                  zIndex: 2000
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Paper>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                  zIndex: 2000
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'success.main',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="body2">{successMessage}</Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
});

export default EmployeeRoleAssign;
