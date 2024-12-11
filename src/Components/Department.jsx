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
  });
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department.name) {
      toast.error("Please fill in the department name.");
      return;
    }

    const url = selectedDepartment
      ? `${baseUrl}/api/create-department/update`
      : `${baseUrl}/api/create-department`;

    const payload = selectedDepartment
      ? { id: selectedDepartment.id, name: department.name }
      : { name: department.name };

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
    setDepartment({ name: "" });
    setSelectedDepartment(null);
    setShowForm(false);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setDepartment({ name: department.name });
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}>
        Department Management
      </Typography>
      <ToastContainer />

      {!showForm && (
        <TextField
          fullWidth
          label="Search by Department Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

export default Department;
