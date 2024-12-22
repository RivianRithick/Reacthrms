import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../apiService';

export const useJobRoleData = (searchQuery = '') => {
  const queryClient = useQueryClient();

  // Fetch job roles with caching
  const { data: jobRoles = [], isLoading, error } = useQuery(
    ['jobRoles', searchQuery],
    async () => {
      const response = await axiosInstance.get("/api/jobroles");
      const { data } = response.data;
      return data.flatMap((departmentData) =>
        departmentData.department.jobRoles.map((jobRole) => ({
          ...jobRole,
          departmentName: departmentData.department.name,
        }))
      );
    },
    {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Fetch departments for the form
  const { data: departments = [] } = useQuery(
    'departments',
    async () => {
      const response = await axiosInstance.get("/api/departments");
      return response.data?.data || [];
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Add job role mutation
  const addJobRole = useMutation(
    (newJobRole) => axiosInstance.post("/api/jobroles/create-jobrole", newJobRole),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobRoles');
      },
    }
  );

  // Update job role mutation
  const updateJobRole = useMutation(
    (updatedJobRole) => axiosInstance.post("/api/jobroles/update", updatedJobRole),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobRoles');
      },
    }
  );

  // Delete job role mutation
  const deleteJobRole = useMutation(
    (jobRoleId) => axiosInstance.post("/api/jobroles/delete", jobRoleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobRoles');
      },
    }
  );

  return {
    jobRoles,
    departments,
    isLoading,
    error,
    addJobRole,
    updateJobRole,
    deleteJobRole,
  };
};

export default useJobRoleData; 