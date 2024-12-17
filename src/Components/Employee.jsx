import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "./ConfirmationDialog";
import CircularProgress from "@mui/material/CircularProgress";
import { MdDelete, MdClear, MdBlock } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit, FaIdCard, FaAddressCard, FaBook } from "react-icons/fa";
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
  InputAdornment,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControl,
} from "@mui/material";

const baseUrl = process.env.REACT_APP_BASE_URL;
const EmployeeComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [tempIsBlocked, setTempIsBlocked] = useState(false);
  const [tempBlockRemarks, setTempBlockRemarks] = useState("");
  const [tempIsApproved, setTempIsApproved] = useState(false);
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    email: "",
    contact: "+91",
    alternateContact: "+91",
    address: "",
    panCardFilePath: "",
    aadhaarCardFilePath: "",
    passbookFilePath: "",
    isBlocked: false,
    isApproved: false,
    status: "Pending",
    blockedRemarks: "",
    blockedBy: "",
    isDeleted: false,
    deletedBy: "",
    deletedOn: null,
    deleteRemarks: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    isBlocked: "",
    status: "",
    dataStatus: "all",
    showDeleted: false
  });
  const [showBlockRemarks, setShowBlockRemarks] = useState(false);
  const [deleteRemarks, setDeleteRemarks] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  useEffect(() => {
    console.log("Employee state:", employee);
  }, [employee]);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/api/employee-registration?includeDeleted=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 
            ? "You are not authorized to view employees" 
            : "Failed to fetch employees. Please try again later."
        );
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      if (data?.status !== "Success" || !Array.isArray(data.data)) {
        throw new Error("Invalid response format from server");
      }

      // Fetch verification details for each approved employee
      const employeesWithDetails = await Promise.all(
        data.data.map(async (emp) => {
          console.log('Raw employee data:', emp);
          
          const isDisabled = emp.isDisabled === true || 
                            emp.isDisabled === 1 || 
                            emp.disabledBy !== null || 
                            emp.disabledOn !== null;
          
          const employeeData = {
            ...emp,
            isActive: typeof emp.isActive === 'boolean' ? emp.isActive : true,
            isDisabled: isDisabled,
          };
          
          console.log('Processed employee data:', employeeData);
          
          if (emp.isApproved) {
            try {
              const verifyResponse = await fetch(
                `${baseUrl}/api/employee-registration/update-is-approved`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    employeeId: emp.id,
                    isApproved: emp.isApproved,
                  }),
                }
              );
              
              if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                return {
                  ...employeeData,
                  verifiedBy: verifyData.data.verifiedBy,
                  verifiedOn: verifyData.data.verifiedOn,
                };
              }
            } catch (error) {
              console.error("Error fetching verification details:", error);
            }
          }
          return employeeData;
        })
      );

      console.log("Processed Employees:", employeesWithDetails);
      console.log('Fetched employees:', employeesWithDetails);
      setEmployees(employeesWithDetails);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
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
      toast.error(
        error.response?.status === 404
          ? `${documentType} document not found for this employee`
          : error.response?.status === 401
          ? "You are not authorized to view documents"
          : "Failed to view the document. Please try again later."
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
      toast.error(
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
    setIsLoading(true);

    try {
      const formattedContact = employee.contact.startsWith('+91') 
        ? employee.contact 
        : `+91${employee.contact}`;

      if (!selectedEmployee) {
        // Create new employee - Let's modify this part
        const createPayload = {
          contact: formattedContact,
          status: "Pending",
          // Only include required fields for creation
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          gender: null,
          maritalStatus: null,
          email: null,
          alternateContact: null,
          address: null,
          panCardFilePath: null,
          aadhaarCardFilePath: null,
          passbookFilePath: null,
          isBlocked: false,
          isApproved: false,
          blockedRemarks: null
        };

        console.log('Create Payload:', createPayload); // For debugging

        const createResponse = await fetch(
          `${baseUrl}/api/employee-registration`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(createPayload),
          }
        );

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('API Error Response:', errorText); // For debugging
          let errorMessage;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || "Failed to create employee";
          } catch (e) {
            errorMessage = errorText || "Failed to create employee";
          }
          throw new Error(errorMessage);
        }

        const responseData = await createResponse.json();
        console.log('Create Response:', responseData); // For debugging

        toast.success("Employee created successfully!");
      } else {
        // Initialize updatedBlockData
        let updatedBlockData = null;

        // First handle block status if changed
        if (employee.isBlocked !== selectedEmployee.isBlocked) {
          const token = localStorage.getItem("token");
          let adminName = "Unknown Admin";
          
          if (token) {
            try {
              const decodedToken = decodeToken(token);
              // Use the specific claim for the admin's name
              adminName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Unknown Admin";
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          }

          const blockPayload = {
            EmployeeId: selectedEmployee.id,
            IsBlocked: employee.isBlocked,
            Remarks: employee.isBlocked ? tempBlockRemarks : "",
            BlockedBy: adminName
          };

          console.log('Block Payload:', blockPayload);

          const blockResponse = await fetch(
            `${baseUrl}/api/employee-registration/update-is-blocked`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(blockPayload),
            }
          );

          if (!blockResponse.ok) {
            const errorData = await blockResponse.json();
            throw new Error(errorData.message || "Failed to update block status");
          }

          const blockResult = await blockResponse.json();
          console.log('Block Response:', blockResult);
          updatedBlockData = blockResult.data;
        }

        // Get the latest employee state with block data
        const currentEmployeeState = {
          ...employee,
          isBlocked: updatedBlockData?.isBlocked ?? employee.isBlocked,
          blockedRemarks: updatedBlockData?.blockedRemarks ?? tempBlockRemarks,
          blockedBy: updatedBlockData?.blockedBy ?? employee.blockedBy,
          blockedOn: updatedBlockData?.blockedOn ?? employee.blockedOn
        };

        // Prepare the update payload
        const updatePayload = {
          ...currentEmployeeState,
          id: selectedEmployee.id,
          contact: formattedContact,
          status: currentEmployeeState.status,
          isActive: currentEmployeeState.status !== "Inactive",
          isApproved: currentEmployeeState.isApproved,
          dateOfBirth: currentEmployeeState.dateOfBirth || null,
          gender: currentEmployeeState.gender || null,
          maritalStatus: currentEmployeeState.maritalStatus || null,
          email: currentEmployeeState.email || null,
          address: currentEmployeeState.address || null,
          panCardFilePath: currentEmployeeState.panCardFilePath || null,
          aadhaarCardFilePath: currentEmployeeState.aadhaarCardFilePath || null,
          passbookFilePath: currentEmployeeState.passbookFilePath || null,
          BlockedRemarks: currentEmployeeState.blockedRemarks,
        };

        console.log('Update Payload:', updatePayload);

        const updateResponse = await fetch(
          `${baseUrl}/api/employee-registration/update-by-contact`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatePayload),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.message || "Failed to update employee");
        }

        const updateResult = await updateResponse.json();
        console.log('Update Response:', updateResult);

        toast.success("Employee updated successfully!");
      }

      await fetchEmployees();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error handling employee:", error);
      toast.error(error.message || "Failed to handle employee operation");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmployee((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      email: "",
      contact: "+91",
      alternateContact: "+91",
      address: "",
      panCardFilePath: "",
      aadhaarCardFilePath: "",
      passbookFilePath: "",
    }));

    setTempIsBlocked(false);
    setTempBlockRemarks("");
    setTempIsApproved(false);
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEmployee({
      ...employee,
      dateOfBirth: employee.dateOfBirth
        ? new Date(employee.dateOfBirth).toISOString().split('T')[0]
        : "",
      gender: employee.gender ? capitalize(employee.gender) : "",
      maritalStatus: employee.maritalStatus
        ? capitalize(employee.maritalStatus)
        : "",
      alternateContact: employee.alternateContact || "+91",
      blockedRemarks: employee.blockedRemarks || "",
      blockedBy: employee.blockedBy || "",
      isActive: employee.isActive ?? true,
    });
    setTempIsBlocked(employee.isBlocked);
    setTempBlockRemarks(employee.blockedRemarks || "");
    setTempIsApproved(employee.isApproved);
    setShowForm(true);
  };

  const openDialog = (id) => {
    setEmployeeToDelete(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/employee-registration/soft-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          employeeId: employeeToDelete.id,
          remarks: deleteRemarks,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update employee status");
      }

      const result = await response.json();
      console.log('Delete/Restore Response:', result);

      toast.success(employeeToDelete.isDeleted ? 
        "Employee enabled successfully" : 
        "Employee disabled successfully"
      );
      setDialogOpen(false);
      setDeleteRemarks("");
      setEmployeeToDelete(null);
      await fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || "Failed to update employee status");
    }
  };

  const getDisplayValueWithTooltip = (value) => (
    <Tooltip title={value ? "" : "Incomplete field"}>
      <span>{value || "Not Provided"}</span>
    </Tooltip>
  );

  const renderDocumentField = (label, filePath, documentType, contact) => (
    <Grid item xs={12} sm={4}>
      <Box 
        sx={{ 
          padding: 3,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }
        }}
      >
        {/* Document Icon and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {documentType === "PAN" && <FaIdCard size={24} color="#1976d2" />}
          {documentType === "Aadhaar" && <FaAddressCard size={24} color="#1976d2" />}
          {documentType === "Passbook" && <FaBook size={24} color="#1976d2" />}
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {label}
          </Typography>
        </Box>

        {/* Status Indicator */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            backgroundColor: filePath ? 'success.soft' : 'warning.soft',
            padding: 1,
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: filePath ? 'success.main' : 'warning.main'
            }}
          />
          <Typography 
            variant="body2" 
            color={filePath ? 'success.main' : 'warning.main'}
          >
            {filePath ? 'Document Uploaded' : 'Not Uploaded'}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1,
            marginTop: 'auto'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Visibility />}
            onClick={() => handleView(contact, documentType)}
            disabled={!filePath}
            fullWidth
            sx={{
              textTransform: 'none',
              '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'action.disabled'
              }
            }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Download />}
            onClick={() => handleDownload(contact, documentType)}
            disabled={!filePath}
            fullWidth
            sx={{
              textTransform: 'none',
              '&.Mui-disabled': {
                borderColor: 'action.disabledBackground',
                color: 'action.disabled'
              }
            }}
          >
            Download
          </Button>
        </Box>
      </Box>
    </Grid>
  );

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded token payload:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Create date object at noon UTC
    const date = new Date(dateString + 'T12:00:00Z');
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'success.main';
        case 'inactive':
            return 'error.main';
        case 'pending':
            return 'warning.main';
        default:
            return 'text.secondary';
    }
  };

  const getFilteredEmployees = (employees, filters, searchQuery) => {
    if (!Array.isArray(employees)) return [];
    
    return employees.filter(employee => {
      // Basic search filter
      const matchesSearchQuery =
        searchQuery === "" || // If no search query, show all
        (employee.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (employee.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (employee.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (employee.address?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      // Show deleted or non-deleted based on filter
      const matchesDeletedFilter = filters.showDeleted === employee.isDeleted;

      // Other filters only apply to non-deleted employees
      if (!filters.showDeleted) {
        const matchesBlockedFilter =
          filters.isBlocked === "" ||
          employee.isBlocked.toString() === filters.isBlocked;

        const matchesDataStatusFilter = (() => {
          if (filters.dataStatus === "complete") {
            return employee.firstName && employee.lastName && employee.email && employee.address;
          }
          if (filters.dataStatus === "incomplete") {
            return !employee.firstName || !employee.lastName || !employee.email || !employee.address;
          }
          return true;
        })();

        const matchesStatusFilter =
          !filters.status || employee.status === filters.status;

        return (
          matchesSearchQuery &&
          matchesDeletedFilter &&
          matchesBlockedFilter &&
          matchesDataStatusFilter &&
          matchesStatusFilter
        );
      }

      // For deleted employees, only apply search filter
      return matchesSearchQuery && matchesDeletedFilter;
    });
  };

  const filteredEmployees = getFilteredEmployees(employees, filters, searchQuery);

  // Before returning filtered employees
  console.log('Filter conditions:', {
    searchQuery,
    filters,
    totalEmployees: employees.length,
    filteredCount: filteredEmployees.length,
    sampleEmployee: employees[0]
  });

  // In the component, before rendering the table
  console.log('Current filters:', filters);
  console.log('All employees:', employees);
  console.log('Filtered employees:', filteredEmployees);

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
        Employee Management
      </Typography>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {isLoading ? (
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
            {selectedEmployee ? "Edit Employee" : "Create Employee"}
          </Typography>

          {/* Contact Field - Create Mode */}
          {!selectedEmployee && (
            <Grid container spacing={2} sx={{ marginBottom: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact"
                  type="text"
                  name="contact"
                  value={employee.contact}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '+91' || (value.startsWith('+91') && /^\+91\d*$/.test(value))) {
                      setEmployee(prev => ({
                        ...prev,
                        contact: value
                      }));
                    }
                  }}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setEmployee(prev => ({ ...prev, contact: '+91' }))}
                          title="Clear Contact"
                        >
                          <MdClear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Edit Mode Fields */}
          {selectedEmployee && (
            <>
              {/* Contact and Alternate Contact fields */}
              <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact"
                    type="text"
                    name="contact"
                    value={employee.contact}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '+91' || (value.startsWith('+91') && /^\+91\d*$/.test(value))) {
                        setEmployee(prev => ({
                          ...prev,
                          contact: value
                        }));
                      }
                    }}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setEmployee(prev => ({ ...prev, contact: '+91' }))}
                            title="Clear Contact"
                          >
                            <MdClear />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alternate Contact"
                    type="text"
                    name="alternateContact"
                    value={employee.alternateContact}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '+91' || (value.startsWith('+91') && /^\+91\d*$/.test(value))) {
                        setEmployee(prev => ({
                          ...prev,
                          alternateContact: value
                        }));
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setEmployee(prev => ({ ...prev, alternateContact: '+91' }))}
                            title="Clear Alternate Contact"
                          >
                            <MdClear />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Personal Information Fields */}
              <Grid container spacing={2}>
                {["firstName", "lastName", "email", "address"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={employee[field] || ""}
                      onChange={handleChange}
                      required={field !== "address"}
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
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={employee.gender || ""}
                      onChange={handleChange}
                      label="Gender"
                    >
                      <MenuItem value="" disabled>Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      name="maritalStatus"
                      value={employee.maritalStatus || ""}
                      onChange={handleChange}
                      label="Marital Status"
                    >
                      <MenuItem value="" disabled>Select Marital Status</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Document Management Section */}
              <Grid container spacing={2} sx={{ marginTop: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Document Management
                  </Typography>
                </Grid>
                
                {/* PAN Card */}
                {renderDocumentField(
                  "PAN Card",
                  employee.panCardFilePath,
                  "PAN",
                  employee.contact
                )}

                {/* Aadhaar Card */}
                {renderDocumentField(
                  "Aadhaar Card",
                  employee.aadhaarCardFilePath,
                  "Aadhaar",
                  employee.contact
                )}

                {/* Passbook */}
                {renderDocumentField(
                  "Passbook",
                  employee.passbookFilePath,
                  "Passbook",
                  employee.contact
                )}
              </Grid>

              {/* Status Controls at the Bottom */}
              <Grid container spacing={2} sx={{ marginTop: 3 }}>
                <Grid item xs={12}>
                  {/* Debug logs */}
                  {console.log("Employee Data:", {
                    id: employee.id,
                    firstName: employee.firstName,
                    isActive: employee.isActive,
                    isBlocked: employee.isBlocked,
                    isApproved: employee.isApproved,
                    isAssigned: employee.isAssigned
                  })}

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    padding: 2,
                    borderRadius: 1
                  }}>
                    {/* Block/Unblock Button */}
                    <Button
                      variant="contained"
                      color={employee.isBlocked ? "error" : "warning"}
                      onClick={() => {
                        setTempIsBlocked(!employee.isBlocked);
                        if (!employee.isBlocked) {
                          setBlockDialogOpen(true);
                        } else {
                          setEmployee(prev => ({
                            ...prev,
                            isBlocked: false,
                            blockedRemarks: ""
                          }));
                        }
                      }}
                      startIcon={employee.isBlocked ? <MdClear /> : <MdDelete />}
                      disabled={employee.isAssigned || employee.isApproved || employee.status === "Inactive"}
                    >
                      {employee.isBlocked ? "Unblock" : "Block"}
                    </Button>

                    {/* Add Set Inactive/Active Button */}
                    <Button
                      variant="contained"
                      color={employee.status === "Inactive" ? "success" : "error"}
                      onClick={() => {
                        setEmployee(prev => ({
                          ...prev,
                          status: prev.status === "Inactive" ? "Pending" : "Inactive",
                          isApproved: false
                        }));
                      }}
                      startIcon={employee.status === "Inactive" ? <IoIosAddCircle /> : <MdClear />}
                      disabled={employee.isBlocked || employee.isApproved || employee.isAssigned}
                    >
                      {employee.status === "Inactive" ? "Set Active" : "Set Inactive"}
                    </Button>

                    {/* Verify/Unverify Button */}
                    <Button
                      variant="contained"
                      color={employee.isApproved ? "success" : "primary"}
                      onClick={() => {
                        setTempIsApproved(!employee.isApproved);
                        setEmployee(prev => ({
                          ...prev,
                          isApproved: !prev.isApproved,
                          status: !prev.isApproved ? "Active" : "Pending"
                        }));
                      }}
                      startIcon={employee.isApproved ? <MdClear /> : <IoIosAddCircle />}
                      disabled={employee.isBlocked || employee.isAssigned || employee.status === "Inactive"}
                    >
                      {employee.isApproved ? "Unverify" : "Verify"}
                    </Button>

                    {/* View Block Remarks Button - Only show if blocked */}
                    {employee.isBlocked && (
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={() => setShowBlockRemarks(true)}
                        startIcon={<MdClear />}
                      >
                        View Block Remarks
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

          {/* Submit and Cancel Buttons */}
          <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
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
              {/* Search Field - Full Width */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search by Name, Email, or Address"
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
              
              {/* Status Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Status Filter</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </Box>
              </Grid>

              {/* Block Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Block Filter</InputLabel>
                  <Select
                    name="isBlocked"
                    value={filters.isBlocked}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Blocked</MenuItem>
                    <MenuItem value="false">Not Blocked</MenuItem>
                  </Select>
                </Box>
              </Grid>

              {/* Data Completion Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Data Completion Filter</InputLabel>
                  <Select
                    name="dataStatus"
                    value={filters.dataStatus}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="complete">Complete</MenuItem>
                    <MenuItem value="incomplete">Incomplete</MenuItem>
                  </Select>
                </Box>
              </Grid>

              {/* Show Deleted Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Status</InputLabel>
                  <Select
                    name="showDeleted"
                    value={filters.showDeleted}
                    onChange={handleFilterChange}
                    fullWidth
                  >
                    <MenuItem value={false}>Active Employees</MenuItem>
                    <MenuItem value={true}>Disabled Employees</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Employees List Section */}
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
                Employees List
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setSelectedEmployee(null);
                  resetForm();
                  setShowForm(true);
                }}
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
                <IoIosAddCircle sx={{ marginRight: 1 }} /> Add Employee
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
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>First Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Verification Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Active Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell 
                        colSpan={8} 
                        align="center"
                        sx={{ 
                          py: 4,
                          color: 'text.secondary',
                          fontSize: '1.1rem'
                        }}
                      >
                        No employees found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee, index) => (
                      <TableRow 
                        key={employee.id}
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
                        <TableCell>{employee.firstName || "N/A"}</TableCell>
                        <TableCell>{employee.lastName || "N/A"}</TableCell>
                        <TableCell>{employee.contact || "N/A"}</TableCell>
                        <TableCell>{employee.email || "N/A"}</TableCell>
                        <TableCell>
                          {employee.isApproved ? (
                            <Tooltip 
                              title={`Verified on: ${
                                employee.verifiedOn 
                                  ? new Date(employee.verifiedOn).toLocaleDateString()
                                  : 'Date not available'
                              }`}
                            >
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'success.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                ✓ Verified by {employee.verifiedBy || "Unknown"}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography 
                              variant="body2" 
                              sx={{ color: 'text.secondary' }}
                            >
                              Not Verified
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: getStatusColor(employee.status),
                              fontWeight: 'medium'
                            }}
                          >
                            {employee.status || "Pending"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() => handleEdit(employee)}
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
                              onClick={() => {
                                setEmployeeToDelete(employee);
                                setDialogOpen(true);
                              }}
                              variant="contained"
                              color={employee.isDeleted ? "success" : "error"}
                              size="small"
                              disabled={employee.status !== "Inactive"}
                              sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.2s'
                                }
                              }}
                            >
                              <MdDelete sx={{ marginRight: 0.5 }} /> 
                              {employee.isDeleted ? "Enable" : "Disable"}
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

      {/* Confirmation Dialogs */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setDeleteRemarks("");
          setEmployeeToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {employeeToDelete?.isDeleted ? "Enable Employee" : "Disable Employee"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to {employeeToDelete?.isDeleted ? "enable" : "disable"} this employee?
          </Typography>
          <TextField
            fullWidth
            label={`${employeeToDelete?.isDeleted ? "Enable" : "Disable"} Remarks`}
            multiline
            rows={4}
            value={deleteRemarks}
            onChange={(e) => setDeleteRemarks(e.target.value)}
            required
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              setDeleteRemarks("");
              setEmployeeToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            color={employeeToDelete?.isDeleted ? "success" : "error"}
            variant="contained"
          >
            {employeeToDelete?.isDeleted ? "Enable" : "Disable"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>
          {tempIsBlocked ? "Block Employee" : "Unblock Employee"}
        </DialogTitle>
        <DialogContent>
          {tempIsBlocked && (
            <TextField
              fullWidth
              label="Block Remarks"
              multiline
              rows={4}
              value={tempBlockRemarks}
              onChange={(e) => setTempBlockRemarks(e.target.value)}
              required
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setBlockDialogOpen(false);
            setTempIsBlocked(employee.isBlocked);
            setTempBlockRemarks(employee.blockedRemarks || "");
          }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setEmployee(prev => ({
                ...prev,
                isBlocked: tempIsBlocked,
                blockedRemarks: tempIsBlocked ? tempBlockRemarks : ""
              }));
              setBlockDialogOpen(false);
            }}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeComponent;
