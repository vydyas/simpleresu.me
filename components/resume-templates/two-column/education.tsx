export function TwoColumnEducation({ educations }: { educations: any[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold border-b pb-1">Education</h2>
      {educations.map((education, index) => (
        <div key={index} className="space-y-1">
          <h3 className="font-medium">{education.schoolName}</h3>
          <p className="text-sm">{education.degree}</p>
          <p className="text-sm text-gray-500">
            {education.startDate} - {education.endDate}
          </p>
        </div>
      ))}
    </div>
  );
} 