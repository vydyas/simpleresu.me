import FancyHeading from "../fancy-heading";

interface Skill {
  name: string;
}

interface SkillsProps {
  skills: Skill[];
  style?: 'chips' | 'list';
}

export function Skills({ skills, style = 'chips' }: SkillsProps) {
  if (style === 'list') {
    return (
      <div>
        <FancyHeading>Skills</FancyHeading>
        <div className="mt-2 text-sm text-gray-600 mb-2 ml-2">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="inline-flex items-center font-medium whitespace-nowrap"
              >
                {idx !== 0 && <span className="mr-1">•</span>}
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default chips style
  return (
    <div>
      <FancyHeading>Skills</FancyHeading>
      <div className="ml-2 flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
} 