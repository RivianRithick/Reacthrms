import React, { useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Container, Fade } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from "framer-motion";
import EmployeeList from "./Employee/EmployeeList";
import EmployeeForm from "./Employee/EmployeeForm";
import EmployeeDialogs from "./Employee/EmployeeDialogs";
import { initialEmployeeState } from "./Employee/constants";
import { validateForm, getFilteredEmployees } from "./Employee/utils";
import useEmployeeData from "../hooks/useEmployeeData";
import useDebounce from "../hooks/useDebounce";

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

const EmployeeComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [tempIsBlocked, setTempIsBlocked] = useState(false);
  const [tempBlockRemarks, setTempBlockRemarks] = useState("");
  const [blockRemarksDialogOpen, setBlockRemarksDialogOpen] = useState(false);
  const [employee, setEmployee] = useState(initialEmployeeState);
  const [filters, setFilters] = useState({
    isBlocked: "",
    status: "",
    dataStatus: "all",
    showDeleted: false
  });

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use employee data hook
  const {
    employees = [],
    assignedEmployees = [],
    isLoading,
    error,
    addEmployee: addEmployeeMutation,
    updateEmployee,
    deleteEmployee: deleteEmployeeMutation,
    toggleBlockEmployee,
    toggleVerifyEmployee,
    assignOnboardingManager,
    assignRecruiter,
  } = useEmployeeData(debouncedSearchQuery, filters);

  // Memoize handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleContactChange = useCallback((e) => {
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
  }, []);

  const handleSubmit = async (employeeData) => {
    try {
      // Update existing employee
      if (selectedEmployee) {
        console.log("Updating existing employee...");
        const updateResult = await updateEmployee.mutateAsync({
          ...employeeData,
          id: selectedEmployee.id,
          contact: selectedEmployee.contact
        });
        console.log("Update result:", updateResult);

        // Handle assignments
        console.log("Handling assignments...");
        
        // Handle onboarding manager assignment
        console.log("Attempting onboarding manager assignment:", employeeData.onboardingManagerId);
        try {
          await assignOnboardingManager.mutateAsync({
            employeeId: selectedEmployee.id,
            managerId: employeeData.onboardingManagerId,
            contact: selectedEmployee.contact
          });
          console.log("Onboarding manager assigned successfully");
        } catch (error) {
          console.error("Failed to update onboarding manager:", error);
        }

        // Handle recruiter assignment
        console.log("Attempting recruiter assignment:", employeeData.recruiterId);
        try {
          await assignRecruiter.mutateAsync({
            employeeId: selectedEmployee.id,
            recruiterId: employeeData.recruiterId,
            contact: selectedEmployee.contact
          });
          console.log("Recruiter assigned successfully");
        } catch (error) {
          console.error("Failed to update recruiter:", error);
        }

        toast.success("Employee updated successfully!");
        handleClose();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Failed to update employee");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployeeMutation.mutateAsync({
        employeeId: employeeToDelete.id
      });
      toast.success(employeeToDelete.isDeleted ? 
        "Employee enabled successfully" : 
        "Employee disabled successfully"
      );
      setDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to update employee status");
    }
  };

  const handleBlockEmployee = async () => {
    try {
      await toggleBlockEmployee.mutateAsync({
        employeeId: employee.id,
        isBlocked: tempIsBlocked,
        remarks: tempBlockRemarks
      });
      toast.success(`Employee ${tempIsBlocked ? 'blocked' : 'unblocked'} successfully!`);
      setBlockDialogOpen(false);
      setBlockRemarksDialogOpen(false);
    } catch (error) {
      toast.error(error.message || `Failed to ${tempIsBlocked ? 'block' : 'unblock'} employee`);
    }
  };

  const handleVerifyEmployee = async () => {
    try {
      await toggleVerifyEmployee.mutateAsync({
        employeeId: employee.id,
        isApproved: !employee.isApproved
      });
      toast.success(`Employee ${employee.isApproved ? 'unverified' : 'verified'} successfully!`);
    } catch (error) {
      toast.error(error.message || `Failed to ${employee.isApproved ? 'unverify' : 'verify'} employee`);
    }
  };

  const resetForm = useCallback(() => {
    setEmployee(initialEmployeeState);
    setTempIsBlocked(false);
    setTempBlockRemarks("");
    setShowForm(false);
  }, []);

  const handleClose = useCallback(() => {
    setShowForm(false);
    setSelectedEmployee(null);
    resetForm();
  }, [resetForm]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEdit = useCallback((employeeData) => {
    // Helper function to format dates
    const formatDate = (dateString) => {
      if (!dateString) return "";
      return dateString.split('T')[0];
    };

    setSelectedEmployee(employeeData);
    setEmployee({
      ...employeeData,
      dateOfBirth: formatDate(employeeData.dateOfBirth),
      fatherDateOfBirth: formatDate(employeeData.fatherDateOfBirth),
      motherDateOfBirth: formatDate(employeeData.motherDateOfBirth),
      spouseDateOfBirth: formatDate(employeeData.spouseDateOfBirth),
      alternateContact: employeeData.alternateContact || "+91",
      blockedRemarks: employeeData.blockedRemarks || "",
      blockedBy: employeeData.blockedBy || "",
      isActive: employeeData.isActive ?? true,
    });
    setTempIsBlocked(employeeData.isBlocked);
    setTempBlockRemarks(employeeData.blockedRemarks || "");
    setShowForm(true);
  }, []);

  // Memoize filtered employees
  const filteredEmployees = useMemo(() => 
    getFilteredEmployees(employees, filters, debouncedSearchQuery),
    [employees, filters, debouncedSearchQuery]
  );

  if (error) {
    toast.error("Error loading employees");
  }

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
                      isLoading={
                        addEmployeeMutation.isLoading || 
                        updateEmployee.isLoading || 
                        assignOnboardingManager.isLoading || 
                        assignRecruiter.isLoading
                      }
                      selectedEmployee={selectedEmployee}
                      resetForm={resetForm}
                      assignedEmployees={assignedEmployees}
                      setEmployee={setEmployee}
                      setBlockDialogOpen={setBlockDialogOpen}
                      setTempIsBlocked={setTempIsBlocked}
                      setBlockRemarksDialogOpen={setBlockRemarksDialogOpen}
                      handleVerifyEmployee={handleVerifyEmployee}
                      handleBlockEmployee={handleBlockEmployee}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
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
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
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
            handleBlockEmployee={handleBlockEmployee}
            isLoading={deleteEmployeeMutation.isLoading || toggleBlockEmployee.isLoading}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default React.memo(EmployeeComponent);
