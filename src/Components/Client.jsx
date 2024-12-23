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
            Client Management
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
                    {selectedClient ? "Edit Client" : "Create Client"}
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {["clientCode", "name", "email", "contact", "address", "website"].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        {field === "contact" ? (
                          <TextField
                            fullWidth
                            label="Contact"
                            name={field}
                            value={client[field]}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    +91
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
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
                          />
                        ) : (
                          <TextField
                            fullWidth
                            label={field === "clientCode" ? "Client Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            value={client[field]}
                            onChange={handleChange}
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
                          />
                        )}
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Button
                        variant={client.isBlocked ? "contained" : "outlined"}
                        color={client.isBlocked ? "error" : "primary"}
                        onClick={() => {
                          setClient(prev => ({
                            ...prev,
                            isBlocked: !prev.isBlocked
                          }));
                        }}
                        startIcon={<BlockIcon />}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {client.isBlocked ? "Unblock Client" : "Block Client"}
                      </Button>
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
                    >
                      {selectedClient ? "Update Client" : "Create Client"}
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
              {/* Search & Filters Section */}
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
                  Search & Filters
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      placeholder="Search by Name or Address..."
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
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Block Status</InputLabel>
                      <Select
                        value={clientFilter}
                        onChange={handleFilterChange}
                        label="Block Status"
                        sx={{
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
                  </Grid>
                </Grid>
              </Paper>

              {/* Clients List Section */}
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
                      <BusinessIcon sx={{ color: 'primary.main' }} />
                      Clients List
                    </Typography>
                    <Chip 
                      label={`Total: ${filteredClients.length}`}
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
                    onClick={handleAddClick}
                    startIcon={<AddIcon />}
                  >
                    Add Client
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
                        {['#', 'Client Code', 'Name', 'Email', 'Contact', 'Address', 'Website', 'Actions'].map((header) => (
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
                        {filteredClients.length === 0 ? (
                          <TableRow>
                            <TableCell 
                              colSpan={8} 
                              align="center"
                              sx={{ 
                                py: 8,
                                color: 'text.secondary',
                              }}
                            >
                              <Typography variant="h6" gutterBottom>
                                No clients available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Try adjusting your search or filter criteria
                              </Typography>
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
                                  backgroundColor: 'action.hover',
                                },
                                '&:hover': {
                                  backgroundColor: 'action.selected',
                                },
                                transition: 'background-color 0.2s ease-in-out',
                              }}
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{client.clientCode}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                              <TableCell>{client.email}</TableCell>
                              <TableCell>+91 {client.contact}</TableCell>
                              <TableCell>{client.address}</TableCell>
                              <TableCell>{client.website}</TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEditClick(client)}
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
                                    onClick={() => handleDeleteClick(client)}
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

export default ClientCrud;
