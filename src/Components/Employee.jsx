import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Container, Fade } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from "framer-motion";
import SearchFilters from "./Employee/SearchFilters";
import EmployeeList from "./Employee/EmployeeList";
import EmployeeForm from "./Employee/EmployeeForm";
import EmployeeDialogs from "./Employee/EmployeeDialogs";
import { initialEmployeeState } from "./Employee/constants";
import { validateForm, getFilteredEmployees } from "./Employee/utils";

// Create a modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3D52A0', // Modern deep blue from the image
      light: '#7091E6',
      dark: '#8697C4',
    },
    secondary: {
      main: '#ADBBDA',
      light: '#EDE8F5',
      dark: '#5F739C',
    },
    background: {
      default: '#F5F7FF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #F5F7FF 0%, #E8ECFF 100%)',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(61, 82, 160, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#7091E6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3D52A0',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '&.MuiChip-filled': {
            background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});

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
  const [blockRemarksDialogOpen, setBlockRemarksDialogOpen] = useState(false);
  const [employee, setEmployee] = useState(initialEmployeeState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    isBlocked: "",
    status: "",
    dataStatus: "all",
    showDeleted: false
  });
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAssignedEmployees();
  }, [filters]);

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

      if (data?.status !== "Success" || !Array.isArray(data.data)) {
        throw new Error("Invalid response format from server");
      }

      // Fetch verification details for each approved employee
      const employeesWithDetails = await Promise.all(
        data.data.map(async (emp) => {
          const isDisabled = emp.isDisabled === true || 
                            emp.isDisabled === 1 || 
                            emp.disabledBy !== null || 
                            emp.disabledOn !== null;
          
          const employeeData = {
            ...emp,
            isActive: typeof emp.isActive === 'boolean' ? emp.isActive : true,
            isDisabled: isDisabled,
          };
          
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

      setEmployees(employeesWithDetails);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignedEmployees = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/EmployeeRoleAssign?isAssigned=true`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        const assignedIds = result.data.map(assignment => {
          const empId = assignment.employeeRegistrationId || 
                       assignment.EmployeeRegistrationId || 
                       assignment.Employee?.Id || 
                       assignment.employee?.id;
          return empId;
        }).filter(id => id !== undefined && id !== null);
        
        setAssignedEmployees(assignedIds);
      }
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    
    // For alternate contact, allow empty or valid format
    if (name === 'alternateContact') {
      if (value === '' || value === '+91') {
        setEmployee(prev => ({ ...prev, [name]: value }));
        return;
      }
      if (value.startsWith('+91') && /^\+91\d*$/.test(value)) {
        setEmployee(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    // For primary contact
    if (name === 'contact') {
      if (value === '+91') {
        setEmployee(prev => ({ ...prev, [name]: value }));
        return;
      }
      if (value.startsWith('+91') && /^\+91\d*$/.test(value) && value.length <= 13) {
        setEmployee(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If creating new employee (no selectedEmployee)
      if (!selectedEmployee) {
        // Validate contact number
        if (!employee.contact || !/^\+91\d{10}$/.test(employee.contact)) {
          toast.error("Please enter a valid contact number (+91 followed by 10 digits)");
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(`${baseUrl}/api/employee-registration`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              contact: employee.contact
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 409) {
              toast.error("This contact number is already registered");
            } else {
              throw new Error(data.message || "Failed to create employee");
            }
            setIsLoading(false);
            return;
          }

          toast.success("Employee created successfully!");
          await fetchEmployees();
          setShowForm(false);
        } catch (error) {
          console.error("Error creating employee:", error);
          toast.error(error.message || "Failed to create employee. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Handle existing employee update
        const errors = validateForm(employee);
        if (Object.keys(errors).length > 0) {
          Object.values(errors).forEach(error => toast.error(error));
          setIsLoading(false);
          return;
        }

        // Format dates properly
        const formatDate = (dateString) => {
          if (!dateString || dateString === "") return null;
          return new Date(dateString).toISOString().split('T')[0];
        };

        // Prepare the payload with properly formatted dates and status
        const payload = {
          ...employee,
          id: selectedEmployee.id,
          dateOfBirth: formatDate(employee.dateOfBirth),
          fatherDateOfBirth: formatDate(employee.fatherDateOfBirth),
          motherDateOfBirth: formatDate(employee.motherDateOfBirth),
          spouseDateOfBirth: formatDate(employee.spouseDateOfBirth),
          // Handle other fields that should be null when empty
          alternateContact: employee.alternateContact === '+91' ? null : employee.alternateContact,
          spouseName: employee.spouseName || null,
          previousUANNumber: employee.previousUANNumber || null,
          previousESICNumber: employee.previousESICNumber || null,
          blockedBy: employee.blockedBy || null,
          blockedOn: null,
          blockedRemarks: employee.blockedRemarks || null,
          deletedBy: employee.deletedBy || null,
          deletedOn: null,
          deleteRemarks: employee.deleteRemarks || null,
          // Explicitly include status-related fields
          status: employee.status,
          isApproved: employee.status === "Active",
          verifiedBy: employee.status === "Active" ? employee.verifiedBy : null,
          verifiedOn: employee.status === "Active" ? employee.verifiedOn : null
        };

        // If status is being changed to Active, update approval status first
        if (employee.status === "Active" && selectedEmployee.status !== "Active") {
          const approvalResponse = await fetch(
            `${baseUrl}/api/employee-registration/update-is-approved`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                employeeId: selectedEmployee.id,
                isApproved: true
              }),
            }
          );

          if (!approvalResponse.ok) {
            throw new Error("Failed to update approval status");
          }
        }

        // Then proceed with the main update
        const updateResponse = await fetch(
          `${baseUrl}/api/employee-registration/update-by-contact`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.message || "Failed to update employee");
        }

        toast.success("Employee updated successfully!");
        await fetchEmployees();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error processing employee:", error);
      toast.error(
        error.response?.status === 405
          ? "Invalid API endpoint. Please contact support."
          : error.message || "Failed to process employee"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmployee(initialEmployeeState);
    setTempIsBlocked(false);
    setTempBlockRemarks("");
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    // Helper function to format dates
    const formatDate = (dateString) => {
      if (!dateString) return "";
      // Remove time part and just keep the date
      return dateString.split('T')[0];
    };

    setSelectedEmployee(employee);
    setEmployee({
      ...employee,
      // Format all date fields
      dateOfBirth: formatDate(employee.dateOfBirth),
      fatherDateOfBirth: formatDate(employee.fatherDateOfBirth),
      motherDateOfBirth: formatDate(employee.motherDateOfBirth),
      spouseDateOfBirth: formatDate(employee.spouseDateOfBirth),
      alternateContact: employee.alternateContact || "+91",
      blockedRemarks: employee.blockedRemarks || "",
      blockedBy: employee.blockedBy || "",
      isActive: employee.isActive ?? true,
    });
    setTempIsBlocked(employee.isBlocked);
    setTempBlockRemarks(employee.blockedRemarks || "");
    setShowForm(true);
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
          employeeId: employeeToDelete.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update employee status");
      }

      toast.success(employeeToDelete.isDeleted ? 
        "Employee enabled successfully" : 
        "Employee disabled successfully"
      );
      setDialogOpen(false);
      setEmployeeToDelete(null);
      await fetchEmployees();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || "Failed to update employee status");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredEmployees = getFilteredEmployees(employees, filters, searchQuery);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '5%',
            width: '90%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 0%, rgba(112, 145, 230, 0.1) 0%, rgba(61, 82, 160, 0) 70%)',
            pointerEvents: 'none',
          }
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontSize: { xs: '2rem', md: '2.5rem' },
            textAlign: 'center',
            mb: 4,
          }}>
            Employee Management System
          </Typography>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          {isLoading ? (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              minHeight: "400px",
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={48} thickness={4} />
              <Typography variant="body1" color="text.secondary">
                Loading employee data...
              </Typography>
            </Box>
          ) : (
            <Fade in={true} timeout={500}>
              <Box>
                {showForm ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EmployeeForm
                      employee={employee}
                      handleChange={handleChange}
                      handleContactChange={handleContactChange}
                      handleSubmit={handleSubmit}
                      isLoading={isLoading}
                      selectedEmployee={selectedEmployee}
                      resetForm={resetForm}
                      assignedEmployees={assignedEmployees}
                      setEmployee={setEmployee}
                      setBlockDialogOpen={setBlockDialogOpen}
                      setTempIsBlocked={setTempIsBlocked}
                      setBlockRemarksDialogOpen={setBlockRemarksDialogOpen}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SearchFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                    />

                    <EmployeeList
                      employees={filteredEmployees}
                      handleEdit={handleEdit}
                      handleDelete={(employee) => {
                        setEmployeeToDelete(employee);
                        setDialogOpen(true);
                      }}
                      setShowForm={setShowForm}
                      resetForm={resetForm}
                      setSelectedEmployee={setSelectedEmployee}
                      assignedEmployees={assignedEmployees}
                    />
                  </motion.div>
                )}
              </Box>
            </Fade>
          )}

          <EmployeeDialogs
            dialogOpen={dialogOpen}
            blockDialogOpen={blockDialogOpen}
            blockRemarksDialogOpen={blockRemarksDialogOpen}
            employeeToDelete={employeeToDelete}
            tempIsBlocked={tempIsBlocked}
            tempBlockRemarks={tempBlockRemarks}
            employee={employee}
            setDialogOpen={setDialogOpen}
            setBlockDialogOpen={setBlockDialogOpen}
            setBlockRemarksDialogOpen={setBlockRemarksDialogOpen}
            setEmployeeToDelete={setEmployeeToDelete}
            setTempBlockRemarks={setTempBlockRemarks}
            handleDelete={handleDelete}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EmployeeComponent;
