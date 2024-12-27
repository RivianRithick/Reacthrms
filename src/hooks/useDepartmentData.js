import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useDepartmentData = (searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch departments with caching
  const { data: departments = [], isLoading, error } = useQuery(
    ['departments', searchQuery],
    async () => {
      const response = await axiosInstance.get("/api/departments");
      // Ensure we always return an array
      const responseData = response.data?.data;
      return Array.isArray(responseData) ? responseData : [];
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch clients for the form
  const { data: clients = [] } = useQuery(
    'clients',
    async () => {
      const response = await axiosInstance.get("/api/client-registration");
      // Ensure we always return an array and filter blocked clients
      const responseData = response.data?.data;
      const clientsArray = Array.isArray(responseData) ? responseData : [];
      return clientsArray.filter(client => !client?.isBlocked);
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Add department mutation
  const addDepartment = useMutation(
    (newDepartment) => axiosInstance.post("/api/create-department", newDepartment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('departments');
      },
    }
  );

  // Update department mutation
  const updateDepartment = useMutation(
    (updatedDepartment) => 
      axiosInstance.post("/api/create-department/update", updatedDepartment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('departments');
      },
    }
  );

  // Delete department mutation
  const deleteDepartment = useMutation(
    (departmentId) => 
      axiosInstance.post("/api/create-department/delete", departmentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('departments');
      },
    }
  );

  return {
    departments,
    clients,
    isLoading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
};

export default useDepartmentData; 