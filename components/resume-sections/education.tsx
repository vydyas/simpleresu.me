import FancyHeading from "../fancy-heading";

interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface EducationProps {
  educations: Education[];
}

export function Education({ educations }: EducationProps) {
  return (
    <div>
      <FancyHeading>Education</FancyHeading>
      <div className="space-y-4 ml-2">
        {educations.map((education, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-1">
              <div className="space-y-1 sm:space-y-0">
                <h3 className="font-semibold text-base">
                  {education.degree} in {education.fieldOfStudy}
                </h3>
                <p className="text-sm text-gray-600">
                  {education.schoolName}
                </p>
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {education.startDate} - {education.endDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 