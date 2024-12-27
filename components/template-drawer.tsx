"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LayoutTemplate } from "lucide-react";
import Image from "next/image";

interface TemplateDrawerProps {
  activeTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  {
    id: "default",
    name: "Classic",
    image: "/templates/default.png",
  },
  {
    id: "modern",
    name: "Modern",
    image: "/templates/modern.png",
  },
  {
    id: "two-column",
    name: "Two Column",
    image: "/templates/two-column.png",
  },
];

export function TemplateDrawer({ activeTemplate, onTemplateChange }: TemplateDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Choose Template</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                activeTemplate === template.id
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <Image
                src={template.image}
                alt={template.name}
                width={400}
                height={565}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-center">
                {template.name}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 