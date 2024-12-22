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
        <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap mb-2 ml-2">
          <div className="flex items-center gap-1 text-base">
            {skills.map((skill, idx) => (
              <div
                className="flex items-center gap-1 font-semibold"
                key={idx}
              >
                <span>
                  {idx === 0 ? "" : "• "}
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 