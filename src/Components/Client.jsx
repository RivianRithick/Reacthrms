import React, { useState, useCallback, useMemo } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { ToastContainer, toast } from "react-toastify";
import useDebounce from '../hooks/useDebounce';
import useClientData from '../hooks/useClientData';
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
  Select,
  FormControl,
  InputLabel,
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
  Block as BlockIcon,
  Tag as TagIcon,
  Code as CodeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Language as LanguageIcon,
  Settings as SettingsIcon,
  SearchOff as SearchOffIcon,
  Cancel as CancelIcon,
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
          '&.MuiButton-containedError': {
            background: 'linear-gradient(45deg, #dc2626, #f87171)',
            '&:hover': {
              background: 'linear-gradient(45deg, #b91c1c, #ef4444)',
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

const ClientCrud = React.memo(() => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [client, setClient] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    website: "",
    isBlocked: false,
    clientCode: "",
  });

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use client data hook with caching
  const { 
    clients, 
    isLoading, 
    error, 
    addClient, 
    updateClient, 
    deleteClient 
  } = useClientData();

  // Memoize handlers
  const handleAddClick = useCallback(() => {
    setShowForm(true);
    setSelectedClient(null);
  }, []);

  const handleEditClick = useCallback((client) => {
    setSelectedClient(client);
    setClient({
      name: client.name,
      email: client.email,
      contact: client.contact,
      address: client.address,
      website: client.website,
      isBlocked: client.isBlocked,
      clientCode: client.clientCode,
    });
    setShowForm(true);
  }, []);

  const handleDeleteClick = useCallback((client) => {
    setClientToDelete(client);
    setDialogOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setSelectedClient(null);
  }, []);

  // Memoize filtered clients with local filtering
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    
    return clients.filter((client) => {
      // First apply the block status filter
      const blockStatusMatch = 
        clientFilter === 'all' || 
        (clientFilter === 'blocked' ? client.isBlocked : !client.isBlocked);
      
      // Then apply the search filter if there's a search query
      const searchMatch = !debouncedSearchQuery || 
        client.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        client.address.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      return blockStatusMatch && searchMatch;
    });
  }, [clients, debouncedSearchQuery, clientFilter]);

  // Handle form submission with React Query mutation
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        await updateClient.mutateAsync({ ...client, id: selectedClient.id });
        toast.success("Client updated successfully!");
      } else {
        await addClient.mutateAsync(client);
        toast.success("Client added successfully!");
      }
      handleFormClose();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save client.");
    }
  }, [client, selectedClient, addClient, updateClient, handleFormClose]);

  // Handle delete with React Query mutation
  const confirmDelete = useCallback(async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient.mutateAsync(clientToDelete.id);
      toast.success("Client deleted successfully!");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client.");
    }
  }, [clientToDelete, deleteClient]);

  if (error) {
    toast.error("Error loading clients.");
  }

  // Reset the form
  const resetForm = () => {
    setClient({
      name: "",
      email: "",
      contact: "",
      address: "",
      website: "",
      isBlocked: false,
      clientCode: "",
    });
    setSelectedClient(null);
    setShowForm(false);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setClientFilter(e.target.value);
  };

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              name === "contact" ? value.replace(/^\+91/, "") : // Strip the prefix if re-typed
              value
    }));
  }, []);

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
                    <BusinessIcon sx={{ fontSize: 40 }} />
                    Client Management
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      icon={<BusinessIcon />}
                      label={`Total Records: ${filteredClients.length}`}
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
                    placeholder="Search by Name or Address..."
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
                    <InputLabel>Block Status</InputLabel>
                    <Select
                      value={clientFilter}
                      onChange={handleFilterChange}
                      label="Block Status"
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
                      <MenuItem value="all">All Clients</MenuItem>
                      <MenuItem value="blocked">Blocked</MenuItem>
                      <MenuItem value="notBlocked">Not Blocked</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAddClick}
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
                    Add New Client
                  </Button>
                </Paper>
              </>
            )}
          </Box>

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
                Loading client data...
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
                    <BusinessIcon sx={{ fontSize: 40 }} />
                    {selectedClient ? "Edit Client" : "Create Client"}
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
                          <BusinessIcon />
                          Client Details
                        </Typography>
                      </Box>
                    </Grid>

                    {["clientCode", "name", "email", "contact", "address", "website"].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <TextField
                          fullWidth
                          label={field === "clientCode" ? "Client Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                          name={field}
                          value={client[field]}
                          onChange={handleChange}
                          required
                          InputProps={{
                            startAdornment: field === "contact" ? (
                              <InputAdornment position="start">
                                <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                  +91
                                </Typography>
                              </InputAdornment>
                            ) : null
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
                    ))}

                    <Grid item xs={12}>
                      <Box sx={{ 
                        mt: 4, 
                        pt: 3,
                        borderTop: '2px solid',
                        borderColor: 'rgba(61, 82, 160, 0.1)',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        gap: 2 
                      }}>
                        <Button
                          variant="outlined"
                          color={client.isBlocked ? "error" : "primary"}
                          onClick={() => {
                            setClient(prev => ({
                              ...prev,
                              isBlocked: !prev.isBlocked
                            }));
                          }}
                          startIcon={<BlockIcon />}
                          sx={{
                            borderWidth: '2px',
                            '&:hover': {
                              borderWidth: '2px',
                            },
                          }}
                        >
                          {client.isBlocked ? "Unblock Client" : "Block Client"}
                        </Button>
                        <Box sx={{ display: 'flex', gap: 2 }}>
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
                            {selectedClient ? "Update Client" : "Create Client"}
                          </Button>
                        </Box>
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
              {/* Clients List Section */}
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
                      Loading clients...
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
                              Client Code
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                            fontWeight: 600,
                            color: 'primary.main',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon sx={{ color: 'primary.main' }} />
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
                              Address
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
                          {filteredClients.length === 0 ? (
                            <TableRow>
                              <TableCell 
                                colSpan={7} 
                                align="center"
                                sx={{ 
                                  py: 8,
                                  background: 'linear-gradient(145deg, rgba(245,247,255,0.5), rgba(232,236,255,0.5))'
                                }}
                              >
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                  <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                  <Typography variant="h6" gutterBottom color="primary">
                                    No clients found
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Try adjusting your search criteria or add a new client
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredClients.map((client, index) => (
                              <motion.tr
                                key={client.id}
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
                                    {client.clientCode}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                    {client.name}
                                    {client.isBlocked && (
                                      <Chip
                                        size="small"
                                        label="Blocked"
                                        color="error"
                                        sx={{ height: 24 }}
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                    {client.email}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PhoneIcon sx={{ color: 'info.main', fontSize: 20 }} />
                                    +91 {client.contact}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOnIcon sx={{ color: 'error.main', fontSize: 20 }} />
                                    {client.address}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                                    <Tooltip title="Edit Client">
                                      <IconButton
                                        color="primary"
                                        onClick={() => handleEditClick(client)}
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
                                    <Tooltip title="Delete Client">
                                      <IconButton
                                        color="error"
                                        onClick={() => handleDeleteClick(client)}
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
                Are you sure you want to delete this client? This action cannot be undone.
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
        </motion.div>
      </Container>
    </ThemeProvider>
  );
});

export default ClientCrud;
