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
  Grid,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Settings as SettingsIcon,
  Tag as TagIcon,
  Cancel as CancelIcon,
  SearchOff as SearchOffIcon,
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useOnboardingManagerData from '../hooks/useOnboardingManagerData';
import useDebounce from '../hooks/useDebounce';

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
          '&:hover': {
            transform: 'translateY(-1px)',
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
const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

const OnboardingManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    isActive: true,
  });
  const [deleteRemarks, setDeleteRemarks] = useState('');

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    managers,
    isLoading,
    error,
    addManager,
    updateManager,
    deleteManager,
  } = useOnboardingManagerData(debouncedSearchQuery);

  const handleInputChange = useCallback((e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value
    }));
  }, []);

  const handleOpenDialog = useCallback((manager = null) => {
    if (manager) {
      setFormData({
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        phoneNumber: manager.phoneNumber,
        isActive: manager.isActive,
      });
      setSelectedManager(manager);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        isActive: true,
      });
      setSelectedManager(null);
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedManager(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      isActive: true,
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (selectedManager) {
        await updateManager.mutateAsync({
          id: selectedManager.onboardingManagerId,
          ...formData
        });
        toast.success('Onboarding manager updated successfully');
      } else {
        await addManager.mutateAsync(formData);
        toast.success('Onboarding manager created successfully');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, [formData, selectedManager, updateManager, addManager]);

  const handleOpenDeleteDialog = useCallback((manager) => {
    setSelectedManager(manager);
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
    setSelectedManager(null);
    setDeleteRemarks('');
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteManager.mutateAsync({
        id: selectedManager.onboardingManagerId,
        remarks: deleteRemarks
      });
      toast.success('Onboarding manager deleted successfully');
      handleCloseDeleteDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, [selectedManager, deleteRemarks, deleteManager]);

  const filteredManagers = useMemo(() => {
    return managers?.filter(manager => {
      const matchesSearch = !debouncedSearchQuery || 
        manager.firstName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        manager.lastName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        manager.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && manager.isActive) ||
        (statusFilter === 'inactive' && !manager.isActive);
      
      return matchesSearch && matchesStatus;
    }) || [];
  }, [managers, debouncedSearchQuery, statusFilter]);

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
                <PersonIcon sx={{ fontSize: 40 }} />
                Onboarding Manager Management
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  icon={<PersonIcon />}
                  label={`Total Records: ${filteredManagers.length}`}
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
                placeholder="Search by Name, Email..."
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
              <FormControl 
                sx={{ 
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.9)',
                  }
                }}
                size="small"
              >
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
              <Button
                variant="contained"
                onClick={() => handleOpenDialog()}
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
                Add New Manager
              </Button>
            </Paper>
          </Box>

          <ToastContainer />

          {/* Managers List Section */}
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
                  Loading managers...
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
                          <PersonIcon sx={{ color: 'primary.main' }} />
                          Name
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
                      <TableCell sx={{ 
                        background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ color: 'primary.main' }} />
                          Phone
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SettingsIcon sx={{ color: 'primary.main' }} />
                          Status
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {filteredManagers.length === 0 ? (
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
                                No managers found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Try adjusting your search criteria or add a new manager
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredManagers.map((manager) => (
                          <motion.tr
                            key={manager.onboardingManagerId}
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: 'primary.main',
                                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                  }}
                                >
                                  {manager.firstName[0]}
                                </Avatar>
                                <Typography>{`${manager.firstName} ${manager.lastName}`}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ color: 'primary.main' }} />
                                {manager.email}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ color: 'success.main' }} />
                                {manager.phoneNumber}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={manager.isActive ? 'Active' : 'Inactive'}
                                color={manager.isActive ? 'success' : 'default'}
                                sx={{ 
                                  background: manager.isActive 
                                    ? 'linear-gradient(45deg, #059669, #34d399)'
                                    : 'linear-gradient(45deg, #9ca3af, #d1d5db)',
                                  color: 'white',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Tooltip title="Edit Manager">
                                  <IconButton
                                    onClick={() => handleOpenDialog(manager)}
                                    sx={{
                                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                      color: 'white',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                        transform: 'translateY(-2px)',
                                      },
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Manager">
                                  <IconButton
                                    onClick={() => handleOpenDeleteDialog(manager)}
                                    sx={{
                                      background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                                      color: 'white',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                                        transform: 'translateY(-2px)',
                                      },
                                    }}
                                  >
                                    <DeleteIcon />
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

          {/* Add/Edit Dialog */}
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            <DialogTitle sx={{ 
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.light'
            }}>
              <PersonIcon />
              {selectedManager ? 'Edit Manager' : 'Add New Manager'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {!selectedManager && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SettingsIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        name="isActive"
                        color="success"
                      />
                    }
                    label={
                      <Typography sx={{ color: formData.isActive ? 'success.main' : 'text.secondary' }}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button
                onClick={handleCloseDialog}
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
                onClick={handleSubmit}
                variant="contained"
                startIcon={selectedManager ? <EditIcon /> : <AddIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                  }
                }}
              >
                {selectedManager ? 'Update Manager' : 'Add Manager'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog 
            open={openDeleteDialog} 
            onClose={handleCloseDeleteDialog}
            PaperProps={{
              sx: {
                borderRadius: 3,
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
              Delete Manager
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography gutterBottom>
                Are you sure you want to delete this manager? This action cannot be undone.
              </Typography>
              <TextField
                fullWidth
                label="Delete Remarks"
                multiline
                rows={3}
                value={deleteRemarks}
                onChange={(e) => setDeleteRemarks(e.target.value)}
                sx={{ mt: 2 }}
                required
              />
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button
                onClick={handleCloseDeleteDialog}
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
                onClick={handleDelete}
                variant="contained"
                color="error"
                disabled={!deleteRemarks.trim()}
                startIcon={<DeleteIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                  }
                }}
              >
                Delete Manager
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default OnboardingManager; 