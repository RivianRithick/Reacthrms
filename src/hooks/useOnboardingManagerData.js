import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../apiService';

export const useOnboardingManagerData = (searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch onboarding managers with caching
  const { data: managers = [], isLoading, error } = useQuery(
    ['onboardingManagers', searchQuery],
    async () => {
      const response = await apiService.get('/api/OnboardingManager');
      if (response.data.statusCode === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error fetching onboarding managers');
    },
    {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Add onboarding manager mutation
  const addManager = useMutation(
    (newManager) => apiService.post('/api/OnboardingManager', newManager),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('onboardingManagers');
      },
    }
  );

  // Update onboarding manager mutation
  const updateManager = useMutation(
    ({ id, ...data }) => apiService.post(`/api/OnboardingManager/update/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('onboardingManagers');
      },
    }
  );

  // Delete onboarding manager mutation
  const deleteManager = useMutation(
    ({ id, remarks }) => apiService.post(`/api/OnboardingManager/soft-delete/${id}`, { remarks }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('onboardingManagers');
      },
    }
  );

  return {
    managers,
    isLoading,
    error,
    addManager,
    updateManager,
    deleteManager,
  };
};

export default useOnboardingManagerData; 