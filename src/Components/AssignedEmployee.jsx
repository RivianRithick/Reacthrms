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

const AssignedEmployee = () => {
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [assignedEmployeeMap, setAssignedEmployeeMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState({}); // Track loading per employee
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssignedEmployees();
  }, []);

  const fetchAssignedEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const [roleAssignResponse, assignedEmployeeResponse] = await Promise.all([
        fetch("https://hrmsasp.runasp.net/api/employeeroleassign?isAssigned=true", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch("https://hrmsasp.runasp.net/api/assignedemployee", {
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

      const assignedMap = new Map(
        assignedEmployees.map((item) => [item.roleAssignId, item.id])
      );

      setAssignedEmployees(roleAssignEmployees);
      setAssignedEmployeeMap(assignedMap);
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
      setError(error.message || "Failed to fetch assigned employees.");
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
    updateLoadingMap(roleAssignId, true); // Set loading state for this roleAssignId

    try {
      const response = await fetch("https://hrmsasp.runasp.net/api/assignedemployee/create", {
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate offer letter");
      }

      setSuccessMessage("Offer letter generated successfully!");
      fetchAssignedEmployees(); // Refresh both lists
    } catch (error) {
      console.error("Error generating offer letter:", error);
      setError(error.message);
    } finally {
      updateLoadingMap(roleAssignId, false); // Reset loading state for this roleAssignId
    }
  };

  const handleDownloadOfferLetter = async (roleAssignId) => {
    setError("");
    const assignedEmployeeId = assignedEmployeeMap.get(roleAssignId);
  
    if (!assignedEmployeeId) {
      setError("Offer letter not found for this employee.");
      return;
    }
  
    updateLoadingMap(roleAssignId, true); // Set loading state for this roleAssignId
  
    try {
      const response = await fetch(
        `https://hrmsasp.runasp.net/api/assignedemployee/download?id=${assignedEmployeeId}`,
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
  
      // Fetch the PDF blob
      const blob = await response.blob();
  
      // Create a link to download the file
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `OfferLetter_${assignedEmployeeId}.pdf`;
      link.click();
  
      setSuccessMessage("Offer letter downloaded successfully!");
    } catch (error) {
      console.error("Error downloading offer letter:", error);
      setError(error.message || "Failed to download offer letter.");
    } finally {
      updateLoadingMap(roleAssignId, false); // Reset loading state for this roleAssignId
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Assigned Employees
      </Typography>

      <TextField
        fullWidth
        label="Search by Employee Name, Client Name, Department Name, or Job Title"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading && (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Job Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {`${item.employee?.firstName || "N/A"} ${item.employee?.lastName || "N/A"}`}
                </TableCell>
                <TableCell>{item.client?.clientName || "N/A"}</TableCell>
                <TableCell>{item.department?.departmentName || "N/A"}</TableCell>
                <TableCell>{item.jobRole?.jobTitle || "N/A"}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={loadingMap[item.id]}
                      onClick={() => handleGenerateOfferLetter(item.employee?.id, item.id)}
                    >
                      {loadingMap[item.id] ? <CircularProgress size={20} /> : <FaCloudUploadAlt />}
                      Generate
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={loadingMap[item.id]}
                      onClick={() => handleDownloadOfferLetter(item.id)}
                    >
                      {loadingMap[item.id] ? <CircularProgress size={20} /> : <FaCloudDownloadAlt />}
                      Download
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssignedEmployee;

