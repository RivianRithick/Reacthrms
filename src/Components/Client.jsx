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
    });
    setShowForm(true);
  };

  // Open the delete confirmation dialog
  const openDialog = (id) => {
    setClientToDelete(id);
    setDialogOpen(true);
  };

  // Confirm deletion of a client
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
          body: JSON.stringify({ id: clientToDelete }), // Wrap id in an object
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error deleting client: ${response.statusText} - ${errorText}`
        );
      }

      toast.success("Client deleted successfully!");
      fetchClients();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error(`Error deleting client: ${error.message}`);
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
      <Typography variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}>
        Client Management
      </Typography>
      <ToastContainer />
      {loading ? (
        <Typography variant="h6" align="center">
          Loading clients...
        </Typography>
      ) : (
        <>
          {!showForm && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <TextField
                fullWidth
                label="Search by Name or Address"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={clientFilter}
                  onChange={handleFilterChange}
                  label="Filter"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="notBlocked">Not Blocked</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {showForm ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ marginBottom: 4 }}
            >
              <Typography variant="h5">
                {selectedClient ? "Edit Client" : "Create Client"}
              </Typography>
              <Grid container spacing={2}>
                {["name", "email", "contact", "address", "website"].map(
                  (field) => (
                    <Grid item xs={12} sm={6} key={field}>
                      {field === "contact" ? (
                        <TextField
                          fullWidth
                          label="Contact"
                          name={field}
                          value={client[field]} // Directly use the `client.contact` value
                          onChange={(e) => {
                            const inputValue = e.target.value.replace(
                              /^\+91/,
                              ""
                            ); // Ensure the value doesn't start with +91
                            setClient((prev) => ({
                              ...prev,
                              contact: inputValue,
                            }));
                          }}
                          InputProps={{
                            startAdornment: (
                              <Typography
                                sx={{
                                  paddingRight: "8px",
                                  fontWeight: "bold",
                                  color: "rgba(0, 0, 0, 0.6)",
                                }}
                              >
                                +91
                              </Typography>
                            ),
                          }}
                          required
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          name={field}
                          value={client[field]}
                          onChange={handleChange}
                          required
                        />
                      )}
                    </Grid>
                  )
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isBlocked"
                        checked={client.isBlocked}
                        onChange={handleChange}
                      />
                    }
                    label="Is Blocked"
                  />
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginLeft: 2 }}
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowForm(true)}
                sx={{ marginBottom: 2 }}
              >
                <IoIosAddCircle className="me-1" />
                Add Client
              </Button>
              <Typography variant="h5">Clients List</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Website</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client, index) => (
                        <TableRow key={client.id}>
                          <TableCell>{index + 1}</TableCell>
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
                              >
                                <FaEdit className="me-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => openDialog(client.id)}
                                variant="contained"
                                color="error"
                                size="small"
                              >
                                <MdDelete className="me-1" />
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No client is available to display.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          <ConfirmationDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </Box>
  );
};

export default ClientCrud;
