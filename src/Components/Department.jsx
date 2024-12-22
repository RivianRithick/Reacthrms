import React, { useEffect, useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
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
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = process.env.REACT_APP_BASE_URL;

const Department = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [department, setDepartment] = useState({
    name: '',
    departmentCode: '',
    clientRegistrationId: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/departments`
      );
      if (!response.ok) throw new Error("Failed to fetch departments");
      const result = await response.json();

      if (Array.isArray(result.data)) {
        setDepartments(result.data);
      } else {
        console.error("Unexpected data format:", result);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error(`Error fetching departments: ${error.message}`);
      setDepartments([]);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/client-registration`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch clients");
      
      const result = await response.json();
      const activeClients = (result.data || []).filter(client => !client.isBlocked);
      setClients(activeClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchClients();
  }, []);

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'clientRegistrationId') {
      setSelectedClientId(value);
    }
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department.clientRegistrationId || !department.name || !department.departmentCode) {
      toast.error("Please fill in all required fields including client selection.");
      return;
    }

    const url = selectedDepartment
      ? `${baseUrl}/api/create-department/update`
      : `${baseUrl}/api/create-department`;

    const payload = selectedDepartment
      ? {
          id: selectedDepartment.id,
          name: department.name,
          departmentCode: department.departmentCode,
          clientRegistrationId: department.clientRegistrationId
        }
      : {
          name: department.name,
          departmentCode: department.departmentCode,
          clientRegistrationId: department.clientRegistrationId
        };
    
    console.log('Submitting payload:', payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Server response:', responseData);
        
        toast.success(`Department ${selectedDepartment ? 'updated' : 'created'} successfully!`);
        resetForm();
        fetchDepartments();
      } else {
        const errorText = await response.text();
        throw new Error(`Error: ${response.statusText} - ${errorText || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during department operation:", error);
      toast.error(`Operation failed: ${error.message}`);
    }
  };

  const resetForm = () => {
    setDepartment({ 
      name: "", 
      departmentCode: "",
      clientRegistrationId: "" 
    });
    setSelectedClientId("");
    setSelectedDepartment(null);
    setShowForm(false);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setDepartment({
      name: department.name,
      departmentCode: department.departmentCode,
      clientRegistrationId: department.clientRegistrationId || department.clientId
    });
    setSelectedClientId(department.clientRegistrationId || department.clientId);
    setShowForm(true);
  };

  const openDialog = (id) => {
    setDepartmentToDelete(id);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/create-department/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(departmentToDelete),
        }
      );

      if (response.ok) {
        toast.success("Department deleted successfully!");
        fetchDepartments();
        setDialogOpen(false);
      } else {
        const errorText = await response.text();
        throw new Error(`Error deleting department: ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const filteredDepartments = Array.isArray(departments)
    ? departments.filter((department) =>
        department.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderForm = () => (
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
      <Typography variant="h5" sx={{ 
        marginBottom: 4, 
        color: 'primary.main',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        {selectedDepartment ? 'Edit Department' : 'Create Department'}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Client *"
            name="clientRegistrationId"
            value={department.clientRegistrationId}
            onChange={handleChange}
            required
            error={!department.clientRegistrationId}
            helperText={!department.clientRegistrationId ? "Client is required" : ""}
          >
            <MenuItem value="" disabled>
              Select Client
            </MenuItem>
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name} ({client.clientCode || 'No Code'})
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Department Code *"
            name="departmentCode"
            value={department.departmentCode}
            onChange={handleChange}
            required
            error={!department.departmentCode}
            helperText={!department.departmentCode ? "Department code is required" : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Department Name *"
            name="name"
            value={department.name}
            onChange={handleChange}
            required
            error={!department.name}
            helperText={!department.name ? "Department name is required" : ""}
          />
        </Grid>
      </Grid>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        marginTop: 4,
        justifyContent: 'center'
      }}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={!department.clientRegistrationId || !department.name || !department.departmentCode}
          sx={{
            minWidth: 120,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          {selectedDepartment ? 'Update' : 'Create'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetForm}
          sx={{
            minWidth: 120,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ padding: 2 }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />

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
        Department Management
      </Typography>

      {!showForm && (
        <Box sx={{ 
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: 3,
          marginBottom: 3
        }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Search & Filters</Typography>
          <TextField
            fullWidth
            label="Search by Department Name"
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
        </Box>
      )}

      {showForm ? renderForm() : (
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
              Departments List
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
              <IoIosAddCircle sx={{ marginRight: 1 }} /> Add Department
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department Code</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="3" align="center">
                      <Typography variant="body1" align="center">
                        No departments found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((department, index) => (
                    <TableRow key={department.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{department.departmentCode}</TableCell>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' }
                          }}
                        >
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleEdit(department)}
                          >
                            <FaEdit className="me-1" /> Edit
                          </Button>
                          <Button
                            onClick={() => openDialog(department.id)}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <MdDelete className="me-1" /> Delete
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
      )}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default Department;
