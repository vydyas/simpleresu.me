import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  onLinkedInImport: () => void;
}

export function Header({
  onLinkedInImport,
}: HeaderProps) {
  const [isLinkedInDialogOpen, setIsLinkedInDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
      <div className="mx-auto max-w-7xl">
        <div className={`
          bg-white dark:bg-gray-900 
          rounded-[24px] 
          shadow-lg 
          border border-white/20
          p-4 
          transition-all duration-300 ease-in-out 
          flex justify-between items-center
          ${isScrolled ? 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-xl border-white/30' : ''}
          hover:shadow-xl hover:scale-[1.01]
        `}>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent whitespace-nowrap text-center">
              simpleresu.me
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Dialog
              open={isLinkedInDialogOpen}
              onOpenChange={setIsLinkedInDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className={`
                  bg-gradient-to-r from-[#0077B5] to-[#006699] 
                  text-white font-semibold 
                  py-2 px-4 
                  rounded-xl 
                  shadow-md 
                  transition duration-300 ease-in-out 
                  transform hover:scale-105 
                  focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:ring-opacity-50
                  ${isScrolled ? 'backdrop-blur-lg' : ''}
                `}>
                  <Linkedin className="w-5 h-5 mr-2" />
                  Import Data from Linkedin
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20">
                <DialogHeader>
                  <DialogTitle>Import from LinkedIn</DialogTitle>
                </DialogHeader>
                <div>
                  <p>Coming soon: LinkedIn profile import</p>
                  <Button
                    onClick={() => {
                      onLinkedInImport();
                      setIsLinkedInDialogOpen(false);
                    }}
                    className="mt-4 bg-gradient-to-r from-[#0077B5] to-[#006699]"
                  >
                    Import
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
