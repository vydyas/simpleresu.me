export function TwoColumnExperience({ positions }: { positions: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-1">Experience</h2>
      {positions.map((position, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{position.title}</h3>
              <p className="text-sm text-gray-600">{position.company}</p>
            </div>
            <p className="text-sm text-gray-500">
              {position.startDate} - {position.endDate}
            </p>
          </div>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: position.description }} />
        </div>
      ))}
    </div>
  );
} 