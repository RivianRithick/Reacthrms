import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useJobLocationData = (searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch job locations
  const { data: jobLocations = [], isLoading, error } = useQuery(
    ['jobLocations', searchQuery],
    async () => {
      const response = await axiosInstance.get('/api/employeejoblocation');
      if (response.data.status === "Success") {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch job locations');
    },
    {
      staleTime: 30000, // Consider data fresh for 30 seconds
      cacheTime: 3600000, // Cache for 1 hour
      select: (data) => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(location =>
          location.city.toLowerCase().includes(query) ||
          location.state.toLowerCase().includes(query) ||
          location.country.toLowerCase().includes(query)
        );
      }
    }
  );

  // Create job location
  const createLocation = useMutation(
    async (locationData) => {
      const response = await axiosInstance.post('/api/employeejoblocation/create', locationData);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to create job location');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobLocations');
      }
    }
  );

  // Update job location
  const updateLocation = useMutation(
    async (locationData) => {
      const response = await axiosInstance.post('/api/employeejoblocation/update', locationData);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to update job location');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobLocations');
      }
    }
  );

  // Delete job location
  const deleteLocation = useMutation(
    async (locationId) => {
      const response = await axiosInstance.post('/api/employeejoblocation/delete', locationId);
      if (response.data.status === "Success") {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to delete job location');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobLocations');
      }
    }
  );

  return {
    jobLocations,
    isLoading,
    error,
    createLocation,
    updateLocation,
    deleteLocation
  };
}; 