import React, { useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Container, Fade } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { motion } from "framer-motion";
import EmployeeList from "./Employee/EmployeeList";
import EmployeeForm from "./Employee/EmployeeForm";
import EmployeeDialogs from "./Employee/EmployeeDialogs";
import { initialEmployeeState } from "./Employee/constants";
import useEmployeeData from "../hooks/useEmployeeData";
import { theme } from '../theme';
import { Roles } from '../utils/rbac';

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
    isBlocked: "all",
    dataStatus: "all",
    status: "",
    showDeleted: false
  });

  // Use employee data hook without search query to get all employees once
  const {
    employees,
    assignedEmployees,
    isLoading,
    error,
    addEmployee: addEmployeeMutation,
    updateEmployee,
    deleteEmployee: deleteEmployeeMutation,
    toggleBlockEmployee,
    toggleVerifyEmployee,
    assignOnboardingManager,
    assignRecruiter,
  } = useEmployeeData("", filters);

  // Memoize filtered employees to avoid unnecessary re-renders
  const filteredEmployees = useMemo(() => {
    const employeeList = employees || [];
    let filtered = [...employeeList];

    // Get user role from localStorage
    const userRole = parseInt(localStorage.getItem('role'));
    const isOnboardingManager = userRole === Roles.ONBOARDING_MANAGER;

    // If user is an onboarding manager, only show assigned employees
    if (isOnboardingManager) {
      filtered = filtered.filter(emp => emp.onboardingManagerId === parseInt(localStorage.getItem('userId')));
    }

    // Apply status filters
    if (filters.dataStatus === 'enabled') {
      filtered = filtered.filter(emp => !emp.isDeleted);
    } else if (filters.dataStatus === 'disabled') {
      filtered = filtered.filter(emp => emp.isDeleted);
    }

    // Apply block filters
    if (filters.isBlocked === 'blocked') {
      filtered = filtered.filter(emp => emp.isBlocked);
    } else if (filters.isBlocked === 'unblocked') {
      filtered = filtered.filter(emp => !emp.isBlocked);
    }

    // Apply search query
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        (emp.firstName?.toLowerCase().includes(searchTerm) ||
         emp.lastName?.toLowerCase().includes(searchTerm) ||
         emp.email?.toLowerCase().includes(searchTerm) ||
         emp.contact?.includes(searchTerm) ||
         emp.presentDistrict?.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  }, [employees, searchQuery, filters.dataStatus, filters.isBlocked]);

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
      setEmployee(prev => ({ ...prev, [name]: value }));
      return;
    }

    // For primary contact
    if (name === 'contact') {
      setEmployee(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmit = async (employeeData) => {
    try {
      // Create new employee
      if (!selectedEmployee) {
        console.log("Creating new employee...");
        const createResult = await addEmployeeMutation.mutateAsync({
          contact: `+91${employee.contact.replace(/\D/g, '')}`,
        });
        console.log("Create result:", createResult);
        toast.success("Employee created successfully!");
        handleClose();
        return;
      }

      // Update existing employee
      console.log("Updating existing employee...");
      const updateResult = await updateEmployee.mutateAsync({
        ...employeeData,
        id: selectedEmployee.id,
        contact: selectedEmployee.contact
      });
      console.log("Update result:", updateResult);

      // Handle verification status change if it's different from the original
      if (employeeData.isApproved !== selectedEmployee.isApproved) {
        await toggleVerifyEmployee.mutateAsync({
          employeeId: selectedEmployee.id,
          isApproved: employeeData.isApproved
        });
      }

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

      toast.success("Employee updated successfully!");
      handleClose();
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

    console.log('Employee data before setting state:', employeeData);
    console.log('Present State from API:', employeeData.presentState);

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
      presentState: employeeData.presentState || "",
    });

    console.log('Employee state after setting:', {
      ...employeeData,
      dateOfBirth: formatDate(employeeData.dateOfBirth),
      fatherDateOfBirth: formatDate(employeeData.fatherDateOfBirth),
      motherDateOfBirth: formatDate(employeeData.motherDateOfBirth),
      spouseDateOfBirth: formatDate(employeeData.spouseDateOfBirth),
      alternateContact: employeeData.alternateContact || "+91",
      blockedRemarks: employeeData.blockedRemarks || "",
      blockedBy: employeeData.blockedBy || "",
      isActive: employeeData.isActive ?? true,
      presentState: employeeData.presentState || "",
    });

    setTempIsBlocked(employeeData.isBlocked);
    setTempBlockRemarks(employeeData.blockedRemarks || "");
    setShowForm(true);
  }, []);

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
                      filters={filters}
                      handleFilterChange={handleFilterChange}
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
