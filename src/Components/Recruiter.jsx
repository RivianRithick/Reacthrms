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
  Avatar,
  Grid,
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
  Close as CloseIcon,
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
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
    setSelectedRecruiter(null);
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
        id: selectedRecruiter.recruiterId
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
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sticky Header */}
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
                Recruiter Management
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  icon={<PersonIcon />}
                  label={`Total Records: ${filteredRecruiters.length}`}
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
                placeholder="Search by name, email, or phone number..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
                startIcon={<AddIcon />}
                sx={{
                  minWidth: '120px',
                  background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Add Recruiter
              </Button>
            </Paper>
          </Box>

          {/* Recruiters List Section */}
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
                    Loading recruiters...
                  </Typography>
                </Box>
              ) : filteredRecruiters.length === 0 ? (
                <Box sx={{ 
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <SearchIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="h6" color="primary">
                    No recruiters found
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
                            <PersonIcon sx={{ color: 'primary.main' }} />
                            First Name
                          </Box>
                        </TableCell>
                        <TableCell sx={{ 
                          background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                          fontWeight: 600,
                          color: 'primary.main',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: 'primary.main' }} />
                            Last Name
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
                            Phone Number
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
                        {filteredRecruiters.map((recruiter, index) => (
                          <motion.tr
                            key={recruiter.recruiterId}
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
                                  {recruiter.firstName?.[0]?.toUpperCase() || ''}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {recruiter.firstName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {recruiter.lastName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ color: 'info.main', fontSize: 20 }} />
                                <Typography variant="body2">
                                  {recruiter.email}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                <Typography variant="body2" sx={{ 
                                  color: 'success.main',
                                  fontWeight: 500
                                }}>
                                  {recruiter.phoneNumber}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={recruiter.isActive ? "Active" : "Inactive"}
                                color={recruiter.isActive ? "success" : "error"}
                                size="small"
                                sx={{ 
                                  fontWeight: 500,
                                  minWidth: 80,
                                  background: recruiter.isActive ? 
                                    'linear-gradient(45deg, #059669, #34d399)' : 
                                    'linear-gradient(45deg, #dc2626, #ef4444)',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                                <Tooltip title="Edit Recruiter">
                                <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(recruiter)}
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
                                <Tooltip title="Delete Recruiter">
                                <IconButton
                                        color="error"
                                        onClick={() => handleOpenDeleteDialog(recruiter)}
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
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </motion.div>

          {/* Create/Edit Dialog */}
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
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
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
                    <PersonIcon />
                    {selectedRecruiter ? 'Edit Recruiter' : 'Add New Recruiter'}
                  </Typography>
                  <IconButton 
                    onClick={handleCloseDialog}
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
                <form onSubmit={handleSubmit}>
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
                          <PersonIcon />
                          Recruiter Details
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        First Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
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

                    <Grid item xs={6}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Last Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
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

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Email
                      </InputLabel>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
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

                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                        Phone Number
                      </InputLabel>
                      <TextField
                        fullWidth
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
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

                    {selectedRecruiter && (
                      <Grid item xs={12}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          mt: 1,
                          backgroundColor: 'rgba(61, 82, 160, 0.04)',
                          borderRadius: 1,
                          p: 1
                        }}>
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
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: formData.isActive ? 'success.main' : 'text.secondary'
                                }}
                              >
                                {formData.isActive ? "Active" : "Inactive"}
                              </Typography>
                            }
                          />
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  {/* Fixed Footer with Buttons */}
                  <Box sx={{ 
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1
                  }}>
                    <Button 
                      onClick={handleCloseDialog}
                      variant="outlined" 
                      color="inherit"
                      sx={{
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          backgroundColor: 'primary.light',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained"
                      disabled={addRecruiter.isLoading || updateRecruiter.isLoading}
                      startIcon={
                        (addRecruiter.isLoading || updateRecruiter.isLoading) ? 
                          <CircularProgress size={20} /> : 
                          selectedRecruiter ? <EditIcon /> : <AddIcon />
                      }
                      sx={{
                        minWidth: '100px',
                        background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {selectedRecruiter ? 'Update' : 'Create'}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Header */}
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
                    color: 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <DeleteIcon />
                    Delete Recruiter
                  </Typography>
                  <IconButton 
                    onClick={handleCloseDeleteDialog}
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
                <Typography variant="body1">
                  Are you sure you want to delete this recruiter? This action cannot be undone.
                </Typography>
              </Box>

              {/* Actions */}
              <Box sx={{ 
                p: 2, 
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1
              }}>
                <Button 
                  onClick={handleCloseDeleteDialog}
                  variant="outlined" 
                  color="inherit"
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'error.main',
                      color: 'error.main',
                      backgroundColor: 'error.light',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                  disabled={deleteRecruiter.isLoading}
                  startIcon={deleteRecruiter.isLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                  sx={{
                    minWidth: '100px',
                    background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Dialog>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default React.memo(Recruiter); 