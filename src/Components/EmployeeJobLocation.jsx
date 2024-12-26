import React, { useState, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationDialog from "./ConfirmationDialog";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
  Container,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  LocationCity as CityIcon,
  Public as CountryIcon,
  Home as AddressIcon,
  Settings as SettingsIcon,
  SearchOff as SearchOffIcon,
  Cancel as CancelIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import useDebounce from '../hooks/useDebounce';
import { useJobLocationData } from '../hooks/useJobLocationData';

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

// Add Indian states array
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const EmployeeJobLocation = React.memo(() => {
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    country: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use job location data hook
  const {
    jobLocations,
    isLoading,
    error: apiError,
    createLocation,
    updateLocation,
    deleteLocation
  } = useJobLocationData(debouncedSearchQuery);

  // Memoize filtered locations
  const filteredLocations = useMemo(() => {
    if (!jobLocations) return [];
    const searchLower = debouncedSearchQuery.toLowerCase();
    return jobLocations.filter(location =>
      location.city.toLowerCase().includes(searchLower) ||
      location.state.toLowerCase().includes(searchLower) ||
      location.country.toLowerCase().includes(searchLower)
    );
  }, [jobLocations, debouncedSearchQuery]);

  // Handler functions with useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const payload = {
        City: formData.city,
        State: formData.state,
        Country: formData.country,
        Address: formData.address,
      };

      if (selectedLocation) {
        payload.Id = selectedLocation.id;
        await updateLocation.mutateAsync(payload);
        toast.success('Job location updated successfully');
      } else {
        await createLocation.mutateAsync(payload);
        toast.success('Job location created successfully');
      }
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Failed to save job location');
    }
  }, [formData, selectedLocation, createLocation, updateLocation]);

  const handleDelete = useCallback((location) => {
    setLocationToDelete(location);
    setDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!locationToDelete) return;
    try {
      await deleteLocation.mutateAsync(locationToDelete.id);
      toast.success('Job location deleted successfully');
      setDialogOpen(false);
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Failed to delete job location');
    }
  }, [locationToDelete, deleteLocation]);

  const handleEdit = useCallback((location) => {
    setSelectedLocation(location);
    setFormData({
      city: location.city,
      state: location.state,
      country: location.country,
      address: location.address,
    });
    setShowForm(true);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      city: '',
      state: '',
      country: '',
      address: '',
    });
    setSelectedLocation(null);
    setShowForm(false);
  }, []);

  // Effect for handling messages timeout
  React.useEffect(() => {
    if (error || apiError) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, apiError]);

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
                    <LocationIcon sx={{ fontSize: 40 }} />
                    Job Location Management
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      icon={<LocationIcon />}
                      label={`Total Records: ${filteredLocations.length}`}
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
                    placeholder="Search by City, State or Country..."
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
                    Add New Location
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
                    <LocationIcon sx={{ fontSize: 40 }} />
                    {selectedLocation ? "Edit Location" : "Create Location"}
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
                          <LocationIcon />
                          Location Details
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter city name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CityIcon sx={{ color: 'primary.main' }} />
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
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          label="State"
                          required
                          startAdornment={
                            <InputAdornment position="start">
                              <LocationIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          }
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
                          <MenuItem value="">Select State</MenuItem>
                          {indianStates.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter country name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CountryIcon sx={{ color: 'primary.main' }} />
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
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        placeholder="Enter complete address"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AddressIcon sx={{ color: 'primary.main' }} />
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
                          disabled={isLoading}
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
                          {isLoading ? 'Saving...' : (selectedLocation ? 'Update Location' : 'Create Location')}
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
              {/* Locations List Section */}
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
                      Loading locations...
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
                              <CityIcon sx={{ color: 'primary.main' }} />
                              City
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                            fontWeight: 600,
                            color: 'primary.main',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationIcon sx={{ color: 'primary.main' }} />
                              State
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                            fontWeight: 600,
                            color: 'primary.main',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CountryIcon sx={{ color: 'primary.main' }} />
                              Country
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
                          {filteredLocations.length === 0 ? (
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
                                    No locations found
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Try adjusting your search criteria or add a new location
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredLocations.map((location, index) => (
                              <motion.tr
                                key={location.id}
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
                                    <CityIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                    {location.city}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                    {location.state}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CountryIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                    {location.country}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                                    <Tooltip title="Edit Location">
                                      <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(location)}
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
                                    <Tooltip title="Delete Location">
                                      <IconButton
                                        color="error"
                                        onClick={() => handleDelete(location)}
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
              Are you sure you want to delete this location? This action cannot be undone.
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

export default EmployeeJobLocation;
