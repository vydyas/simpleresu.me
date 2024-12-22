import { Github, Linkedin } from "lucide-react";

interface HeaderProps {
  userData: {
    firstName: string;
    lastName: string;
    headline?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    githubId?: string;
    linkedinId?: string;
  };
  nameFont: string;
  nameColor: string;
}

export function Header({ userData, nameColor }: HeaderProps) {
  return (
    <div className="text-center">
      <div className={`text-4xl font-bold uppercase`}>
        <span style={{ color: nameColor }}>{userData.firstName}</span>{' '}
        <span style={{ color: nameColor }}>{userData.lastName}</span>
      </div>
      {userData.headline && (
        <p className="text-gray-600 mt-1 text-lg">{userData.headline}</p>
      )}
      <div className="flex justify-center gap-4 mt-2 text-base text-gray-600 flex-wrap mb-2">
        <div className="flex items-center gap-1 text-base">
          {/* Contact Info */}
          {userData.email && (
            <div className="flex items-center gap-1">
              <span>{userData.email}</span>
            </div>
          )}
          {userData.phoneNumber && (
            <div className="flex items-center gap-1">
              <span>• {userData.phoneNumber}</span>
            </div>
          )}
          {userData.location && (
            <div className="flex items-center gap-1">
              <span>• {userData.location}</span>
            </div>
          )}
          {/* Social Links */}
          {userData.githubId && (
            <div className="flex items-center gap-1">
              <span>
                <a
                  href={`https://github.com/${userData.githubId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  • <Github className="w-4 h-4" />
                  {userData.githubId}
                </a>
              </span>
            </div>
          )}
          {userData.linkedinId && (
            <div className="flex items-center gap-1">
              <span>
                <a
                  href={`https://www.linkedin.com/in/${userData.linkedinId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  • <Linkedin className="w-4 h-4" />
                  {userData.linkedinId}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 