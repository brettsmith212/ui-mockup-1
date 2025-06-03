import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import TableFilters from '../components/dashboard/TableFilters';
import TaskTable from '../components/dashboard/TaskTable';
import { NewTaskModal } from '../components/dashboard/NewTaskModal';

export default function Dashboard() {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor your Amp coding tasks
          </p>
        </div>
        
        <Button 
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TableFilters />
      </div>

      {/* Task table */}
      <TaskTable />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </div>
  );
}
