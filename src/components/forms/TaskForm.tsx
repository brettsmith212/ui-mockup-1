import React, { useState } from 'react';
import Button from '../ui/Button';
import Input, { Textarea } from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { validateTaskForm, FormErrors } from '../../utils/validation';
import { useCreateTask } from '../../hooks/useCreateTask';

interface TaskFormProps {
  onSuccess?: (taskId: string) => void;
  onCancel?: () => void;
}

interface FormData {
  prompt: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    prompt: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTaskMutation = useCreateTask();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const validation = validateTaskForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('🚀 Submitting task creation...');
      const task = await createTaskMutation.mutateAsync({
        prompt: formData.prompt
      });
      
      console.log('✅ Task created successfully:', task);

      // Reset form
      setFormData({ prompt: '' });
      
      // Call success callback
      onSuccess?.(task.id);
    } catch (error: any) {
      console.error('❌ Task creation failed:', error);
      if (error.field) {
        setErrors({ [error.field]: error.message });
      } else {
        setErrors({ general: error.message || 'Failed to create task' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.prompt.trim() && Object.keys(errors).length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Initial Prompt
          </label>
          <Textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            placeholder="Describe what you want Amp to do..."
            rows={4}
            disabled={isSubmitting}
            error={errors.prompt}
            resize={false}
          />
          <div className="mt-1 flex justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Minimum 10 characters, maximum 2000 characters
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.prompt.length}/2000
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Creating...</span>
            </div>
          ) : (
            'Create Task'
          )}
        </Button>
      </div>
    </form>
  );
};
