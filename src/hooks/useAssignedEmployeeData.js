import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useAssignedEmployeeData = (searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch assigned employees with caching
  const { data: assignedEmployees = [], isLoading, error } = useQuery(
    ['assignedEmployees', searchQuery],
    async () => {
      const [roleAssignResponse, assignedEmployeeResponse] = await Promise.all([
        axiosInstance.get('/api/employeeroleassign?isAssigned=true'),
        axiosInstance.get('/api/assignedemployee')
      ]);

      const roleAssignEmployees = roleAssignResponse.data?.data || [];
      const assignedEmployees = assignedEmployeeResponse.data?.data || [];

      const assignedMap = new Map(
        assignedEmployees.map((item) => [
          item.roleAssignId,
          {
            id: item.id,
            hasGeneratedOfferLetter: item.hasGeneratedOfferLetter || false
          }
        ])
      );

      return {
        employees: roleAssignEmployees,
        assignedMap
      };
    },
    {
      staleTime: 30000, // Data considered fresh for 30 seconds
      cacheTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: false,
      refetchInterval: 30000, // Poll every 30 seconds
    }
  );

  // Generate offer letter mutation
  const generateOfferLetter = useMutation(
    (payload) => axiosInstance.post('/api/assignedemployee/create', payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignedEmployees');
      },
    }
  );

  // Download offer letter mutation
  const downloadOfferLetter = useMutation(
    (assignedEmployeeId) => 
      axiosInstance.get(`/api/assignedemployee/download?id=${assignedEmployeeId}`, {
        responseType: 'blob'
      }),
    {
      onSuccess: (response, assignedEmployeeId) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `OfferLetter_${assignedEmployeeId}.pdf`;
        link.click();
      },
    }
  );

  return {
    assignedEmployees: assignedEmployees?.employees || [],
    assignedMap: assignedEmployees?.assignedMap || new Map(),
    isLoading,
    error,
    generateOfferLetter,
    downloadOfferLetter,
  };
};

export default useAssignedEmployeeData; 