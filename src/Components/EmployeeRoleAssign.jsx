import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  Modal,
  Grid,
  InputLabel,
} from "@mui/material";

const baseUrl = process.env.REACT_APP_BASE_URL;

const EmployeeRoleAssign = () => {
  const [employees, setEmployees] = useState([]); // All employees data
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Filtered employees
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal and dropdown state
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [clients, setClients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedJobRoleId, setSelectedJobRoleId] = useState("");

  // Add to your existing state declarations
  const [filterClientId, setFilterClientId] = useState("");
  const [filterDepartmentId, setFilterDepartmentId] = useState("");
  const [filterJobRoleId, setFilterJobRoleId] = useState("");

  // Fetch all employees based on filter
  const normalizeEmployees = (data) => {
    return data.map((item) => {
      // Check if the employee data is nested in the Employee property
      const employeeData = item.Employee || item.employee || item;
      return {
        id: item.Id || item.id,
        isAssigned: item.IsAssigned || item.isAssigned || false,
        firstName: employeeData.FirstName || employeeData.firstName || "N/A",
        lastName: employeeData.LastName || employeeData.lastName || "N/A",
        email: employeeData.Email || employeeData.email || "N/A",
        isDeleted: employeeData.IsDeleted || employeeData.isDeleted || false, // Add isDeleted field
        // Include additional properties from your API response
        clientName: item.Client?.ClientName || "N/A",
        clientCode: item.Client?.ClientCode || "N/A",
        departmentName: item.Department?.DepartmentName || "N/A",
        departmentCode: item.Department?.DepartmentCode || "N/A",
        jobTitle: item.JobRole?.JobTitle || "N/A",
        jobRoleCode: item.JobRole?.JobRoleCode || "N/A",
        hasGeneratedOfferLetter: item.HasGeneratedOfferLetter || false
      };
    });
  };
  
  const fetchEmployeesByFilter = async () => {
    setLoading(true);
    setError("");
  
    try {
      let employeesData = [];
  
      if (assignmentFilter === "all") {
        const [assignedResponse, unassignedResponse] = await Promise.all([
          fetch(`${baseUrl}/api/EmployeeRoleAssign?isAssigned=true`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`${baseUrl}/api/EmployeeRoleAssign/approved-and-unassigned`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
  
        const assignedData = assignedResponse.ok ? await assignedResponse.json() : [];
        const unassignedData = unassignedResponse.ok ? await unassignedResponse.json() : [];
  
        employeesData = [
          ...normalizeEmployees(unassignedData.data || []).filter(emp => !emp.isDeleted),
          ...normalizeEmployees(assignedData.data || []).filter(emp => !emp.isDeleted)
        ];
      } else if (assignmentFilter === "assigned") {
        const response = await fetch(
          `${baseUrl}/api/EmployeeRoleAssign?isAssigned=true`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = response.ok ? await response.json() : { data: [] };
        employeesData = normalizeEmployees(result.data || []).filter(emp => !emp.isDeleted);
      } else if (assignmentFilter === "notAssigned") {
        const response = await fetch(
          `${baseUrl}/api/EmployeeRoleAssign/approved-and-unassigned`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = response.ok ? await response.json() : { data: [] };
        employeesData = normalizeEmployees(result.data || []).filter(emp => !emp.isDeleted);
      }
  
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error.message || "Network error: Unable to fetch employees.");
    } finally {
      setLoading(false);
    }
  };
  

  // Apply search and filtering logic
  const filterEmployees = () => {
    if (!searchQuery) {
      setFilteredEmployees(employees); // If no search, show all
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.firstName?.toLowerCase().includes(lowercasedQuery) ||
        employee.lastName?.toLowerCase().includes(lowercasedQuery) ||
        employee.email?.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredEmployees(filtered);
  };

  // Fetch clients and departments
  const fetchDropdownData = async () => {
    try {
      const clientResponse = await fetch(`${baseUrl}/api/client-registration`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const departmentResponse = await fetch(`${baseUrl}/api/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!clientResponse.ok || !departmentResponse.ok) {
        throw new Error("Failed to fetch dropdown data");
      }
  
      const clientsData = await clientResponse.json();
      const departmentsData = await departmentResponse.json();
  
      // Debug logs for departments and job roles
      console.log('Raw departments data:', departmentsData);
      console.log('First department job roles:', departmentsData.data?.[0]?.jobRoles);
  
      const activeClients = (clientsData.data || []).filter((client) => !client.isBlocked);
      const departmentsWithRoles = departmentsData.data || [];
  
      setClients(activeClients);
      setDepartments(departmentsWithRoles);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setError("Failed to load dropdown data");
    }
  };
  
  // Filter employees whenever data or search changes
  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, assignmentFilter, filterClientId, filterDepartmentId, filterJobRoleId]);

  // Fetch employees and dropdowns on filter change
  useEffect(() => {
    fetchEmployeesByFilter();
    fetchDropdownData();
  }, [assignmentFilter]);


  const handleOpenModal = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenModal(true);
  };

  const handleUnassign = async (employeeId) => {
    if (!employeeId) {
      setError("Invalid employee ID for unassigning.");
      return;
    }

    const url = `${baseUrl}/api/EmployeeRoleAssign/unassign`;
    const payload = { EmployeeRoleAssignId: employeeId };

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
        setError(`Failed to unassign employee: ${errorText}`);
        return;
      }

      setSuccessMessage("Unassigned successfully!");
      
      // Update states and refetch data
      await fetchEmployeesByFilter();  // Refetch to get updated data
      handleCloseModal();

    } catch (error) {
      setError(`Error in unassigning: ${error.message}`);
    }
  };


  const handleCloseModal = () => {
    setSelectedEmployeeId(null);
    setSelectedClientId("");
    setSelectedDepartmentId("");
    setSelectedJobRoleId("");
    setOpenModal(false);
  };

  const handleAssignmentAction = async () => {
    if (!selectedEmployeeId || !selectedClientId || !selectedDepartmentId || !selectedJobRoleId) {
      setError("All fields are required for assignment.");
      return;
    }

    const payload = {
      EmployeeRegistrationId: selectedEmployeeId,
      ClientRegistrationId: selectedClientId,
      DepartmentId: selectedDepartmentId,
      JobRoleId: selectedJobRoleId,
    };

    try {
      const response = await fetch(`${baseUrl}/api/EmployeeRoleAssign/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.status === "Fail") {
        setError(result.message || "Failed to assign employee.");
        return;
      }

      setSuccessMessage("Assigned successfully!");
      
      // Update states and refetch data
      await fetchEmployeesByFilter();  // Refetch to get updated data
      handleCloseModal();

    } catch (error) {
      setError(`Error in assignment: ${error.message}`);
    }
  };


 // Handle department change
 const handleDepartmentChange = (departmentId) => {
  setSelectedDepartmentId(departmentId);
  setSelectedJobRoleId(""); // Reset job role selection

  const department = departments.find((dept) => dept.id === departmentId);
  console.log('Selected department:', department);
  console.log('Department job roles:', department?.jobRoles);

  if (department && department.jobRoles) {
    const mappedJobRoles = department.jobRoles.map(role => {
      console.log('Processing role:', role); // Log each role being processed
      return {
        id: role.id,
        title: role.title,
        jobRoleCode: role.jobRoleCode || role.code || 'No Code', // Try both possible property names
        departmentId: role.departmentId
      };
    });
    console.log('Mapped job roles:', mappedJobRoles);
    setJobRoles(mappedJobRoles);
  } else {
    setJobRoles([]);
  }
};

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
      Employee Role Assignment
    </Typography>

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
            label="Search by Name or Email"
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
        
        {/* Assignment Status Filter */}
        <Grid item xs={12}>
          <Box sx={{ 
            backgroundColor: 'white', 
            padding: 2, 
            borderRadius: 1,
            height: '100%'
          }}>
            <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Assignment Status</InputLabel>
            <Select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ 
                '& .MuiSelect-select': {
                  padding: '10px 14px',
                }
              }}
            >
              <MenuItem value="all">All Employees</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="notAssigned">Not Assigned</MenuItem>
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
      <Typography variant="h5" sx={{ 
        fontWeight: "bold", 
        color: "primary.main",
        marginBottom: 3 
      }}>
        Employees List
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", margin: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={5} 
                    align="center"
                    sx={{ 
                      py: 4,
                      color: 'text.secondary',
                      fontSize: '1.1rem'
                    }}
                  >
                    No employees found
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
                    <TableCell>{employee.firstName}</TableCell>
                    <TableCell>{employee.lastName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      {employee.isAssigned ? (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleUnassign(employee.id)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          Unassign
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenModal(employee.id)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          Assign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>

    {/* Assignment Modal */}
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Assign Role
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select
              fullWidth
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select Client</MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {`${client.name} (${client.clientCode || 'No Code'})`}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Select
              fullWidth
              value={selectedDepartmentId}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select Department</MenuItem>
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {`${department.name} (${department.departmentCode || 'No Code'})`}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Select
              fullWidth
              value={selectedJobRoleId}
              onChange={(e) => setSelectedJobRoleId(e.target.value)}
              displayEmpty
              disabled={!selectedDepartmentId}
            >
              <MenuItem value="" disabled>Select Job Role</MenuItem>
              {jobRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.jobRoleCode ? `${role.title} (${role.jobRoleCode})` : role.title}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAssignmentAction}
              fullWidth
              sx={{
                mt: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>

    {/* Error and Success Messages */}
    {error && (
      <Typography 
        color="error" 
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          bgcolor: 'error.light',
          color: 'white',
          padding: 2,
          borderRadius: 1,
          boxShadow: 2
        }}
      >
        {error}
      </Typography>
    )}
    {successMessage && (
      <Typography 
        color="success" 
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          bgcolor: 'success.light',
          color: 'white',
          padding: 2,
          borderRadius: 1,
          boxShadow: 2
        }}
      >
        {successMessage}
      </Typography>
    )}
  </Box>
);
};

export default EmployeeRoleAssign;
