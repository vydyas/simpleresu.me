"use client";

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, DragStartEvent } from '@dnd-kit/core';
import { KanbanBoard } from '@/components/job-tracker/kanban-board';
import { AddJobDialog } from '@/components/job-tracker/add-job-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { JobBoard, CustomSection } from '@/types/job-board';
import { AddBoardDialog } from '@/components/job-tracker/add-board-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export type JobStatus = 'shortlist' | 'applied' | 'interview' | 'offer' | 'rejected' | string;

export interface Job {
  id: string;
  company: string;
  title: string;
  link?: string;
  status: JobStatus;
  createdAt: string;
}

// Add structured data for rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Job Application Tracker',
  applicationCategory: 'Career Management Tool',
  description: 'Track and manage your job applications with our intuitive Kanban board system.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'Kanban board visualization',
    'Custom status columns',
    'Application tracking',
    'Interview status management',
    'Drag and drop interface'
  ]
};

export default function JobTracker() {
  const [mounted, setMounted] = useState(false);
  const [boards, setBoards] = useState<JobBoard[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [customSections, setCustomSections] = useState<CustomSection[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customSections');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    setMounted(true);
    const savedBoards = localStorage.getItem('jobBoards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);
      setCurrentBoardId(parsedBoards[0]?.id || null);
    }
  }, []);

  // Add script tag for structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!mounted) return null;

  const currentBoard = boards.find(board => board.id === currentBoardId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over && active.id !== over.id && currentBoard) {
      const activeJob = currentBoard.jobs.find(job => job.id === active.id);
      const newStatus = over.id as JobStatus;
      
      if (activeJob && activeJob.status !== newStatus) {
        const updatedBoards = boards.map(board => {
          if (board.id === currentBoardId) {
            return {
              ...board,
              jobs: board.jobs.map(job => 
                job.id === active.id ? { ...job, status: newStatus } : job
              )
            };
          }
          return board;
        });
        setBoards(updatedBoards);
        localStorage.setItem('jobBoards', JSON.stringify(updatedBoards));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const addBoard = (name: string) => {
    const newBoard: JobBoard = {
      id: `board-${Date.now()}`,
      name,
      jobs: [],
      createdAt: new Date().toISOString(),
    };
    
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setCurrentBoardId(newBoard.id);
    localStorage.setItem('jobBoards', JSON.stringify(updatedBoards));
    setIsAddBoardOpen(false);
  };

  const addJob = (newJob: Omit<Job, 'id' | 'createdAt'>) => {
    if (!currentBoardId) return;

    const job: Job = {
      ...newJob,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedBoards = boards.map(board => {
      if (board.id === currentBoardId) {
        return {
          ...board,
          jobs: [...board.jobs, job]
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    localStorage.setItem('jobBoards', JSON.stringify(updatedBoards));
    setIsAddJobOpen(false);
  };

  const deleteJob = (jobId: string) => {
    if (!currentBoardId) return;

    const updatedBoards = boards.map(board => {
      if (board.id === currentBoardId) {
        return {
          ...board,
          jobs: board.jobs.filter(job => job.id !== jobId)
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    localStorage.setItem('jobBoards', JSON.stringify(updatedBoards));
  };

  const handleAddSection = () => {
    const name = prompt('Enter section name:');
    if (!name) return;

    const newSection: CustomSection = {
      id: `section-${Date.now()}`,
      title: name,
      color: 'bg-gray-50 border-gray-200' // default color
    };

    setCustomSections(prev => {
      const updated = [...prev, newSection];
      localStorage.setItem('customSections', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    // Update custom sections
    const updatedSections = customSections.filter(section => section.id !== sectionId);
    setCustomSections(updatedSections);
    localStorage.setItem('customSections', JSON.stringify(updatedSections));

    // Update jobs to move them to 'shortlist' or another default status
    if (currentBoard) {
      const updatedBoards = boards.map(board => {
        if (board.id === currentBoardId) {
          return {
            ...board,
            jobs: board.jobs.map(job => 
              job.status === sectionId ? { ...job, status: 'shortlist' } : job
            )
          };
        }
        return board;
      });
      setBoards(updatedBoards);
      localStorage.setItem('jobBoards', JSON.stringify(updatedBoards));
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 bg-white border-b">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6">
                  <h1 className="text-2xl font-bold text-gray-800">Job Tracker</h1>
                  <Link 
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ← Back to Resume Builder
                  </Link>
                </div>
                {boards.length > 0 && (
                  <Select value={currentBoardId || ''} onValueChange={setCurrentBoardId}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map(board => (
                        <SelectItem key={board.id} value={board.id}>
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" onClick={() => setIsAddBoardOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Board
                </Button>
              </div>
              {currentBoard && (
                <Button onClick={() => setIsAddJobOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-4">
          <div className="h-full max-w-[1800px] mx-auto">
            {currentBoard ? (
              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <KanbanBoard 
                  jobs={currentBoard.jobs} 
                  onDeleteJob={deleteJob}
                  activeId={activeId}
                  customSections={customSections}
                  onAddSection={handleAddSection}
                  onDeleteSection={handleDeleteSection}
                />
              </DndContext>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-600 mb-4">
                    Create your first job board
                  </h2>
                  <Button onClick={() => setIsAddBoardOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Board
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <AddJobDialog
          open={isAddJobOpen}
          onOpenChange={setIsAddJobOpen}
          onSubmit={addJob}
          customSections={customSections}
        />
        <AddBoardDialog
          open={isAddBoardOpen}
          onOpenChange={setIsAddBoardOpen}
          onSubmit={addBoard}
        />
      </div>
    </div>
  );
} 