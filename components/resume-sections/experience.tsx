import FancyHeading from "../fancy-heading";
import { useStyling } from "../../lib/styling-context";

interface Position {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceProps {
  positions: Position[];
}

export function Experience({ positions }: ExperienceProps) {
  const { companyColor } = useStyling();
  
  return (
    <div>
      <FancyHeading>Experience</FancyHeading>
      <div className="space-y-4 ml-2">
        {positions.map((position, index) => (
          <div key={index} className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-1">
              <div className="flex flex-wrap items-center gap-x-1">
                <div className="font-semibold">{position.title}</div>
                <span className="whitespace-nowrap">at</span>
                <div className="whitespace-nowrap" style={{ color: companyColor }}>{position.company}</div>
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {position.startDate} - {position.endDate}
              </div>
            </div>
            <div className="text-sm rich-text-content ml-2" dangerouslySetInnerHTML={{ __html: position.description }} />
          </div>
        ))}
      </div>
    </div>
  );
} 