import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useAssignedEmployeeData = (searchQuery = '') => {
  const queryClient = useQueryClient();
  const [loadingStates, setLoadingStates] = React.useState({
    generating: null,
    downloading: null
  });

  // Fetch assigned employees with caching
  const { data: assignedData = {}, isLoading: isDataLoading, error: dataError } = useQuery(
    ['assignedEmployees', searchQuery],
    async () => {
      const [roleAssignResponse, assignedEmployeeResponse] = await Promise.all([
        axiosInstance.get('/api/EmployeeRoleAssign?isAssigned=true'),
        axiosInstance.get('/api/AssignedEmployee')
      ]);

      if (roleAssignResponse.data.status !== "Success" || assignedEmployeeResponse.data.status !== "Success") {
        throw new Error('Failed to fetch assigned employees data');
      }

      const roleAssignEmployees = roleAssignResponse.data?.data || [];
      const assignedEmployees = assignedEmployeeResponse.data?.data || [];

      // Create a map of assigned employees with their offer letter status
      const assignedMap = new Map(
        assignedEmployees.map((item) => [
          item.roleAssignId,
          {
            id: item.id,
            hasGeneratedOfferLetter: item.hasGeneratedOfferLetter || false
          }
        ])
      );

      // Filter out unassigned and deleted employees
      const filteredEmployees = roleAssignEmployees.filter(emp => 
        emp.isAssigned === true && !emp.isDeleted
      );

      return {
        employees: filteredEmployees,
        assignedMap
      };
    },
    {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Generate offer letter mutation
  const generateOfferLetter = useMutation(
    async (payload) => {
      setLoadingStates(prev => ({ ...prev, generating: payload.roleAssignId }));
      try {
        const response = await axiosInstance.post('/api/AssignedEmployee', payload);
        if (response.data.status === "Success") {
          return response.data;
        }
        throw new Error(response.data.message || 'Failed to generate offer letter');
      } finally {
        setLoadingStates(prev => ({ ...prev, generating: null }));
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignedEmployees');
      },
    }
  );

  // Download offer letter mutation with separate loading state
  const downloadOfferLetter = useMutation(
    async (assignedEmployeeId) => {
      setLoadingStates(prev => ({ ...prev, downloading: assignedEmployeeId }));
      try {
        const response = await axiosInstance.get(`/api/AssignedEmployee/download?id=${assignedEmployeeId}`, {
          responseType: 'blob'
        });
        return { response, assignedEmployeeId };
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to download offer letter');
      } finally {
        setLoadingStates(prev => ({ ...prev, downloading: null }));
      }
    },
    {
      onSuccess: ({ response, assignedEmployeeId }) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `OfferLetter_${assignedEmployeeId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    }
  );

  return {
    assignedEmployees: assignedData?.employees || [],
    assignedMap: assignedData?.assignedMap || new Map(),
    isLoading: isDataLoading,
    isGenerating: (id) => loadingStates.generating === id,
    isDownloading: (id) => loadingStates.downloading === id,
    error: dataError,
    generateError: generateOfferLetter.error,
    downloadError: downloadOfferLetter.error,
    generateOfferLetter,
    downloadOfferLetter,
  };
};

export default useAssignedEmployeeData; 