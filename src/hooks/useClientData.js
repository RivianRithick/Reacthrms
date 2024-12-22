import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useClientData = (searchQuery = '', filter = 'all') => {
  const queryClient = useQueryClient();

  // Fetch clients with caching
  const { data: clients = [], isLoading, error } = useQuery(
    ['clients', searchQuery, filter],
    async () => {
      const response = await axiosInstance.get('/api/client-registration');
      return response.data?.data || [];
    },
    {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Add client mutation
  const addClient = useMutation(
    (newClient) => axiosInstance.post('/api/client-registration/create', newClient),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
      },
    }
  );

  // Update client mutation
  const updateClient = useMutation(
    (updatedClient) => 
      axiosInstance.post('/api/client-registration/update', updatedClient),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
      },
    }
  );

  // Delete client mutation
  const deleteClient = useMutation(
    (clientId) => 
      axiosInstance.post('/api/client-registration/delete', clientId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
      },
    }
  );

  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
  };
};

export default useClientData; 