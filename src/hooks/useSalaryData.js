import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useSalaryData = (searchQuery = '', salaryId = null) => {
  const queryClient = useQueryClient();

  // Fetch all salaries
  const { data: salaries = [], isLoading, error } = useQuery(
    ['salaries', searchQuery],
    async () => {
      const response = await axiosInstance.get('/api/employeesalary');
      if (response.data.status === "Success") {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch salary data');
    },
    {
      staleTime: 30000,
      cacheTime: 3600000,
      select: (data) => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(salary => 
          Object.values(salary).some(value => 
            String(value).toLowerCase().includes(query)
          )
        );
      }
    }
  );

  // Fetch single salary
  const { data: salaryDetails, isLoading: isLoadingSalary } = useQuery(
    ['salary', salaryId],
    async () => {
      if (!salaryId) return null;
      const response = await axiosInstance.get(`/api/employeesalary?id=${salaryId}`);
      if (response.data.status === "Success") {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch salary details');
    },
    {
      enabled: !!salaryId,
      staleTime: 30000,
      cacheTime: 3600000
    }
  );

  // Create salary
  const createSalary = useMutation(
    async (salaryData) => {
      const response = await axiosInstance.post('/api/employeesalary/create', salaryData);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to create salary record');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('salaries');
      }
    }
  );

  // Update salary
  const updateSalary = useMutation(
    async (salaryData) => {
      const response = await axiosInstance.post('/api/employeesalary/update', salaryData);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to update salary record');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('salaries');
        if (salaryId) {
          queryClient.invalidateQueries(['salary', salaryId]);
        }
      }
    }
  );

  // Delete salary
  const deleteSalary = useMutation(
    async (id) => {
      const response = await axiosInstance.post('/api/employeesalary/delete', id);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to delete salary record');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('salaries');
      }
    }
  );

  return {
    salaries,
    salaryDetails,
    isLoading: isLoading || isLoadingSalary,
    error,
    createSalary,
    updateSalary,
    deleteSalary
  };
}; 