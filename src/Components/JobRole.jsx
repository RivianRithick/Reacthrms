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

const JobRole = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [jobRole, setJobRole] = useState({
    title: "",
    departmentId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobRoleToDelete, setJobRoleToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setJobRole({ title: "", departmentId: "" });
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
    setJobRole({ title: role.title, departmentId: role.departmentId });
    setShowForm(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}>
        Job Role Management
      </Typography>
      <ToastContainer />

      {!showForm && (
        <TextField
          fullWidth
          label="Search by Job Title or Department Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : showForm ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 4 }}>
          <Typography variant="h5">
            {selectedJobRole ? "Edit Job Role" : "Create Job Role"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                name="title"
                value={jobRole.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentId"
                  value={jobRole.departmentId}
                  onChange={handleChange}
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
            Add Job Role
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Department Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No job roles available.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobRoles.map((role, index) => (
                    <TableRow key={role.id}>
                      <TableCell>{index + 1}</TableCell>
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

export default JobRole;
