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
      <div className="space-y-2 ml-2">
        {positions.map((position, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex">
                        <div className="font-semibold">{position.title}</div>
                        <span>&nbsp;at&nbsp;</span>
                <div style={{ color: companyColor }}>{position.company}</div>
              </div>
              <div className="text-sm text-gray-500">
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