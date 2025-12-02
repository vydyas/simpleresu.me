import FancyHeading from "../fancy-heading";

interface Skill {
  name: string;
}

interface SkillsProps {
  skills: Skill[];
  style: 'chips' | 'list';
}

export function Skills({ skills, style }: SkillsProps) {
  return (
    <div>
      <FancyHeading>Skills</FancyHeading>
      {style === 'chips' ? (
        <div className="flex flex-wrap gap-2 mt-2 mb-4 ml-2">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 font-semibold"
            >
              {skill.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-sm text-gray-600 mb-2 ml-2">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="inline-flex items-center font-semibold whitespace-nowrap"
              >
                {idx !== 0 && <span className="mr-1">•</span>}
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 