export function TwoColumnProjects({ projects }: { projects: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold border-b pb-1">Projects</h2>
      {projects.map((project, index) => (
        <div key={index} className="space-y-2">
          <h3 className="font-medium">{project.name}</h3>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>
      ))}
    </div>
  );
} 