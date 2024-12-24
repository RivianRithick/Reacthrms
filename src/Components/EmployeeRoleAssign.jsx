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
  FormControl,
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
  Tag as TagIcon,
  Email as EmailIcon,
  Settings as SettingsIcon,
  LocationOn as LocationOnIcon,
  Domain as DomainIcon,
  Phone as PhoneIcon,
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
    unassignRole,
    refetch
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
      // Force reload after successful unassignment
      window.location.reload();
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
      // Force reload after successful assignment
      window.location.reload();
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
                <BusinessCenterIcon sx={{ fontSize: 40 }} />
                Employee Role Assignment
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  icon={<BusinessCenterIcon />}
                  label={`Total Records: ${filteredEmployees.length}`}
                  color="primary"
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>
            </Box>

            {/* Search and Filters Section */}
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
                placeholder="Search by name or email..."
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
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{
                    background: 'rgba(255,255,255,0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '2px',
                    },
                  }}
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="notAssigned">Not Assigned</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Box>

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
                    Loading employee data...
                  </Typography>
                </Box>
              ) : filteredEmployees.length === 0 ? (
                <Box sx={{ 
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <SearchIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="h6" color="primary">
                    No employees found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria
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
                            <WorkIcon sx={{ color: 'primary.main' }} />
                            Employee Name
                          </Box>
                        </TableCell>
                        <TableCell sx={{ 
                          background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                          fontWeight: 600,
                          color: 'primary.main',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ color: 'primary.main' }} />
                            Contact
                          </Box>
                        </TableCell>
                        <TableCell sx={{ 
                          background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                          fontWeight: 600,
                          color: 'primary.main',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ color: 'primary.main' }} />
                            Location
                          </Box>
                        </TableCell>
                        <TableCell sx={{ 
                          background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                          fontWeight: 600,
                          color: 'primary.main',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ color: 'primary.main' }} />
                            Email
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ 
                          width: '200px',
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
                        {filteredEmployees.map((employee, index) => (
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
                                <Avatar 
                                  sx={{ 
                                    width: 32, 
                                    height: 32,
                                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                  }}
                                >
                                  {(employee.firstName?.[0] || '').toUpperCase()}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {`${employee.firstName || ""} ${employee.lastName || ""}`.trim() || "N/A"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                <Typography variant="body2">
                                  {employee.contact && employee.contact !== "N/A" ? (
                                    <Box component="span" sx={{ 
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      color: 'success.main',
                                      fontWeight: 500
                                    }}>
                                      {employee.contact}
                                    </Box>
                                  ) : (
                                    <Box component="span" sx={{ color: 'text.secondary' }}>
                                      Not Available
                                    </Box>
                                  )}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                <Typography variant="body2">
                                  {employee.presentDistrict && employee.presentDistrict !== "N/A" ? (
                                    <Box component="span" sx={{ 
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      color: 'warning.main',
                                      fontWeight: 500
                                    }}>
                                      {employee.presentDistrict}
                                    </Box>
                                  ) : (
                                    <Box component="span" sx={{ color: 'text.secondary' }}>
                                      Not Available
                                    </Box>
                                  )}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ color: 'info.main', fontSize: 20 }} />
                                <Typography variant="body2">
                                  {employee.email || "N/A"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
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
                                      minWidth: '90px',
                                      height: '32px',
                                      fontSize: '0.8125rem',
                                      padding: '4px 10px',
                                      background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                                      color: '#FFFFFF',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                                        transform: 'translateY(-1px)',
                                      },
                                      '&.Mui-disabled': {
                                        background: 'rgba(0, 0, 0, 0.12)',
                                        color: 'rgba(0, 0, 0, 0.26)',
                                      },
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
                                      minWidth: '90px',
                                      height: '32px',
                                      fontSize: '0.8125rem',
                                      padding: '4px 10px',
                                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                        transform: 'translateY(-1px)',
                                      },
                                    }}
                                  >
                                    Assign
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                          </motion.tr>
                        ))}
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
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(10px)',
              }}>
                {/* Fixed Header */}
                <Box sx={{ 
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                  }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 600, 
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      <BusinessCenterIcon />
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

                {/* Content */}
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        mb: 2,
                        pb: 1,
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
                          <BusinessCenterIcon />
                          Assignment Details
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Client
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedClientId}
                        onChange={(e) => handleClientChange(e.target.value)}
                        displayEmpty
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 250,
                            },
                          },
                        }}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessCenterIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              {`${client.name} (${client.clientCode || 'No Code'})`}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Department
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedDepartmentId}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        displayEmpty
                        disabled={!selectedClientId}
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 250,
                            },
                          },
                        }}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DomainIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              {`${department.name} (${department.departmentCode || 'No Code'})`}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Job Role
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedJobRoleId}
                        onChange={(e) => setSelectedJobRoleId(e.target.value)}
                        displayEmpty
                        disabled={!selectedDepartmentId}
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 250,
                            },
                          },
                        }}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <WorkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              {`${role.title} (${role.jobRoleCode || 'No Code'})`}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Location
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedLocationId}
                        onChange={(e) => setSelectedLocationId(e.target.value)}
                        displayEmpty
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 250,
                            },
                          },
                        }}
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
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              maxWidth: '100%',
                              overflow: 'hidden'
                            }}>
                              <LocationOnIcon sx={{ 
                                color: 'primary.main', 
                                fontSize: 20,
                                flexShrink: 0 
                              }} />
                              <Typography
                                noWrap
                                sx={{
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={`${location.city}, ${location.state}, ${location.country}${location.address ? ` - ${location.address}` : ''}`}
                              >
                                {`${location.city}, ${location.state}, ${location.country}`}
                                {location.address && ` - ${location.address}`}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Salary Structure
                      </InputLabel>
                      <Select
                        fullWidth
                        value={selectedSalaryId}
                        onChange={(e) => setSelectedSalaryId(e.target.value)}
                        displayEmpty
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 250,
                            },
                          },
                        }}
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
                          <MenuItem key={salary.id} value={salary.id} sx={{ py: 1 }}>
                            <Box sx={{ width: '100%' }}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 0.5
                                }}
                              >
                                <WorkIcon sx={{ fontSize: 20 }} />
                                {salary.title}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 2,
                                mt: 0.5,
                                backgroundColor: 'rgba(61, 82, 160, 0.04)',
                                borderRadius: 1,
                                p: 1
                              }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 0.5,
                                  color: 'success.main'
                                }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 500,
                                      color: 'text.secondary'
                                    }}
                                  >
                                    Gross: 
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: 'success.main'
                                    }}
                                  >
                                    {salary.currency} {salary.gross?.toLocaleString() || '0'}
                                  </Typography>
                                </Box>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 0.5,
                                  color: 'primary.main'
                                }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 500,
                                      color: 'text.secondary'
                                    }}
                                  >
                                    Net: 
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: 'primary.main'
                                    }}
                                  >
                                    {salary.currency} {salary.netPay?.toLocaleString() || '0'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Date of Joining
                      </InputLabel>
                      <TextField
                        fullWidth
                        type="date"
                        value={dateOfJoining}
                        onChange={(e) => setDateOfJoining(e.target.value)}
                        size="small"
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
                  p: 2,
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
                    disabled={!selectedClientId || !selectedDepartmentId || !selectedJobRoleId || !selectedLocationId || !selectedSalaryId || !dateOfJoining}
                    sx={{
                      py: 1,
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      '&.Mui-disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)',
                      },
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
