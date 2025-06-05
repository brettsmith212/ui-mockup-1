import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/tasks';
import { queryKeys } from '../lib/query-client';
import { CreateTaskRequest, Task } from '../types/task';
import { extractRepoInfo, sanitizeInput } from '../utils/validation';
import { isDevelopment } from '../config/environment';

interface CreateTaskData {
  repoUrl: string;
  prompt: string;
}

interface CreateTaskError {
  message: string;
  field?: string;
}

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, CreateTaskError, CreateTaskData>({
    mutationFn: async (data: CreateTaskData) => {
      const sanitizedData = {
        repoUrl: sanitizeInput(data.repoUrl),
        prompt: sanitizeInput(data.prompt)
      };

      const repoInfo = extractRepoInfo(sanitizedData.repoUrl);
      if (!repoInfo) {
        throw { message: 'Invalid repository URL format', field: 'repoUrl' };
      }

      const createRequest: CreateTaskRequest = {
        repo: sanitizedData.repoUrl,
        prompt: sanitizedData.prompt,
        title: `Task for ${repoInfo.fullName}`
      };

      try {
        if (isDevelopment()) {
          console.log('📝 Creating task with request:', createRequest);
        }
        const response = await taskApi.createTask(createRequest);
        return response;
      } catch (error: any) {
        if (error.response?.status === 400) {
          throw { 
            message: error.response.data.message || 'Invalid request data',
            field: error.response.data.field 
          };
        } else if (error.response?.status === 401) {
          throw { message: 'Authentication required. Please log in again.' };
        } else if (error.response?.status === 403) {
          throw { message: 'You do not have permission to create tasks for this repository.' };
        } else if (error.response?.status === 409) {
          throw { message: 'A task already exists for this repository and prompt.' };
        } else if (error.response?.status >= 500) {
          throw { message: 'Server error. Please try again later.' };
        } else {
          throw { message: 'Failed to create task. Please check your connection and try again.' };
        }
      }
    },
    onSuccess: (newTask) => {
      if (isDevelopment()) {
        console.log('✅ Task created successfully:', newTask);
      }
      
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() });
      
      // Set the individual task in cache
      queryClient.setQueryData(queryKeys.tasks.detail(newTask.id), newTask);
    },
    onError: (error) => {
      console.error('Task creation failed:', error);
    }
  });
};

export const useCreateTaskWithToast = () => {
  const createTaskMutation = useCreateTask();
  
  return {
    ...createTaskMutation,
    createTask: async (data: CreateTaskData) => {
      try {
        const result = await createTaskMutation.mutateAsync(data);
        // Toast success would be handled in the component
        return result;
      } catch (error) {
        // Toast error would be handled in the component
        throw error;
      }
    }
  };
};
