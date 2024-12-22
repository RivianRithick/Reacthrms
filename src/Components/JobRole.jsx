import React, { useState, useCallback, useMemo } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { ToastContainer, toast } from "react-toastify";
import useDebounce from '../hooks/useDebounce';
import useJobRoleData from '../hooks/useJobRoleData';
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Container,
  InputAdornment,
  Chip,
  IconButton,
} from "@mui/material";
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
  Work as WorkIcon,
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

const JobRole = React.memo(() => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobRoleToDelete, setJobRoleToDelete] = useState(null);
  const [selectedJobRole, setSelectedJobRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobRole, setJobRole] = useState({
    title: "",
    departmentId: "",
    jobRoleCode: "",
  });

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use job role data hook with caching
  const { 
    jobRoles, 
    departments,
    isLoading, 
    error, 
    addJobRole, 
    updateJobRole, 
    deleteJobRole 
  } = useJobRoleData(debouncedSearchQuery);

  // Memoize handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setJobRole(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!jobRole.title || !jobRole.departmentId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (selectedJobRole) {
        await updateJobRole.mutateAsync({ id: selectedJobRole.id, ...jobRole });
        toast.success("Job role updated successfully!");
      } else {
        await addJobRole.mutateAsync(jobRole);
        toast.success("Job role created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving job role:", error);
      toast.error("Failed to save job role. Please try again.");
    }
  }, [jobRole, selectedJobRole, updateJobRole, addJobRole]);

  const handleEdit = useCallback((role) => {
    setSelectedJobRole(role);
    setJobRole({
      title: role.title,
      departmentId: role.departmentId,
      jobRoleCode: role.jobRoleCode
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setJobRoleToDelete(id);
    setDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!jobRoleToDelete) return;
    try {
      await deleteJobRole.mutateAsync(jobRoleToDelete);
      toast.success("Job role deleted successfully.");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting job role:", error);
      toast.error("Failed to delete job role. Please try again.");
    }
  }, [jobRoleToDelete, deleteJobRole]);

  const resetForm = useCallback(() => {
    setJobRole({ title: "", departmentId: "", jobRoleCode: "" });
    setSelectedJobRole(null);
    setShowForm(false);
  }, []);

  // Memoize filtered job roles
  const filteredJobRoles = useMemo(() => {
    if (!jobRoles) return [];
    return jobRoles.filter(
      (role) =>
        role.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        role.departmentName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [jobRoles, debouncedSearchQuery]);

  if (error) {
    toast.error("Error loading job roles.");
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
            Job Role Management
          </Typography>

          <ToastContainer />

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
                Loading job roles...
              </Typography>
            </Box>
          ) : showForm ? (
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
                    {selectedJobRole ? "Edit Job Role" : "Create Job Role"}
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Job Role Code"
                        name="jobRoleCode"
                        value={jobRole.jobRoleCode}
                        onChange={handleChange}
                        required
                        placeholder="Enter job role code (e.g., JR001)"
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
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="title"
                        value={jobRole.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter job title (e.g., Software Engineer)"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkIcon sx={{ color: 'text.secondary' }} />
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
                    <Grid item xs={12} md={4}>
                      <FormControl 
                        fullWidth 
                        required
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
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="departmentId"
                          value={jobRole.departmentId}
                          onChange={handleChange}
                          label="Department"
                          startAdornment={
                            <InputAdornment position="start">
                              <DomainIcon sx={{ color: 'text.secondary', ml: 1 }} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">
                            <em>Select Department</em>
                          </MenuItem>
                          {departments.map((department) => (
                            <MenuItem key={department.id} value={department.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DomainIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                {department.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                      disabled={!jobRole.title || !jobRole.departmentId}
                    >
                      {selectedJobRole ? "Update Job Role" : "Create Job Role"}
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
                  Search Job Roles
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Search by Job Title or Department Name..."
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

              {/* Job Roles List Section */}
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
                      <WorkIcon sx={{ color: 'primary.main' }} />
                      Job Roles List
                    </Typography>
                    <Chip 
                      label={`Total: ${filteredJobRoles.length}`}
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
                    Add Job Role
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
                        {['#', 'Job Role Code', 'Title', 'Department Name', 'Actions'].map((header) => (
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
                        {filteredJobRoles.length === 0 ? (
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
                                No job roles available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Try adjusting your search criteria or add a new job role
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredJobRoles.map((role, index) => (
                            <motion.tr
                              key={role.id}
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
                                  {role.jobRoleCode}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <WorkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {role.title}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DomainIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {role.departmentName || "N/A"}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(role)}
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
                                    onClick={() => handleDelete(role.id)}
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

export default JobRole;
