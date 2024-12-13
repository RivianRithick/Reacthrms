import React, { useEffect, useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
  Switch,
} from "@mui/material";

const baseUrl = process.env.REACT_APP_BASE_URL;

const ClientCrud = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all"); // Filter state
  const [client, setClient] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    website: "",
    isBlocked: false,
    clientCode: "",
  });

  // Fetch clients from the API
  const fetchClients = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await fetch(
        `${baseUrl}/api/client-registration`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setClients(data?.data && Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error(`Error fetching clients: ${error.message}`);
      setClients([]);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]:
        name === "contact"
          ? value.replace(/^\+91/, "") // Strip the prefix if re-typed
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = selectedClient
      ? `${baseUrl}/api/client-registration/update`
      : `${baseUrl}/api/client-registration/create`;

    const payload = {
      ...client,
      id: selectedClient?.id,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.statusText} - ${errorText}`);
      }

      toast.success(
        `Client ${selectedClient ? "updated" : "created"} successfully!`
      );
      resetForm();
      await fetchClients();
    } catch (error) {
      console.error(
        `Error ${selectedClient ? "updating" : "creating"} client:`,
        error
      );
      toast.error(
        `Failed to ${selectedClient ? "update" : "create"} client: ${
          error.message
        }`
      );
      setShowForm(true); // Reopen form if needed
    }
  };

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

  // Handle edit
  const handleEdit = (client) => {
    setSelectedClient(client);
    setClient({
      name: client.name || "",
      email: client.email || "",
      contact: client.contact || "",
      address: client.address || "",
      website: client.website || "",
      isBlocked: client.isBlocked || false,
      clientCode: client.clientCode || "",
    });
    setShowForm(true);
  };

  // Open the delete confirmation dialog
  const openDialog = (id) => {
    setClientToDelete(id);
    setDialogOpen(true);
  };

  // Confirm deletion of a client
  const confirmDelete = async () => {
    if (!clientToDelete) {
      toast.error("Invalid client ID. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/client-registration/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: clientToDelete.toString(), // Send the ID as a simple value
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete client: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.status === "Success") {
        toast.success(result.message || "Client deleted successfully!");
        fetchClients();
        setDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error(error.message || "Failed to delete client");
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setClientFilter(e.target.value);
  };

  // Filtered clients based on filter state
  const filteredClients = Array.isArray(clients)
    ? clients
        .filter((client) =>
          clientFilter === "all"
            ? true
            : clientFilter === "blocked"
            ? client.isBlocked
            : !client.isBlocked
        )
        .filter(
          (client) =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: "center", 
          fontWeight: "bold",
          color: "primary.main",
          marginBottom: 4
        }}
      >
        Client Management
      </Typography>

      <ToastContainer />

      {loading ? (
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "200px" 
        }}>
          <CircularProgress />
        </Box>
      ) : showForm ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: 4,
            maxWidth: 800,
            margin: '0 auto'
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              marginBottom: 3,
              textAlign: "center"
            }}
          >
            {selectedClient ? "Edit Client" : "Create Client"}
          </Typography>

          <Grid container spacing={2}>
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
                        <Typography sx={{ paddingRight: "8px", fontWeight: "bold", color: "rgba(0, 0, 0, 0.6)" }}>
                          +91
                        </Typography>
                      ),
                    }}
                    required
                  />
                ) : (
                  <TextField
                    fullWidth
                    label={field === "clientCode" ? "Client Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={client[field]}
                    onChange={handleChange}
                    required
                  />
                )}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant={client.isBlocked ? "contained" : "outlined"}
                color="secondary"
                onClick={() => {
                  setClient(prev => ({
                    ...prev,
                    isBlocked: !prev.isBlocked
                  }));
                }}
              >
                {client.isBlocked ? "Unblock" : "Block"}
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button variant="outlined" onClick={resetForm}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {/* Search and Filters Section */}
          <Box sx={{ 
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: 3,
            marginBottom: 3
          }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Search & Filters</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search by Name or Address"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Block Filter</InputLabel>
                  <Select
                    value={clientFilter}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                    sx={{ 
                      '& .MuiSelect-select': {
                        padding: '10px 14px',
                      }
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                    <MenuItem value="notBlocked">Not Blocked</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Clients List Section */}
          <Box sx={{ 
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: 3
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 3
            }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Clients List
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowForm(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                <IoIosAddCircle sx={{ marginRight: 1 }} /> Add Client
              </Button>
            </Box>

            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Client Code</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Website</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell 
                        colSpan={9} 
                        align="center"
                        sx={{ 
                          py: 4,
                          color: 'text.secondary',
                          fontSize: '1.1rem'
                        }}
                      >
                        No clients available to display.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client, index) => (
                      <TableRow 
                        key={client.id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{client.clientCode}</TableCell>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.contact}</TableCell>
                        <TableCell>{client.address}</TableCell>
                        <TableCell>{client.website}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() => handleEdit(client)}
                              sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.2s'
                                }
                              }}
                            >
                              <FaEdit sx={{ marginRight: 0.5 }} /> Edit
                            </Button>
                            <Button
                              onClick={() => openDialog(client.id)}
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.2s'
                                }
                              }}
                            >
                              <MdDelete sx={{ marginRight: 0.5 }} /> Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default ClientCrud;
