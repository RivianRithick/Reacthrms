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
          axiosInstance.get('/api/EmployeeRoleAssign?isAssigned=true'),
          axiosInstance.get('/api/EmployeeRoleAssign/approved-and-unassigned')
        ]);

        const assignedData = assignedResponse.data?.data || [];
        const unassignedData = unassignedResponse.data?.data || [];

        employeesData = [
          ...normalizeEmployees(unassignedData).filter(emp => !emp.isDeleted),
          ...normalizeEmployees(assignedData).filter(emp => !emp.isDeleted)
        ];
      } else if (assignmentFilter === 'assigned') {
        const response = await axiosInstance.get('/api/EmployeeRoleAssign?isAssigned=true');
        employeesData = normalizeEmployees(response.data?.data || []).filter(emp => !emp.isDeleted);
      } else if (assignmentFilter === 'notAssigned') {
        const response = await axiosInstance.get('/api/EmployeeRoleAssign/approved-and-unassigned');
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
    (payload) => axiosInstance.post('/api/EmployeeRoleAssign/create', payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  // Unassign role mutation
  const unassignRole = useMutation(
    (payload) => axiosInstance.post('/api/EmployeeRoleAssign/unassign', payload),
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
const normalizeEmployees = (data) => {
  return data.map((item) => {
    // Employee data comes in lowercase 'employee' property
    const employeeData = item.employee;

    // Add debug logging
    console.log('Item structure:', item);
    console.log('Employee data:', employeeData);

    return {
      id: item.id,
      assignmentId: item.id,
      isAssigned: item.isAssigned || false,
      firstName: employeeData?.firstName || "N/A",
      lastName: employeeData?.lastName || "N/A",
      email: employeeData?.email || "N/A",
      isDeleted: employeeData?.isDeleted || false,
      contact: employeeData?.contact || "N/A",
      presentDistrict: employeeData?.presentDistrict || "N/A",
      clientName: item.client?.clientName || "N/A",
      clientCode: item.client?.clientCode || "N/A",
      departmentName: item.department?.departmentName || "N/A",
      departmentCode: item.department?.departmentCode || "N/A",
      jobTitle: item.jobRole?.jobTitle || "N/A",
      jobRoleCode: item.jobRole?.jobRoleCode || "N/A",
      location: item.jobLocation ? 
        `${item.jobLocation.city}, ${item.jobLocation.state}, ${item.jobLocation.country}` : "N/A",
      dateOfJoining: item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : "N/A",
      hasGeneratedOfferLetter: item.hasGeneratedOfferLetter || false
    };
  });
};

export default useEmployeeRoleAssignData; 