import { Job } from '@/app/job-tracker/page';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, Trash2, Building2, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { ConfirmationDialog } from '../ui/confirmation-dialog';

interface JobCardProps {
  job: Job;
  onDelete: () => void;
  isDragging?: boolean;
}

export function JobCard({ job, onDelete, isDragging }: JobCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging: isCurrentlyDragging } = useDraggable({
    id: job.id,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
      bg-white p-4 rounded-md shadow-sm border 
      hover:shadow-md transition-shadow duration-200
      ${isDragging ? 'opacity-75' : ''}
      ${isCurrentlyDragging ? 'opacity-0' : ''}
    `}
      >
        <div className='flex justify-between items-start gap-2 mb-2'>
          <div
            {...attributes}
            {...listeners}
            className='flex-1 min-w-0 cursor-grab active:cursor-grabbing'
          >
            <h3 className='font-medium text-gray-900 truncate'>{job.title}</h3>
            <div className='flex items-center gap-1 text-sm text-gray-600 mt-1'>
              <Building2 className='h-3 w-3' />
              <span className='truncate'>{job.company}</span>
            </div>
            <div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
              <Calendar className='h-3 w-3' />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>

          <Button
            variant='ghost'
            size='icon'
            className='text-gray-400 hover:text-red-600 transition-colors shrink-0'
            onClick={handleDeleteClick}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        {job.link && (
          <a
            href={job.link}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 group w-fit'
            onClick={(e) => e.stopPropagation()}
          >
            View Job
            <ExternalLink className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
          </a>
        )}
      </div>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title='Delete Job'
        description={`Are you sure you want to delete "${job.title}" at ${job.company}?`}
        confirmText='Delete'
        cancelText='Cancel'
      />
    </>
  );
} 