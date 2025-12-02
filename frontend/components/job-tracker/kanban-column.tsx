import { Job, JobStatus } from '@/app/job-tracker/page';
import { useDroppable } from '@dnd-kit/core';
import { JobCard } from './job-card';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface KanbanColumnProps {
  title: string;
  jobs: Job[];
  status: JobStatus;
  onDeleteJob: (id: string) => void;
  colorClass: string;
  onDelete?: () => void;
}

export function KanbanColumn({ 
  title, 
  jobs, 
  status, 
  onDeleteJob, 
  colorClass,
  onDelete 
}: KanbanColumnProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={`flex flex-col h-[calc(100vh-8rem)] rounded-lg border-2 ${colorClass} transition-colors duration-200 ${
          isOver ? 'ring-2 ring-primary ring-opacity-50' : ''
        }`}
      >
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white bg-opacity-50">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">
              {title}
              <span className="ml-2 text-sm text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">
                {jobs.length}
              </span>
            </h2>
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Delete section"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-3">
            <AnimatePresence>
              {jobs.map(job => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <JobCard
                    job={job}
                    onDelete={() => onDeleteJob(job.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Section"
        description={`Are you sure you want to delete the "${title}" section? All jobs in this section will be moved to Shortlist.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
} 