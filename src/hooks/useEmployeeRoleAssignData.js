import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';
import { Roles } from '../utils/rbac';

export const useEmployeeRoleAssignData = (assignmentFilter = 'all', searchQuery = '') => {
  const queryClient = useQueryClient();
  const userRole = parseInt(localStorage.getItem('role'));
  const userId = localStorage.getItem('userId');

  // Fetch employees based on filter
  const { data: employees = [], isLoading, error } = useQuery(
    ['employees', assignmentFilter, searchQuery],
    async () => {
      let employeesData = [];

      // Fetch both assigned and unassigned employees for all roles
      const [assignedResponse, unassignedResponse] = await Promise.all([
        axiosInstance.get('/api/employeeroleassign?isAssigned=true'),
        axiosInstance.get('/api/employeeroleassign/unassigned-employees')
      ]);

      const assignedData = assignedResponse.data?.data || [];
      const unassignedData = unassignedResponse.data?.data || [];

      // Create a Set to track unique employee IDs
      const seenEmployeeIds = new Set();
      const uniqueEmployees = [];

      // Process unassigned employees first for consistent ordering
      normalizeEmployees(unassignedData)
        .filter(emp => !emp.isDeleted)
        .forEach(emp => {
          if (!seenEmployeeIds.has(emp.employeeId)) {
            seenEmployeeIds.add(emp.employeeId);
            uniqueEmployees.push({ ...emp, isAssigned: false });
          }
        });

      // Then process assigned employees
      normalizeEmployees(assignedData)
        .filter(emp => !emp.isDeleted)
        .forEach(emp => {
          if (!seenEmployeeIds.has(emp.employeeId)) {
            seenEmployeeIds.add(emp.employeeId);
            uniqueEmployees.push({ ...emp, isAssigned: true });
          }
        });

      return uniqueEmployees;
    },
    {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch dropdown data (clients, departments, locations, salaries)
  const { data: dropdownData = {} } = useQuery(
    ['employeeRoleAssignDropdowns', userRole, userId],
    async () => {
      let clientResponse;
      
      // For Onboarding Manager, fetch only their assigned clients
      if (userRole === Roles.ONBOARDING_MANAGER) {
        clientResponse = await axiosInstance.get(`/api/employeeroleassign/manager-clients/${userId}`);
      } else {
        // For Super Admin and Admin, fetch all clients
        clientResponse = await axiosInstance.get('/api/client-registration');
      }

      const [departmentResponse, locationResponse, salaryResponse] = await Promise.all([
        axiosInstance.get('/api/departments'),
        axiosInstance.get('/api/employeejoblocation'),
        axiosInstance.get('/api/employeesalary')
      ]);

      return {
        clients: (clientResponse.data?.data || []).filter(client => !client.isBlocked),
        departments: departmentResponse.data?.data || [],
        locations: locationResponse.data?.data || [],
        salaries: salaryResponse.data?.data || []
      };
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Assign role mutation
  const assignRole = useMutation(
    (payload) => axiosInstance.post('/api/employeeroleassign/create', payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Unassign role mutation
  const unassignRole = useMutation(
    (payload) => axiosInstance.post('/api/employeeroleassign/unassign', payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
      onError: (error) => {
        console.error('Failed to unassign role:', error.message);
        throw error;
      }
    }
  );

  return {
    employees: employees || [],
    clients: dropdownData.clients || [],
    departments: dropdownData.departments || [],
    locations: dropdownData.locations || [],
    salaries: dropdownData.salaries || [],
    isLoading,
    error,
    assignRole,
    unassignRole,
    userRole
  };
};

// Helper function to normalize employee data
const normalizeEmployees = (employees) => {
  return employees.map(emp => {
    if (emp.employee) {
      // For assigned employees
      return {
        id: emp.id,
        employeeId: emp.employee.id,
        firstName: emp.employee.firstName,
        lastName: emp.employee.lastName,
        email: emp.employee.email,
        contact: emp.employee.contact,
        presentDistrict: emp.employee.presentDistrict,
        isAssigned: emp.isAssigned,
        isDeleted: emp.employee.isDeleted,
        client: emp.client ? {
          id: emp.client.id,
          name: emp.client.clientName,
          code: emp.client.clientCode
        } : null,
        department: emp.department ? {
          id: emp.department.id,
          name: emp.department.departmentName,
          code: emp.department.departmentCode
        } : null,
        jobRole: emp.jobRole ? {
          id: emp.jobRole.id,
          title: emp.jobRole.jobTitle,
          code: emp.jobRole.jobRoleCode
        } : null,
        jobLocation: emp.jobLocation ? {
          id: emp.jobLocation.id,
          location: emp.jobLocation.location
        } : null,
        salary: emp.salary ? {
          id: emp.salary.id,
          basic: emp.salary.basic,
          hra: emp.salary.hra,
          gross: emp.salary.gross,
          netPay: emp.salary.netPay,
          paymentFrequency: emp.salary.paymentFrequency,
          currency: emp.salary.currency
        } : null,
        dateOfJoining: emp.dateOfJoining
      };
    } else {
      // For unassigned employees
      return {
        id: emp.id,
        employeeId: emp.employee?.id,
        firstName: emp.employee?.firstName,
        lastName: emp.employee?.lastName,
        email: emp.employee?.email,
        contact: emp.employee?.contact,
        presentDistrict: emp.employee?.presentDistrict,
        isAssigned: false,
        isDeleted: emp.employee?.isDeleted,
        client: null,
        department: null,
        jobRole: null,
        jobLocation: null,
        salary: null,
        dateOfJoining: null
      };
    }
  });
};

export default useEmployeeRoleAssignData; 