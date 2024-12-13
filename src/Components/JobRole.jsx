import React, { useEffect, useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { MdDelete } from "react-icons/md";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../apiService"; // Use the shared Axios instance
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAddCircle } from "react-icons/io";

const JobRole = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [jobRole, setJobRole] = useState({
    title: "",
    departmentId: "",
    jobRoleCode: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobRoleToDelete, setJobRoleToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all toasts when component unmounts
      toast.dismiss();
    };
  }, []);

  // Fetch job roles
  const fetchJobRoles = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/jobroles");
      const { data } = response.data;

      // Flatten job roles data
      const allJobRoles = data.flatMap((departmentData) =>
        departmentData.department.jobRoles.map((jobRole) => ({
          ...jobRole,
          departmentName: departmentData.department.name,
        }))
      );

      setJobRoles(allJobRoles);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      // toast.error("Failed to fetch job roles.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("/api/departments");
      const { data } = response.data;

      if (Array.isArray(data)) {
        setDepartments(data); // Set departments from API
      } else {
        console.error("Unexpected data format:", data);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments.");
    }
  };

  useEffect(() => {
    fetchJobRoles();
    fetchDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobRole({ ...jobRole, [name]: value });
  };

  // Handle form submission (create or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobRole.title || !jobRole.departmentId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const url = selectedJobRole
      ? `/api/jobroles/update`
      : `/api/jobroles/create`;
    const payload = selectedJobRole
      ? { id: selectedJobRole.id, ...jobRole }
      : jobRole;

    try {
      await axiosInstance.post(url, payload);
      toast.success(`Job role ${selectedJobRole ? "updated" : "created"} successfully!`);
      fetchJobRoles();
      resetForm();
    } catch (error) {
      console.error("Error saving job role:", error);
      toast.error("Failed to save job role. Please try again.");
    }
  };

  // Reset form
  const resetForm = () => {
    setJobRole({ title: "", departmentId: "", jobRoleCode: "" });
    setSelectedJobRole(null);
    setShowForm(false);
  };

  // Open delete confirmation dialog
  const openDialog = (id) => {
    setJobRoleToDelete(id);
    setDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!jobRoleToDelete) return;

    try {
      await axiosInstance.post("/api/jobroles/delete", jobRoleToDelete);
      toast.success("Job role deleted successfully.");
      fetchJobRoles();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting job role:", error);
      toast.error("Failed to delete job role. Please try again.");
    }
  };

  // Filter job roles based on search query
  const filteredJobRoles = jobRoles.filter(
    (role) =>
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit
  const handleEdit = (role) => {
    setSelectedJobRole(role);
    setJobRole({ title: role.title, departmentId: role.departmentId, jobRoleCode: role.jobRoleCode });
    setShowForm(true);
  };

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
        Job Role Management
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
            label="Search by Job Title or Department Name"
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

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
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
          <Typography variant="h5" sx={{ 
            marginBottom: 4, 
            color: 'primary.main',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {selectedJobRole ? 'Edit Job Role' : 'Create Job Role'}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Job Role Code"
                name="jobRoleCode"
                value={jobRole.jobRoleCode}
                onChange={handleChange}
                required
                sx={{ 
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Job Title"
                name="title"
                value={jobRole.title}
                onChange={handleChange}
                required
                sx={{ 
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl 
                fullWidth 
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    backgroundColor: 'white',
                    padding: '0 8px',
                    marginLeft: '-4px',
                  },
                  '& .MuiInputLabel-shrink': {
                    backgroundColor: 'white',
                  }
                }}
              >
                <InputLabel 
                  sx={{ 
                    color: 'text.secondary',
                  }}
                >
                  Department
                </InputLabel>
                <Select
                  name="departmentId"
                  value={jobRole.departmentId}
                  onChange={handleChange}
                  label="Department"
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '16.5px 14px',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Department</em>
                  </MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              sx={{
                minWidth: 120,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              {selectedJobRole ? 'Update' : 'Create'}
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
      ) : (
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
              Job Roles List
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
              <IoIosAddCircle sx={{ marginRight: 1 }} /> Add Job Role
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Job Role Code</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No job roles available.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobRoles.map((role, index) => (
                    <TableRow key={role.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{role.jobRoleCode}</TableCell>
                      <TableCell>{role.title}</TableCell>
                      <TableCell>{role.departmentName || "N/A"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleEdit(role)}
                          >
                            <FaEdit className="me-1" />Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => openDialog(role.id)}
                          >
                            <MdDelete className="me-1" />Delete
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

export default JobRole;
