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
    fetchAssignedEmployees();
  }, []);

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

      const assignedMap = new Map(
        assignedEmployees.map((item) => [item.roleAssignId, item.id])
      );

      setAssignedEmployees(roleAssignEmployees);
      setAssignedEmployeeMap(assignedMap);
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
    updateLoadingMap(assignedEmployeeId, true);

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
      updateLoadingMap(assignedEmployeeId, false);
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
      <Typography variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}>
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

      {loading ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredEmployees.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
          No assigned employees found.
        </Typography>
      ) : (
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
                        disabled={item.hasGeneratedOfferLetter || loadingMap[item.id]}
                        onClick={() => handleGenerateOfferLetter(item.employee?.id, item.id)}
                      >
                        {loadingMap[item.id] ? <CircularProgress size={20} /> : <FaCloudUploadAlt />}
                        {item.hasGeneratedOfferLetter ? "Generated" : "Generate"}
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={!assignedEmployeeMap.get(item.id) || loadingMap[item.id]}
                        onClick={() => handleDownloadOfferLetter(assignedEmployeeMap.get(item.id))}
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
    </Box>
  );
};

export default AssignedEmployee;
