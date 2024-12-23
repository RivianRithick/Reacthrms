import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Container,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useRecruiterData from '../hooks/useRecruiterData';
import useDebounce from '../hooks/useDebounce';
import ConfirmationDialog from './ConfirmationDialog';

// Theme configuration
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

const Recruiter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [deleteRemarks, setDeleteRemarks] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    isActive: true,
  });

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use recruiter data hook
  const {
    recruiters = [],
    isLoading,
    error,
    addRecruiter,
    updateRecruiter,
    deleteRecruiter,
  } = useRecruiterData(debouncedSearchQuery);

  // Memoize handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value,
    }));
  }, []);

  const handleOpenDialog = useCallback((recruiter = null) => {
    if (recruiter) {
      setSelectedRecruiter(recruiter);
      setFormData({
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        email: recruiter.email,
        phoneNumber: recruiter.phoneNumber,
        isActive: recruiter.isActive,
      });
    } else {
      setSelectedRecruiter(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedRecruiter(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      isActive: true,
    });
  }, []);

  const handleOpenDeleteDialog = useCallback((recruiter) => {
    setSelectedRecruiter(recruiter);
    setDeleteRemarks('');
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
    setSelectedRecruiter(null);
    setDeleteRemarks('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRecruiter) {
        await updateRecruiter.mutateAsync({
          id: selectedRecruiter.recruiterId,
          ...formData,
        });
        toast.success('Recruiter updated successfully!');
      } else {
        await addRecruiter.mutateAsync(formData);
        toast.success('Recruiter created successfully!');
      }
      handleCloseDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error processing request';
      if (error.response?.status === 409) {
        toast.error('Recruiter with this email already exists.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecruiter.mutateAsync({
        id: selectedRecruiter.recruiterId,
        remarks: deleteRemarks,
      });
      toast.success('Recruiter deleted successfully!');
      handleCloseDeleteDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting recruiter');
    }
  };

  // Memoize filtered recruiters
  const filteredRecruiters = useMemo(() => {
    return recruiters.filter(recruiter => {
      const searchMatch = !debouncedSearchQuery || 
        Object.values(recruiter)
          .join(' ')
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());

      const statusMatch = statusFilter === 'all' || 
        (statusFilter === 'active' && recruiter.isActive) ||
        (statusFilter === 'inactive' && !recruiter.isActive);

      return searchMatch && statusMatch;
    });
  }, [recruiters, debouncedSearchQuery, statusFilter]);

  if (error) {
    toast.error('Error loading recruiters.');
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
            Recruiter Management
          </Typography>

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
                Loading recruiters...
              </Typography>
            </Box>
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
                  Search Recruiters
                </Typography>

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    placeholder="Search by name, email, or phone number..."
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
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Recruiters List Section */}
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
                      <PersonIcon sx={{ color: 'primary.main' }} />
                      Recruiters List
                    </Typography>
                    <Chip 
                      label={`Total: ${filteredRecruiters.length}`}
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
                    onClick={() => handleOpenDialog()}
                    startIcon={<AddIcon />}
                  >
                    Add Recruiter
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
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <AnimatePresence>
                        {filteredRecruiters.length === 0 ? (
                          <TableRow>
                            <TableCell 
                              colSpan={6} 
                              align="center"
                              sx={{ 
                                py: 8,
                                color: 'text.secondary',
                              }}
                            >
                              <Typography variant="h6" gutterBottom>
                                No recruiters available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Try adjusting your search criteria or add a new recruiter
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRecruiters.map((recruiter) => (
                            <motion.tr
                              key={recruiter.recruiterId}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              component={TableRow}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PersonIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {recruiter.firstName}
                                </Box>
                              </TableCell>
                              <TableCell>{recruiter.lastName}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {recruiter.email}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PhoneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                  {recruiter.phoneNumber}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                  <Chip 
                                    label={recruiter.isActive ? "Active" : "Inactive"}
                                    color={recruiter.isActive ? "success" : "error"}
                                    sx={{ 
                                      fontWeight: 500,
                                      minWidth: 80,
                                    }}
                                  />
                                </motion.div>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleOpenDialog(recruiter)}
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
                                    onClick={() => handleOpenDeleteDialog(recruiter)}
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

          {/* Create/Edit Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ 
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}>
              {selectedRecruiter ? 'Edit Recruiter' : 'Add New Recruiter'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {selectedRecruiter && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        name="isActive"
                      />
                    }
                    label="Active"
                  />
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={handleCloseDialog} variant="outlined" color="inherit">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={addRecruiter.isLoading || updateRecruiter.isLoading}
                  startIcon={
                    (addRecruiter.isLoading || updateRecruiter.isLoading) ? 
                      <CircularProgress size={20} /> : 
                      selectedRecruiter ? <EditIcon /> : <AddIcon />
                  }
                >
                  {selectedRecruiter ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <ConfirmationDialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            onConfirm={handleDelete}
            title="Delete Recruiter"
            message="Are you sure you want to delete this recruiter?"
            remarks={deleteRemarks}
            setRemarks={setDeleteRemarks}
            loading={deleteRecruiter.isLoading}
          />
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default React.memo(Recruiter); 