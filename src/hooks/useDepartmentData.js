import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useDepartmentData = (searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch departments with caching
  const { data: departments = [], isLoading, error } = useQuery(
    ['departments', searchQuery],
    async () => {
      const response = await axiosInstance.get("/api/Department");
      if (response.data.status === "Success") {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch departments');
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
    async (newDepartment) => {
      const response = await axiosInstance.post("/api/Department", newDepartment);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to create department');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('departments');
      },
    }
  );

  // Update department mutation
  const updateDepartment = useMutation(
    async (updatedDepartment) => {
      const { Id, ...data } = updatedDepartment;
      const response = await axiosInstance.put(`/api/Department/${Id}`, data);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to update department');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('departments');
      },
    }
  );

  // Delete department mutation
  const deleteDepartment = useMutation(
    async (departmentId) => {
      const response = await axiosInstance.delete(`/api/Department/${departmentId}`);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to delete department');
    },
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