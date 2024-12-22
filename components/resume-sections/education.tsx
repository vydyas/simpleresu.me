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
      {educations.map((education, idx) => (
        <div key={idx} className="ml-2 mb-4 last:mb-0">
          <div className="flex justify-between">
            <h3 className="font-semibold text-base">
              {education.degree} in {education.fieldOfStudy}
            </h3>
            <p className="text-xs text-gray-600">
              {education.startDate} - {education.endDate}
            </p>
          </div>
          <p className="text-xs text-gray-600">
            {education.schoolName}
          </p>
        </div>
      ))}
    </div>
  );
} 