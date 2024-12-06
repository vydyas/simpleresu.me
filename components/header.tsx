import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from 'react';

interface HeaderProps {
  activeTemplate: string;
  onTemplateChange: (template: string) => void;
  githubId: string;
  onGitHubIdSubmit: (id: string) => void;
  onLinkedInImport: () => void;
}

export function Header({
  activeTemplate, 
  onTemplateChange, 
  githubId, 
  onGitHubIdSubmit,
  onLinkedInImport
}: HeaderProps) {
  const [localGitHubId, setLocalGitHubId] = useState("");
  const [isLinkedInDialogOpen, setIsLinkedInDialogOpen] = useState(false);

  useEffect(() => {
    setLocalGitHubId(githubId);
  }, [githubId]);

  const templates = [
    { value: 'default', label: 'Default Template' },
    { value: 'modern', label: 'Modern Template' },
    { value: 'classic', label: 'Classic Template' }
  ];

  const handleGitHubSubmit = () => {
    onGitHubIdSubmit(localGitHubId);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          SimpleResu.me
        </h1>

        {/* Template Dropdown */}
        <Select 
          value={activeTemplate} 
          onValueChange={onTemplateChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem 
                key={template.value} 
                value={template.value}
              >
                {template.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        {/* GitHub Import */}
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="GitHub Username" 
            value={localGitHubId}
            onChange={(e) => setLocalGitHubId(e.target.value)}
            className="w-[150px]"
          />
          <Button onClick={handleGitHubSubmit}>
            Import GitHub
          </Button>
        </div>

        {/* LinkedIn Import */}
        <Dialog 
          open={isLinkedInDialogOpen} 
          onOpenChange={setIsLinkedInDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline">
              Import data from LinkedIn
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import from LinkedIn</DialogTitle>
            </DialogHeader>
            {/* LinkedIn import form or instructions */}
            <div>
              <p>Coming soon: LinkedIn profile import</p>
              {/* Add LinkedIn import logic later */}
              <Button 
                onClick={() => {
                  onLinkedInImport();
                  setIsLinkedInDialogOpen(false);
                }}
              >
                Import
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
