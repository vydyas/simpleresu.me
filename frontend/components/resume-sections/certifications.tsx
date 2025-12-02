import FancyHeading from "../fancy-heading";
import { ExternalLink } from "lucide-react";
import { UserData } from "@/types/resume";    

interface CertificationsProps {
  certifications: UserData['certifications'];
}

export function Certifications({ certifications = [] }: CertificationsProps) {
  return (
    <div>
      <FancyHeading>Certifications</FancyHeading>
      <div className="space-y-3 mt-2 mb-4 ml-2">
        {certifications?.map((cert, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-gray-800">
                  {cert.title}
                </h3>
                <span className="text-gray-600">from</span>
                <span className="font-medium text-gray-700">{cert.organization}</span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center ml-1 text-gray-400 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <span className="text-gray-500 text-sm whitespace-nowrap ml-4">
                {cert.completionDate}
              </span>
            </div>
            {cert.description && (
              <p className="text-gray-600 text-sm">{cert.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 