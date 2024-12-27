import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';
import { Roles } from '../utils/rbac';

export const useEmployeeRoleAssignData = (assignmentFilter = 'all', searchQuery = '') => {
  const queryClient = useQueryClient();
  const userRole = parseInt(localStorage.getItem('role'));
  const userId = localStorage.getItem('userId');

  console.log('Current user role:', userRole);
  console.log('Can access locations/salaries:', userRole === Roles.SUPER_ADMIN || userRole === Roles.ADMIN || userRole === Roles.ONBOARDING_MANAGER);

  // Fetch employees based on filter
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useQuery(
    ['employees', assignmentFilter, searchQuery],
    async () => {
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

  // Fetch dropdown data based on user role
  const { data: dropdownData = {}, isLoading: dropdownsLoading, error: dropdownsError } = useQuery(
    ['employeeRoleAssignDropdowns', userRole, userId],
    async () => {
      const responses = {
        clients: [],
        departments: [],
        locations: [],
        salaries: []
      };

      try {
        // All roles can fetch clients
        console.log('Fetching clients...');
        const clientResponse = await axiosInstance.get('/api/client-registration');
        console.log('Client response:', clientResponse.data);
        if (clientResponse.data?.status === "Success") {
          responses.clients = (clientResponse.data?.data || []).filter(client => !client.isBlocked);
        }

        // All roles can fetch departments
        console.log('Fetching departments...');
        const departmentResponse = await axiosInstance.get('/api/Department');
        console.log('Department response:', departmentResponse.data);
        if (departmentResponse.data?.status === "Success") {
          responses.departments = departmentResponse.data?.data || [];
        }

        // Super Admin, Admin, and Onboarding Manager can fetch job locations and salaries
        if (userRole === Roles.SUPER_ADMIN || userRole === Roles.ADMIN || userRole === Roles.ONBOARDING_MANAGER) {
          console.log('Fetching locations and salaries...');
          const [locationResponse, salaryResponse] = await Promise.all([
            axiosInstance.get('/api/employeejoblocation'),
            axiosInstance.get('/api/employeesalary')
          ]);

          console.log('Location response:', locationResponse.data);
          console.log('Salary response:', salaryResponse.data);

          if (locationResponse.data?.status === "Success") {
            responses.locations = locationResponse.data?.data || [];
          } else {
            console.warn('Location fetch returned:', locationResponse.data?.message);
          }

          if (salaryResponse.data?.status === "Success") {
            responses.salaries = salaryResponse.data?.data || [];
          } else {
            console.warn('Salary fetch returned:', salaryResponse.data?.message);
          }
        } else {
          console.log('User role does not have access to locations and salaries');
        }

        console.log('Final dropdown responses:', responses);
      } catch (error) {
        console.error('Error fetching dropdown data:', {
          message: error?.response?.data?.message || error.message,
          status: error?.response?.data?.status,
          statusCode: error?.response?.status,
          endpoint: error?.config?.url,
          role: userRole
        });
      }

      return responses;
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
    }
  );

  const result = {
    employees: employees || [],
    clients: dropdownData.clients || [],
    departments: dropdownData.departments || [],
    locations: dropdownData.locations || [],
    salaries: dropdownData.salaries || [],
    isLoading: employeesLoading || dropdownsLoading,
    error: employeesError || dropdownsError,
    assignRole,
    unassignRole,
    userRole
  };

  console.log('Hook return value:', result);
  return result;
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