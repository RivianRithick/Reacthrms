import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useEmployeeRoleAssignData = (assignmentFilter = 'all', searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch employees based on filter
  const { data: employees = [], isLoading, error } = useQuery(
    ['employees', assignmentFilter, searchQuery],
    async () => {
      let employeesData = [];

      if (assignmentFilter === 'all') {
        const [assignedResponse, unassignedResponse] = await Promise.all([
          axiosInstance.get('/api/employeeroleassign?isAssigned=true'),
          axiosInstance.get('/api/employeeroleassign/unassigned-employees')
        ]);

        const assignedData = assignedResponse.data?.data || [];
        const unassignedData = unassignedResponse.data?.data || [];

        employeesData = [
          ...normalizeEmployees(unassignedData).filter(emp => !emp.isDeleted),
          ...normalizeEmployees(assignedData).filter(emp => !emp.isDeleted)
        ];
      } else if (assignmentFilter === 'assigned') {
        const response = await axiosInstance.get('/api/employeeroleassign?isAssigned=true');
        employeesData = normalizeEmployees(response.data?.data || []).filter(emp => !emp.isDeleted);
      } else if (assignmentFilter === 'notAssigned') {
        const response = await axiosInstance.get('/api/employeeroleassign/unassigned-employees');
        employeesData = normalizeEmployees(response.data?.data || []).filter(emp => !emp.isDeleted);
      }

      return employeesData;
    },
    {
      staleTime: 30000, // Data considered fresh for 30 seconds
      cacheTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Fetch dropdown data (clients, departments, locations, salaries)
  const { data: dropdownData = {} } = useQuery(
    'employeeRoleAssignDropdowns',
    async () => {
      const [clientResponse, departmentResponse, locationResponse, salaryResponse] = await Promise.all([
        axiosInstance.get('/api/client-registration'),
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
      staleTime: 5 * 60 * 1000, // Consider dropdown data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
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
  };
};

// Helper function to normalize employee data
const normalizeEmployees = (employees) => {
  return employees.map(emp => {
    if (emp.employee) {
      // For assigned employees
      return {
        id: emp.id,
        firstName: emp.employee.firstName,
        lastName: emp.employee.lastName,
        email: emp.employee.email,
        contact: emp.employee.contact,
        presentDistrict: emp.employee.presentDistrict,
        isAssigned: emp.isAssigned,
        isDeleted: emp.employee.isDeleted,
        client: emp.client,
        department: emp.department,
        jobRole: emp.jobRole,
        salary: emp.salary,
        dateOfJoining: emp.dateOfJoining
      };
    } else {
      // For unassigned employees
      return {
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        contact: emp.contact,
        presentDistrict: emp.presentDistrict,
        isAssigned: false,
        isDeleted: emp.isDeleted,
        client: null,
        department: null,
        jobRole: null,
        salary: null,
        dateOfJoining: null
      };
    }
  });
};

export default useEmployeeRoleAssignData; 