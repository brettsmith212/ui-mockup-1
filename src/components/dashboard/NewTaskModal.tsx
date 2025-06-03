import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import { TaskForm } from '../forms/TaskForm';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleTaskCreated = (taskId: string) => {
    onClose();
    navigate(`/tasks/${taskId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      size="lg"
    >
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Start a new Amp task
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Provide a repository URL and describe what you want Amp to do. Amp will clone the repository and begin working on your request.
          </p>
        </div>

        <TaskForm
          onSuccess={handleTaskCreated}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
