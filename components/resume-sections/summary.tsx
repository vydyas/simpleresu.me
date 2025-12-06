import FancyHeading from "../fancy-heading";

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div>
      <FancyHeading>Summary</FancyHeading>
      <div
        className="text-base ml-2 rich-text-content"
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </div>
  );
} 