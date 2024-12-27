import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../apiService';

export const useEmployeeData = (searchQuery = '', filters = {}) => {
  const queryClient = useQueryClient();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch employees with caching
  const { data: employees = [], isLoading, error } = useQuery(
    ['employees', searchQuery, filters],
    async () => {
      try {
        const response = await fetch(`${baseUrl}/api/employee-registration?includeDeleted=true`, {
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
        console.log('Raw API Response:', data);

        if (data?.status !== "Success" || !Array.isArray(data.data)) {
          throw new Error("Invalid response format from server");
        }

        // Fetch verification details for each approved employee
        const employeesWithDetails = await Promise.all(
          data.data.map(async (emp) => {
            console.log('Processing employee data:', emp);
            const isDisabled = emp.isDisabled === true || 
                             emp.isDisabled === 1 || 
                             emp.disabledBy !== null || 
                             emp.disabledOn !== null;
            
            const employeeData = {
              ...emp,
              isActive: typeof emp.isActive === 'boolean' ? emp.isActive : true,
              isDisabled: isDisabled,
              // Extract presentState from multiple possible sources
              presentState: emp.presentState || 
                          emp.PresentState || 
                          (emp.presentAddress ? emp.presentAddress.split(',').slice(-2)[0]?.trim() : null) ||
                          null,
            };
            console.log('Processed employee data with state:', employeeData);
            
            if (emp.isApproved) {
              return {
                ...employeeData,
                verifiedBy: emp.verifiedBy,
                verifiedOn: emp.verifiedOn,
              };
            }
            return employeeData;
          })
        );

        return employeesWithDetails;
      } catch (error) {
        throw new Error(error.message || "Failed to fetch employees");
      }
    },
    {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnWindowFocus: false,
      retry: 1, // Only retry once on failure
    }
  );

  // Fetch assigned employees with caching
  const { data: assignedEmployees = [] } = useQuery(
    'assignedEmployees',
    async () => {
      const response = await fetch(`${baseUrl}/api/EmployeeRoleAssign?isAssigned=true`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch assigned employees');
      }
      const result = await response.json();
      const assignedIds = result.data
        .map(assignment => {
          return assignment.employeeRegistrationId || 
                 assignment.EmployeeRegistrationId || 
                 assignment.Employee?.Id || 
                 assignment.employee?.id;
        })
        .filter(id => id !== undefined && id !== null);
      return assignedIds;
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  // Add employee mutation
  const addEmployee = useMutation(
    (employeeData) => apiService.post('/api/employee-registration/create', employeeData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Update employee mutation
  const updateEmployee = useMutation(
    async (updatedEmployee) => {
      console.log('Updating employee with data:', updatedEmployee);
      const response = await fetch(`${baseUrl}/api/employee-registration/update-by-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id: updatedEmployee.id,
          contact: updatedEmployee.contact,
          firstName: updatedEmployee.firstName || null,
          lastName: updatedEmployee.lastName || null,
          dateOfBirth: updatedEmployee.dateOfBirth ? new Date(updatedEmployee.dateOfBirth).toISOString() : null,
          gender: updatedEmployee.gender || null,
          bloodGroup: updatedEmployee.bloodGroup || null,
          maritalStatus: updatedEmployee.maritalStatus || null,
          email: updatedEmployee.email || null,
          alternateContact: updatedEmployee.alternateContact || null,
          candidatePhotoPath: updatedEmployee.candidatePhotoPath || null,
          
          // Family Information
          fatherName: updatedEmployee.fatherName || null,
          motherName: updatedEmployee.motherName || null,
          fatherDateOfBirth: updatedEmployee.fatherDateOfBirth ? new Date(updatedEmployee.fatherDateOfBirth).toISOString() : null,
          motherDateOfBirth: updatedEmployee.motherDateOfBirth ? new Date(updatedEmployee.motherDateOfBirth).toISOString() : null,
          spouseName: updatedEmployee.spouseName || null,
          spouseDateOfBirth: updatedEmployee.spouseDateOfBirth ? new Date(updatedEmployee.spouseDateOfBirth).toISOString() : null,
          familyPhotoPath: updatedEmployee.familyPhotoPath || null,

          // Address Information
          presentAddress: updatedEmployee.presentAddress || null,
          presentState: updatedEmployee.presentState || 
                       (updatedEmployee.presentAddress ? updatedEmployee.presentAddress.split(',').slice(-2)[0]?.trim() : null) ||
                       null,
          presentDistrict: updatedEmployee.presentDistrict || null,
          permanentAddress: updatedEmployee.permanentAddress || null,

          // Bank Account Details
          bankAccountName: updatedEmployee.bankAccountName || null,
          bankName: updatedEmployee.bankName || null,
          bankAccountNumber: updatedEmployee.bankAccountNumber || null,
          ifscCode: updatedEmployee.ifscCode || null,

          // Previous Employment Details
          previousUANNumber: updatedEmployee.previousUANNumber || null,
          previousESICNumber: updatedEmployee.previousESICNumber || null,

          // Identity Documents
          aadhaarNumber: updatedEmployee.aadhaarNumber || null,
          panNumber: updatedEmployee.panNumber || null,

          // Document Paths
          panCardFilePath: updatedEmployee.panCardFilePath || null,
          aadhaarCardFilePath: updatedEmployee.aadhaarCardFilePath || null,
          passbookFilePath: updatedEmployee.passbookFilePath || null,
          voterIdPath: updatedEmployee.voterIdPath || null,

          // Educational Documents
          tenthCertificatePath: updatedEmployee.tenthCertificatePath || null,
          twelthCertificatePath: updatedEmployee.twelthCertificatePath || null,
          degreeCertificatePath: updatedEmployee.degreeCertificatePath || null,

          // Professional Documents
          offerLetterPath: updatedEmployee.offerLetterPath || null,
          experienceLetterPath: updatedEmployee.experienceLetterPath || null,
          payslipPath: updatedEmployee.payslipPath || null,

          // Status and Assignments
          status: updatedEmployee.status || null,
          isBlocked: updatedEmployee.isBlocked || null,
          isApproved: updatedEmployee.isApproved || null,
          recruiterId: updatedEmployee.recruiterId || null,
          onboardingManagerId: updatedEmployee.onboardingManagerId || null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update employee');
      }
      const result = await response.json();
      console.log('Update response:', result);
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Delete employee mutation
  const deleteEmployee = useMutation(
    async ({ employeeId }) => {
      const response = await fetch(`${baseUrl}/api/employee-registration/soft-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ employeeId })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete employee');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Block/Unblock employee mutation
  const toggleBlockEmployee = useMutation(
    async ({ employeeId, isBlocked, remarks }) => {
      const response = await fetch(`${baseUrl}/api/employee-registration/${isBlocked ? 'block' : 'unblock'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ employeeId, remarks })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isBlocked ? 'block' : 'unblock'} employee`);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Verify/Unverify employee mutation
  const toggleVerifyEmployee = useMutation(
    async ({ employeeId, isApproved }) => {
      const response = await fetch(`${baseUrl}/api/employee-registration/update-is-approved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ employeeId, isApproved })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isApproved ? 'verify' : 'unverify'} employee`);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Assign onboarding manager mutation
  const assignOnboardingManager = useMutation(
    async ({ employeeId, managerId, contact }) => {
      const endpoint = `${baseUrl}/api/employee-registration/update-by-contact`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id: employeeId,
          contact: contact,
          onboardingManagerId: managerId || null
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText ? JSON.parse(errorText).message : 
          `Failed to ${managerId ? 'assign' : 'remove'} onboarding manager`
        );
      }

      const text = await response.text();
      return text ? JSON.parse(text) : { status: 'Success' };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Assign recruiter mutation
  const assignRecruiter = useMutation(
    async ({ employeeId, recruiterId, contact }) => {
      const endpoint = `${baseUrl}/api/employee-registration/update-by-contact`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id: employeeId,
          contact: contact,
          recruiterId: recruiterId || null
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText ? JSON.parse(errorText).message : 
          `Failed to ${recruiterId ? 'assign' : 'remove'} recruiter`
        );
      }

      const text = await response.text();
      return text ? JSON.parse(text) : { status: 'Success' };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  return {
    employees,
    assignedEmployees,
    isLoading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleBlockEmployee,
    toggleVerifyEmployee,
    assignOnboardingManager,
    assignRecruiter,
  };
};

export default useEmployeeData; 