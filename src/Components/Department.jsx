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
} from '@mui/material';

const Department = () => {
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog
  const [departmentToDelete, setDepartmentToDelete] = useState(null); // Store department to delete
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [department, setDepartment] = useState({
    name: '',
  });
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        "https://hrmsasp.runasp.net/api/departments"
      );
      if (!response.ok) throw new Error("Failed to fetch departments");
      const result = await response.json();

      if (Array.isArray(result.data)) {
        setDepartments(result.data); // Set departments from API
      } else {
        console.error("Unexpected data format:", result);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments(); // Load departments on mount
  }, []);

  // Handle input change in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!department.name) {
      alert("Please fill in the department name.");
      return;
    }
  
    const url = selectedDepartment
      ? `https://hrmsasp.runasp.net/api/create-department/update`
      : "https://hrmsasp.runasp.net/api/create-department";
  
    const payload = selectedDepartment
      ? { id: selectedDepartment.id, name: department.name } // Include ID for updates
      : { name: department.name }; // Only name for creation
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        resetForm();
        fetchDepartments(); // Refresh the department list
      } else {
        const errorText = await response.text();
        throw new Error(`Error: ${response.statusText} - ${errorText || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during department operation:", error);
      alert(`Operation failed: ${error.message}`);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setDepartment({ name: "" }); // Clear the form
    setSelectedDepartment(null); // Clear the selected department
    setShowForm(false); // Hide the form
  };

  // Handle editing a department
  const handleEdit = (department) => {
    setSelectedDepartment(department); // Set the department to edit
    setDepartment({ name: department.name }); // Populate the form with the department's name
    setShowForm(true); // Show the form
  };

  // Open the delete confirmation dialog
  const openDialog = (id) => {
    setDepartmentToDelete(id);
    setDialogOpen(true);
  };

  // Confirm deletion of a department
  const confirmDelete = async () => {
    if (!departmentToDelete) return;
  
    try {
      const response = await fetch(
        `https://hrmsasp.runasp.net/api/create-department/delete`,
        {
          method: "POST", // Use POST for delete
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
          },
          body: JSON.stringify(departmentToDelete), // Send the raw integer ID
        }
      );
  
      if (response.ok) {
        fetchDepartments(); // Refresh the department list
        setDialogOpen(false); // Close the dialog
      } else {
        const errorText = await response.text();
        throw new Error(`Error deleting department: ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  
  // Filtered departments based on search query
  const filteredDepartments = Array.isArray(departments)
    ? departments.filter((department) =>
        department.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>

      {/* Search input for filtering departments */}
      {!showForm && (
        <TextField
          fullWidth
          label="Search by Department Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          sx={{ marginBottom: 2 }}
        />
      )}

      {showForm ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 4 }}>
          <Typography variant="h5">
            {selectedDepartment ? 'Edit Department' : 'Create Department'}
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Department Name"
                name="name"
                value={department.name}
                onChange={handleChange}
                required
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
          <Button variant="contained" color="success" onClick={() => setShowForm(true)} sx={{ marginBottom: 2 }}>
            <IoIosAddCircle className="me-1" />Add Department
          </Button>
          <Typography variant="h5">Departments List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="3">No departments found.</TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((department,index) => (
                    <TableRow key={department.id}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1, // default gap
                            flexDirection: { xs: 'column', sm: 'row' } // Change layout on smaller screens
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
        </>
      )}
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default Department;
