import FancyHeading from "../fancy-heading";
import { Link } from "lucide-react";

interface Project {
  title: string;
  link: string;
  description: string;
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <div>
      <FancyHeading>Projects</FancyHeading>
      {projects.map((project, idx) => (
        <div key={idx} className="ml-2 last:mb-0 my-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">{project.title}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    <Link className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div
                className="text-sm rich-text-content"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 