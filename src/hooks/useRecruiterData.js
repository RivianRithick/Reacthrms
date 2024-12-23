import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../apiService';

export const useRecruiterData = (searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch recruiters with caching
  const { data: recruiters = [], isLoading, error } = useQuery(
    ['recruiters', searchQuery],
    async () => {
      const response = await apiService.get('/api/Recruiter');
      if (response.data.statusCode === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error fetching recruiters');
    },
    {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Add recruiter mutation
  const addRecruiter = useMutation(
    (newRecruiter) => apiService.post('/api/Recruiter', newRecruiter),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('recruiters');
      },
    }
  );

  // Update recruiter mutation
  const updateRecruiter = useMutation(
    ({ id, ...data }) => apiService.post(`/api/Recruiter/update/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('recruiters');
      },
    }
  );

  // Delete recruiter mutation
  const deleteRecruiter = useMutation(
    ({ id, remarks }) => apiService.post(`/api/Recruiter/soft-delete/${id}`, { remarks }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('recruiters');
      },
    }
  );

  return {
    recruiters,
    isLoading,
    error,
    addRecruiter,
    updateRecruiter,
    deleteRecruiter,
  };
};

export default useRecruiterData; 