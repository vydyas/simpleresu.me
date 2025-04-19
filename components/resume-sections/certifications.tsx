import FancyHeading from "../fancy-heading";
import { ExternalLink } from "lucide-react";

interface Certification {
  title: string;
  organization: string;
  completionDate: string;
  description?: string;
  credentialUrl?: string;
}

interface CertificationsProps {
  certifications?: Certification[];
}

export function Certifications({ certifications = [] }: CertificationsProps) {
  return (
    <div>
      <FancyHeading>Certifications</FancyHeading>
      <div className="space-y-4 ml-2">
        {certifications?.map((cert, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-y-1">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-1">
                  <h3 className="font-semibold text-gray-800">{cert.title}</h3>
                  <span className="text-gray-600">from</span>
                  <span className="font-medium text-gray-700">{cert.organization}</span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-400 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {cert.description && (
                  <div 
                    className="text-sm text-gray-600 rich-text-content"
                    dangerouslySetInnerHTML={{ __html: cert.description }}
                  />
                )}
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {cert.completionDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 