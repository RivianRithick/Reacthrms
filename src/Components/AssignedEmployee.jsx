import React, { useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaCloudUploadAlt } from "react-icons/fa";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

const baseUrl = process.env.REACT_APP_BASE_URL;

const AssignedEmployee = () => {
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [assignedEmployeeMap, setAssignedEmployeeMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Initial fetch
    fetchAssignedEmployees();

    // Set up polling with a longer interval (e.g., 30 seconds instead of 5)
    const pollInterval = setInterval(() => {
      fetchAssignedEmployees();
    }, 30000); // Poll every 30 seconds instead of 5 seconds

    // Cleanup function
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []); // Empty dependency array

  const fetchAssignedEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const [roleAssignResponse, assignedEmployeeResponse] = await Promise.all([
        fetch(`${baseUrl}/api/employeeroleassign?isAssigned=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch(`${baseUrl}/api/assignedemployee`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const roleAssignData = roleAssignResponse.ok
        ? await roleAssignResponse.json()
        : { data: [] };
      const assignedEmployeeData = assignedEmployeeResponse.ok
        ? await assignedEmployeeResponse.json()
        : { data: [] };

      const roleAssignEmployees = Array.isArray(roleAssignData.data)
        ? roleAssignData.data
        : [];
      const assignedEmployees = Array.isArray(assignedEmployeeData.data)
        ? assignedEmployeeData.data
        : [];

      setAssignedEmployeeMap(new Map());

      const assignedMap = new Map(
        assignedEmployees.map((item) => [
          item.roleAssignId,
          {
            id: item.id,
            hasGeneratedOfferLetter: item.hasGeneratedOfferLetter || false
          }
        ])
      );

      setAssignedEmployees(roleAssignEmployees);
      setAssignedEmployeeMap(assignedMap);

      console.log('Updated AssignedEmployeeMap:', assignedMap);
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
      setError("Failed to fetch assigned employees.");
    } finally {
      setLoading(false);
    }
  };

  const updateLoadingMap = (id, isLoading) => {
    setLoadingMap((prev) => ({
      ...prev,
      [id]: isLoading,
    }));
  };

  const handleGenerateOfferLetter = async (employeeId, roleAssignId) => {
    setError("");
    setSuccessMessage("");
    updateLoadingMap(roleAssignId, true);

    try {
      const response = await fetch(
        `${baseUrl}/api/assignedemployee/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            employeeId,
            roleAssignId,
            generatedBy: "Admin",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate offer letter");
      }

      setSuccessMessage("Offer letter generated successfully!");
      fetchAssignedEmployees();
    } catch (error) {
      console.error("Error generating offer letter:", error);
      setError("Failed to generate offer letter.");
    } finally {
      updateLoadingMap(roleAssignId, false);
    }
  };

  const handleDownloadOfferLetter = async (assignedEmployeeId) => {
    setError("");
    const roleAssignId = assignedEmployees.find(
      emp => assignedEmployeeMap.get(emp.id) === assignedEmployeeId
    )?.id;
    updateLoadingMap(roleAssignId, true);

    try {
      const response = await fetch(
        `${baseUrl}/api/assignedemployee/download?id=${assignedEmployeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download the offer letter.");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `OfferLetter_${assignedEmployeeId}.pdf`;
      link.click();

      setSuccessMessage("Offer letter downloaded successfully!");
    } catch (error) {
      console.error("Error downloading offer letter:", error);
      setError("Failed to download offer letter.");
    } finally {
      updateLoadingMap(roleAssignId, false);
    }
  };

  const filteredEmployees = assignedEmployees.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const employeeName = `${item.employee?.firstName || ""} ${item.employee?.lastName || ""}`.toLowerCase();
    const clientName = item.client?.clientName?.toLowerCase() || "";
    const departmentName = item.department?.departmentName?.toLowerCase() || "";
    const jobTitle = item.jobRole?.jobTitle?.toLowerCase() || "";

    return (
      employeeName.includes(searchLower) ||
      clientName.includes(searchLower) ||
      departmentName.includes(searchLower) ||
      jobTitle.includes(searchLower)
    );
  });

  const clearAssignedEmployeeMap = (roleAssignId) => {
    setAssignedEmployeeMap(prev => {
      const newMap = new Map(prev);
      newMap.delete(roleAssignId);
      return newMap;
    });
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
        Assigned Employees
      </Typography>

      {/* Search & Filters Section */}
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
          label="Search by Employee Name, Client Name, Department Name, or Job Title"
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
          Assigned Employees List
        </Typography>

        {loading ? (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "200px" 
          }}>
            <CircularProgress />
          </Box>
        ) : filteredEmployees.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ 
            py: 4,
            color: 'text.secondary',
            fontSize: '1.1rem'
          }}>
            No assigned employees found.
          </Typography>
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Client</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Job Role</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((item, index) => (
                  <TableRow 
                    key={item.id}
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
                    <TableCell>
                      {`${item.employee?.firstName || "N/A"} ${item.employee?.lastName || ""}`}
                    </TableCell>
                    <TableCell>{item.client?.clientName || "N/A"}</TableCell>
                    <TableCell>{item.department?.departmentName || "N/A"}</TableCell>
                    <TableCell>{item.jobRole?.jobTitle || "N/A"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={!!assignedEmployeeMap.get(item.id)?.hasGeneratedOfferLetter || loadingMap[item.id]}
                          onClick={() => handleGenerateOfferLetter(item.employee?.id, item.id)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          {loadingMap[item.id] ? (
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                          ) : (
                            <FaCloudUploadAlt style={{ marginRight: '4px' }} />
                          )}
                          {assignedEmployeeMap.get(item.id)?.hasGeneratedOfferLetter ? "Generated" : "Generate"}
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          disabled={!assignedEmployeeMap.get(item.id) || loadingMap[item.id]}
                          onClick={() => handleDownloadOfferLetter(assignedEmployeeMap.get(item.id))}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          {loadingMap[item.id] ? (
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                          ) : (
                            <FaCloudDownloadAlt style={{ marginRight: '4px' }} />
                          )}
                          Download
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={4000} 
        onClose={() => setError("")}
      >
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignedEmployee;
