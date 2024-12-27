interface Skill {
  name: string;
  level?: string;
}

export function TwoColumnSkills({ skills }: { skills: (string | Skill)[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold border-b pb-1">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 rounded-md text-sm"
          >
            {typeof skill === 'string' ? skill : skill.name}
          </span>
        ))}
      </div>
    </div>
  );
} 