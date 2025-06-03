import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '@/api/tasks';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  PlayIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import type { CIJob, CICheck, CIStep } from '@/types/task';

interface CIViewProps {
  taskId: string;
  className?: string;
}

const StatusIcon: React.FC<{ status: CIJob['status'] | CICheck['status'] | CIStep['status']; className?: string }> = ({ 
  status, 
  className = 'h-5 w-5' 
}) => {
  switch (status) {
    case 'success':
      return <CheckCircleIcon className={`${className} text-green-500`} />;
    case 'failure':
      return <XCircleIcon className={`${className} text-red-500`} />;
    case 'pending':
      return <ClockIcon className={`${className} text-yellow-500`} />;
    case 'running':
      return <ArrowPathIcon className={`${className} text-blue-500 animate-spin`} />;
    case 'cancelled':
    case 'skipped':
      return <ExclamationTriangleIcon className={`${className} text-gray-400`} />;
    default:
      return <EllipsisHorizontalIcon className={`${className} text-gray-400`} />;
  }
};

const StatusBadge: React.FC<{ status: CIJob['status'] | CICheck['status'] | CIStep['status'] }> = ({ status }) => {
  const colorClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    skipped: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      colorClasses[status as keyof typeof colorClasses] || colorClasses.pending
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

const CIJobCard: React.FC<{ job: CIJob }> = ({ job }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <StatusIcon status={job.status} className="h-4 w-4" />
        <h4 className="font-medium text-gray-900 dark:text-white">{job.name}</h4>
      </div>
      <StatusBadge status={job.status} />
    </div>

    {job.url && (
      <div>
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          View on GitHub →
        </a>
      </div>
    )}

    {job.steps && job.steps.length > 0 && (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Steps</h5>
        <div className="space-y-1">
          {job.steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <StatusIcon status={step.status} className="h-3 w-3" />
              <span className={`${
                step.status === 'failure' ? 'text-red-600 dark:text-red-400' :
                step.status === 'success' ? 'text-gray-900 dark:text-white' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {step.name}
              </span>
              {step.duration && (
                <span className="text-gray-500 text-xs">({step.duration})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="flex items-center justify-between text-xs text-gray-500">
      {job.duration && <span>Duration: {job.duration}</span>}
      {job.conclusion && (
        <span className={job.conclusion === 'success' ? 'text-green-600' : 'text-red-600'}>
          {job.conclusion}
        </span>
      )}
    </div>
  </div>
);

const CICheckCard: React.FC<{ check: CICheck }> = ({ check }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <StatusIcon status={check.status} className="h-4 w-4" />
        <h4 className="font-medium text-gray-900 dark:text-white">{check.name}</h4>
      </div>
      <StatusBadge status={check.status} />
    </div>

    {check.description && (
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{check.description}</p>
    )}

    {check.url && (
      <a 
        href={check.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
      >
        View Details →
      </a>
    )}
  </div>
);

export const CIView: React.FC<CIViewProps> = ({ taskId, className = '' }) => {
  const { data: ciStatus, isLoading, error, refetch } = useQuery({
    queryKey: ['task-ci', taskId],
    queryFn: () => taskApi.getTaskCI(taskId),
    refetchInterval: 10000, // Poll every 10 seconds
  });

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>Loading CI status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">Failed to load CI status</div>
          <p className="text-gray-500 text-sm mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!ciStatus) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-lg mb-2">No CI data available</div>
          <p className="text-sm">CI status will appear here once builds start running.</p>
        </div>
      </div>
    );
  }

  const hasActiveJobs = ciStatus.jobs?.some(job => 
    job.status === 'running' || job.status === 'pending'
  );

  return (
    <div className={`space-y-6 p-4 ${className}`}>
      {/* Overall Status Header */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <StatusIcon status={ciStatus.status} className="h-6 w-6" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CI Status
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {ciStatus.lastUpdated 
                  ? new Date(ciStatus.lastUpdated).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={ciStatus.status} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* GitHub Actions Jobs */}
      {ciStatus.jobs && ciStatus.jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">
              GitHub Actions ({ciStatus.jobs.length})
            </h4>
            {hasActiveJobs && (
              <span className="flex items-center text-sm text-blue-600">
                <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                Jobs running
              </span>
            )}
          </div>
          <div className="grid gap-4">
            {ciStatus.jobs.map((job, index) => (
              <CIJobCard key={job.id || index} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Status Checks */}
      {ciStatus.checks && ciStatus.checks.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Status Checks ({ciStatus.checks.length})
          </h4>
          <div className="grid gap-4">
            {ciStatus.checks.map((check, index) => (
              <CICheckCard key={check.id || index} check={check} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!ciStatus.jobs || ciStatus.jobs.length === 0) && 
       (!ciStatus.checks || ciStatus.checks.length === 0) && (
        <div className="text-center py-12">
          <PlayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No CI Jobs Running
          </h4>
          <p className="text-gray-500">
            GitHub Actions and status checks will appear here when they start running.
          </p>
        </div>
      )}
    </div>
  );
};
