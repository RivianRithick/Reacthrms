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
} from "@mui/material";

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

  // Fetch all employees based on filter
  const normalizeEmployees = (data) => {
    return data.map((item) => {
      const employeeData = item.employee || item; // Extract nested data if present
      return {
        id: item.id,
        isAssigned: item.isAssigned,
        firstName: employeeData.firstName || "N/A",
        lastName: employeeData.lastName || "N/A",
        email: employeeData.email || "N/A",
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
          fetch("https://hrmsasp.runasp.net/api/employeeroleassign?isAssigned=true", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("https://hrmsasp.runasp.net/api/employeeroleassign/approved-and-unassigned", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
  
        const assignedData = assignedResponse.ok ? await assignedResponse.json() : [];
        const unassignedData = unassignedResponse.ok ? await unassignedResponse.json() : [];
  
        employeesData = [
          ...normalizeEmployees(Array.isArray(unassignedData) ? unassignedData : unassignedData?.data || []),
          ...normalizeEmployees(Array.isArray(assignedData) ? assignedData : assignedData?.data || []),
        ];
      } else if (assignmentFilter === "assigned") {
        const response = await fetch(
          "https://hrmsasp.runasp.net/api/employeeroleassign?isAssigned=true",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = response.ok ? await response.json() : [];
        employeesData = normalizeEmployees(Array.isArray(result) ? result : result?.data || []);
      } else if (assignmentFilter === "notAssigned") {
        const response = await fetch(
          "https://hrmsasp.runasp.net/api/employeeroleassign/approved-and-unassigned",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = response.ok ? await response.json() : [];
        employeesData = normalizeEmployees(Array.isArray(result) ? result : result?.data || []);
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
      const clientResponse = await fetch("https://hrmsasp.runasp.net/api/client-registration", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const departmentResponse = await fetch("https://hrmsasp.runasp.net/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!clientResponse.ok || !departmentResponse.ok) {
        throw new Error("Failed to fetch dropdown data");
      }
  
      const clientsData = await clientResponse.json();
      const departmentsData = await departmentResponse.json();
  
      // Filter out blocked clients based on `isBlocked` field
      const activeClients = (clientsData.data || []).filter((client) => !client.isBlocked);
  
      console.log("Filtered Active Clients:", activeClients);
  
      setClients(activeClients);
      setDepartments(departmentsData.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setError("Failed to fetch dropdown data.");
    }
  };
  
  

  // Filter employees whenever data or search changes
  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery]);

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
    console.log(`Unassign logic for employee with id: ${employeeId}`); // Log the ID

    if (!employeeId) {
      setError("Invalid employee ID for unassigning.");
      return;
    }

    const url = "https://hrmsasp.runasp.net/api/employeeroleassign/unassign";
    const payload = { EmployeeRoleAssignId: employeeId };

    console.log("Sending unassign request:", payload); // Log the payload

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

      // Update the employee state
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === employeeId
            ? {
              ...emp,
              isAssigned: false,
              client: null,
              department: null,
              jobRole: null,
            }
            : emp
        )
      );
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
      const response = await fetch("https://hrmsasp.runasp.net/api/employeeroleassign/create", {
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
      fetchEmployeesByFilter(); // Refresh the list
      handleCloseModal();
    } catch (error) {
      setError(`Error in assignment: ${error.message}`);
    }
  };


 // Handle department change
 const handleDepartmentChange = (departmentId) => {
  setSelectedDepartmentId(departmentId);

  // Filter job roles based on the selected department
  const department = departments.find((dept) => dept.id === departmentId);
  setJobRoles(department?.jobRoles || []);
  setSelectedJobRoleId("");
};

return (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h4" gutterBottom>
      Employee Role Assignment
    </Typography>
    {loading && (
      <Box sx={{ display: "flex", justifyContent: "center", margin: 2 }}>
        <CircularProgress />
      </Box>
    )}
    {error && <Typography color="error">{error}</Typography>}
    {successMessage && <Typography color="success">{successMessage}</Typography>}

    <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 2 }}>
      <TextField
        fullWidth
        label="Search by Employee Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select
        value={assignmentFilter}
        onChange={(e) => setAssignmentFilter(e.target.value)}
        displayEmpty
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="assigned">Assigned</MenuItem>
        <MenuItem value="notAssigned">Not Assigned</MenuItem>
      </Select>
    </Box>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {filteredEmployees.map((employee, index) => (
    <TableRow key={employee.id}>
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
          >
            Unassign
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal(employee.id)}
          >
            Assign
          </Button>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
    </TableContainer>

    <Modal open={openModal} onClose={handleCloseModal}>
      <Box sx={{ padding: 3, backgroundColor: "white", margin: "100px auto", width: 400 }}>
        <Typography variant="h6" gutterBottom>
          Assign Role
        </Typography>
        <Select
  fullWidth
  value={selectedClientId}
  onChange={(e) => setSelectedClientId(e.target.value)}
  displayEmpty
  sx={{ marginBottom: 2 }}
>
  <MenuItem value="" disabled>
    Select Client
  </MenuItem>
  {clients.map((client) => (
    <MenuItem key={client.id} value={client.id}>
      {client.name}
    </MenuItem>
  ))}
</Select>
        <Select
          fullWidth
          value={selectedDepartmentId}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          displayEmpty
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="" disabled>
            Select Department
          </MenuItem>
          {departments.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          fullWidth
          value={selectedJobRoleId}
          onChange={(e) => setSelectedJobRoleId(e.target.value)}
          displayEmpty
          sx={{ marginBottom: 2 }}
          disabled={!selectedDepartmentId}
        >
          <MenuItem value="" disabled>
            Select Job Role
          </MenuItem>
          {jobRoles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.title}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" onClick={handleAssignmentAction} fullWidth>
          Submit
        </Button>
      </Box>
    </Modal>
  </Box>
);
};

export default EmployeeRoleAssign;
