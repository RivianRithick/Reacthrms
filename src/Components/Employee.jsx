import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "./ConfirmationDialog";
import CircularProgress from "@mui/material/CircularProgress";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { Visibility, Download } from "@mui/icons-material";
import apiService from "../apiService";
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
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  FormControlLabel,
} from "@mui/material";

const baseUrl = "https://hrmsasp.runasp.net";
const EmployeeComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    email: "",
    contact: "+91", // Default prefix
    address: "",
    panCardFilePath: "",
    aadhaarCardFilePath: "",
    passbookFilePath: "",
    isBlocked: false,
    isApproved: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    isBlocked: "",
    isApproved: "",
    dataStatus: "all", // New filter for complete/incomplete/all
  });

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(""); // Clear any previous error

    try {
      const response = await fetch(
        "https://hrmsasp.runasp.net/api/employee-registration",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data?.status === "Success" && Array.isArray(data.data)) {
        setEmployees(data.data);
      } else {
        throw new Error(data?.message || "Failed to fetch employees.");
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (employeeId) => {
    if (!employeeId) {
      setError("Invalid employee ID.");
      return;
    }

    try {
      const response = await fetch(
        "https://hrmsasp.runasp.net/api/employee-registration/update-is-approved",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ employeeId }),
        }
      );

      const responseBody = await response.text(); // Log response body
      if (!response.ok) {
        console.error("Server response:", responseBody); // Log the response text
        throw new Error(responseBody || "Failed to update approval status.");
      }

      toast.success("Employee approved successfully!");
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error approving employee:", error.message);
      setError("Error approving employee.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleView = async (contact, documentType) => {
    try {
      // Map documentType to backend-compatible format
      const mapDocumentType = (type) => {
        const mapping = {
          PAN: "pan",
          Aadhaar: "aadhar",
          Passbook: "passbook",
        };
        return mapping[type] || type.toLowerCase();
      };
  
      const normalizedDocumentType = mapDocumentType(documentType);
  
      // API request
      const response = await apiService.get(
        `/api/employee-registration/download-document?contact=${encodeURIComponent(
          contact
        )}&documentType=${normalizedDocumentType}`,
        { responseType: "blob" } // Expect binary data
      );
  
      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
  
      // Open in a new tab
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing document:", error);
      alert(
        error.response?.status === 404
          ? `Document of type "${documentType}" not found.`
          : "Failed to view the document."
      );
    }
  };
  
  const handleDownload = async (contact, documentType) => {
    try {
      // Map documentType to backend-compatible format
      const mapDocumentType = (type) => {
        const mapping = {
          PAN: "pan",
          Aadhaar: "aadhar",
          Passbook: "passbook",
        };
        return mapping[type] || type.toLowerCase();
      };
  
      const normalizedDocumentType = mapDocumentType(documentType);
  
      // API request
      const response = await apiService.get(
        `/api/employee-registration/download-document?contact=${encodeURIComponent(
          contact
        )}&documentType=${normalizedDocumentType}`,
        { responseType: "blob" }
      );
  
      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
  
      // Trigger file download
      const fileName = `${normalizedDocumentType}_${contact}.${
        contentType.includes("pdf") ? "pdf" : "jpg"
      }`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error downloading document:", error);
      alert(
        error.response?.status === 404
          ? `Document of type "${documentType}" not found.`
          : "Failed to download the document."
      );
    }
  };
  
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = selectedEmployee
      ? `/api/employee-registration/update-by-contact`
      : "/api/employee-registration";
    const method = selectedEmployee ? "post" : "post"; // Both are POST in this case

    const payload = {
      ...employee,
      isApproved: employee.isApproved, // Ensure isApproved is submitted correctly
      isBlocked: employee.isBlocked,
    };

    try {
      const response = await apiService[method](endpoint, payload);
      if (response?.data?.status === "Success") {
        alert(
          selectedEmployee
            ? "Employee updated successfully!"
            : "Employee created successfully!"
        );
        fetchEmployees(); // Refresh employees list
        resetForm();
      } else {
        throw new Error(response?.data?.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Error submitting employee form:", error);
      alert("Failed to save employee data.");
    }
  };

  const resetForm = () => {
    setEmployee({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      email: "",
      contact: "+91", // Default prefix
      address: "",
      panCardFilePath: "",
      aadhaarCardFilePath: "",
      passbookFilePath: "",
      isBlocked: false,
      isApproved: false,
    });
    setSelectedEmployee(null);
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEmployee({
      ...employee,
      dateOfBirth: employee.dateOfBirth
        ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: employee.gender ? capitalize(employee.gender) : "",
      maritalStatus: employee.maritalStatus
        ? capitalize(employee.maritalStatus)
        : "",
    });
    setShowForm(true);
  };

  const openDialog = (id) => {
    setEmployeeToDelete(id);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await apiService.post(
        "/api/employee-registration/delete",
        employeeToDelete
      );

      if (response?.data?.status === "Success") {
        alert("Employee deleted successfully.");
        fetchEmployees(); // Refresh the employee list
        setDialogOpen(false); // Close the confirmation dialog
      } else {
        throw new Error(
          response?.data?.message || "Failed to delete employee."
        );
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    }
  };

  const getDisplayValueWithTooltip = (value) => (
    <Tooltip title={value ? "" : "Incomplete field"}>
      <span>{value || "Not Provided"}</span>
    </Tooltip>
  );

  const renderDocumentField = (label, filePath, documentType, contact) => (
    <Grid item xs={12} sm={4}>
      <Box sx={{ padding: 2, textAlign: "center", gap: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {label}
        </Typography>
        <TextField
          fullWidth
          value={filePath || "Not Uploaded"} 
          InputProps={{ readOnly: true }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="View">
            <span>
              <IconButton
                onClick={() => handleView(contact, documentType)} // Pass contact first
                disabled={!filePath}
              >
                <Visibility />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Download">
            <span>
              <IconButton
                onClick={() => handleDownload(contact, documentType)} // Pass contact first
                disabled={!filePath}
              >
                <Download />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Grid>
  );
  
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Employee Management
      </Typography>

      {/* Search and Filters */}
      {!showForm && (
        <Box
          sx={{ display: "flex", gap: 2, marginBottom: 2, flexWrap: "wrap" }}
        >
          <TextField
            fullWidth
            label="Search by Name, Email, or Address"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            name="isBlocked"
            value={filters.isBlocked}
            onChange={handleFilterChange}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Blocked</MenuItem>
            <MenuItem value="false">Not Blocked</MenuItem>
          </Select>
          <Select
            name="isApproved"
            value={filters.isApproved}
            onChange={handleFilterChange}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Approved</MenuItem>
            <MenuItem value="false">Not Approved</MenuItem>
          </Select>
          <Select
            name="dataStatus"
            value={filters.dataStatus}
            onChange={handleFilterChange}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
            <MenuItem value="incomplete">Incomplete</MenuItem>
          </Select>
        </Box>
      )}

      {/* Loading Indicator */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : showForm ? (
        /* Create/Edit Form */
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 4,
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", marginBottom: 3 }}
          >
            {selectedEmployee ? "Edit Employee" : "Create Employee"}
          </Typography>

          {/* Contact Field */}
          <TextField
            fullWidth
            label="Contact"
            type="text"
            name="contact"
            value={employee.contact || ""}
            onChange={(e) =>
              setEmployee((prev) => ({ ...prev, contact: e.target.value }))
            }
            required
            sx={{ marginBottom: 2 }}
          />

          {/* Edit Mode Specific Fields */}
          {selectedEmployee && (
            <Grid container spacing={2} sx={{ marginBottom: 3 }}>
              {["firstName", "lastName", "email", "address"].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    type="text"
                    name={field}
                    value={employee[field] || ""}
                    onChange={handleChange}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={employee.dateOfBirth || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  name="gender"
                  value={employee.gender || ""}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Gender
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  name="maritalStatus"
                  value={employee.maritalStatus || ""}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Marital Status
                  </MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </Grid>

              {/* Document Fields */}
              {["PAN", "Aadhaar", "Passbook"].map((docType) => {
                const docKey =
                  docType === "Passbook"
                    ? "passbookFilePath"
                    : `${docType.toLowerCase()}CardFilePath`;
                return (
                  <Grid item xs={12} key={docType}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {docType} Document
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <TextField
                        fullWidth
                        value={employee[docKey] || "Not Uploaded"}
                        InputProps={{ readOnly: true }}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => handleView(employee.contact, docType)}
                        disabled={!employee[docKey]}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleDownload(employee.contact, docType)
                        }
                        disabled={!employee[docKey]}
                      >
                        Download
                      </Button>
                    </Box>
                  </Grid>
                );
              })}
              {/* Conditional Fields for Edit Employee */}
              {selectedEmployee && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isBlocked"
                        checked={employee.isBlocked || false}
                        onChange={(e) =>
                          setEmployee((prev) => ({
                            ...prev,
                            isBlocked: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Is Blocked"
                  />
                  <FormControlLabel
                      control={
                        <Checkbox
                          name="isApproved"
                          checked={employee.isApproved}
                          disabled={employee.isAssigned} // Disable if assigned
                          onChange={async (e) => {
                            const isChecked = e.target.checked;

                            // Update state
                            setEmployee((prev) => ({ ...prev, isApproved: isChecked }));

                            // Trigger API call for approval
                            if (isChecked && selectedEmployee?.id) {
                              const token = localStorage.getItem("token");
                              if (!token) {
                                alert("Session expired. Please log in again.");
                                return;
                              }

                              try {
                                const response = await fetch(
                                  `https://hrmsasp.runasp.net/api/employee-registration/update-is-approved`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ employeeId: selectedEmployee.id }),
                                  }
                                );

                                if (!response.ok) {
                                  throw new Error("Failed to update approval status.");
                                }

                                alert("Employee approval updated successfully!");
                              } catch (error) {
                                alert("Error approving employee.");
                              }
                            }
                          }}
                        />
                      }
                      label="I have verified"
                    />
                  </Box>
              )}
            </Grid>
          )}

          {/* Submit and Cancel Buttons */}
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
        /* Employee Table and Add Button */
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setSelectedEmployee(null); // Clear any selected employee
              resetForm(); // Reset form values
              setShowForm(true); // Show the form
            }}
            sx={{
              marginBottom: 2,
              padding: "8px 16px",
              fontWeight: "bold",
            }}
          >
            <IoIosAddCircle /> Add Employee
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees
                  .filter((employee) => {
                    const matchesSearchQuery =
                      employee.firstName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      employee.lastName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      employee.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      employee.address
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());

                    const matchesBlockedFilter =
                      filters.isBlocked === "" ||
                      employee.isBlocked.toString() === filters.isBlocked;

                    const matchesApprovedFilter =
                      filters.isApproved === "" ||
                      employee.isApproved.toString() === filters.isApproved;

                    const matchesDataStatusFilter = (() => {
                      if (filters.dataStatus === "complete") {
                        return (
                          employee.firstName &&
                          employee.lastName &&
                          employee.email &&
                          employee.address
                        );
                      }
                      if (filters.dataStatus === "incomplete") {
                        return (
                          !employee.firstName &&
                          !employee.lastName &&
                          !employee.email &&
                          !employee.address
                        );
                      }
                      return true;
                    })();

                    return (
                      matchesSearchQuery &&
                      matchesBlockedFilter &&
                      matchesApprovedFilter &&
                      matchesDataStatusFilter
                    );
                  })
                  .map((employee, index) => (
                    <TableRow key={employee.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{employee.firstName || "N/A"}</TableCell>
                      <TableCell>{employee.lastName || "N/A"}</TableCell>
                      <TableCell>{employee.contact || "N/A"}</TableCell>
                      <TableCell>{employee.email || "N/A"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleEdit(employee)}
                          >
                            <FaEdit className="me-1" /> Edit
                          </Button>
                          <Button
                            onClick={() => openDialog(employee.id)}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <MdDelete className="me-1" /> Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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

export default EmployeeComponent;
