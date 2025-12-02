import { Job } from '@/app/job-tracker/page';
import { KanbanColumn } from './kanban-column';
import { DragOverlay } from '@dnd-kit/core';
import { JobCard } from './job-card';
import { Plus } from 'lucide-react';
import { CustomSection } from '@/types/job-board';

interface KanbanBoardProps {
  jobs: Job[];
  onDeleteJob: (id: string) => void;
  activeId: string | null;
  customSections: CustomSection[];
  onAddSection: () => void;
  onDeleteSection?: (sectionId: string) => void;
}

const DEFAULT_COLUMNS: CustomSection[] = [
  { id: 'shortlist', title: 'Shortlist', color: 'bg-blue-50 border-blue-200', isDefault: true },
  { id: 'applied', title: 'Applied', color: 'bg-purple-50 border-purple-200', isDefault: true },
  { id: 'interview', title: 'Interview', color: 'bg-yellow-50 border-yellow-200', isDefault: true },
  { id: 'offer', title: 'Offer', color: 'bg-green-50 border-green-200', isDefault: true },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-50 border-red-200', isDefault: true },
];

export function KanbanBoard({ 
  jobs, 
  onDeleteJob, 
  activeId, 
  customSections, 
  onAddSection,
  onDeleteSection 
}: KanbanBoardProps) {
  const activeJob = jobs.find(job => job.id === activeId);
  const allColumns = [...DEFAULT_COLUMNS, ...customSections];

  const handleDeleteSection = (sectionId: string) => {
    if (onDeleteSection) {
      onDeleteSection(sectionId);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-x-auto">
        <div className="inline-flex gap-4 p-0.5 h-full min-w-full">
          {allColumns.map(column => (
            <div key={column.id} className="flex-shrink-0 w-[350px]">
              <KanbanColumn
                title={column.title}
                jobs={jobs.filter(job => job.status === column.id)}
                status={column.id}
                onDeleteJob={onDeleteJob}
                colorClass={column.color}
                onDelete={!column.isDefault ? () => handleDeleteSection(column.id) : undefined}
              />
            </div>
          ))}
          
          {/* Add Section Button */}
          <div className="flex-shrink-0 w-[350px]">
            <button
              onClick={onAddSection}
              className="h-full min-h-[700px] w-full rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-gray-600"
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Add Section</span>
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && activeJob ? (
          <JobCard
            job={activeJob}
            onDelete={() => onDeleteJob(activeJob.id)}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </>
  );
} 