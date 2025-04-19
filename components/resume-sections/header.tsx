import { Github, Linkedin, MapPin, Phone, Mail } from "lucide-react";

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
    <div className="text-center px-2 sm:px-4 max-w-4xl mx-auto">
      <div className={`text-2xl sm:text-3xl md:text-4xl font-bold uppercase mb-2`}>
        <span style={{ color: nameColor }}>{userData.firstName}</span>{' '}
        <span style={{ color: nameColor }}>{userData.lastName}</span>
      </div>
      {userData.headline && (
        <p className="text-gray-600 mb-2 text-base sm:text-lg">{userData.headline}</p>
      )}
      
      {/* Contact Information Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-y-1 sm:gap-x-3 text-sm sm:text-base text-gray-600 flex-wrap max-w-3xl mx-auto">
        {/* Email */}
        <div className="flex items-center">
          <div className="flex items-center whitespace-nowrap">
            <Mail className="w-4 h-4 flex-shrink-0 text-gray-500 mr-1" />
            <a 
              href={`mailto:${userData.email}`}
              className="hover:text-primary transition-colors cursor-pointer select-all"
              title={userData.email}
            >
              {userData.email}
            </a>
          </div>
        </div>
        
        {/* Phone */}
        {userData.phoneNumber && (
          <div className="flex items-center">
            <span className="hidden sm:inline text-gray-300 mr-3">•</span>
            <div className="flex items-center whitespace-nowrap">
              <Phone className="w-4 h-4 flex-shrink-0 text-gray-500 mr-1" />
              <a 
                href={`tel:${userData.phoneNumber}`}
                className="hover:text-primary transition-colors cursor-pointer select-all"
                title={userData.phoneNumber}
              >
                {userData.phoneNumber}
              </a>
            </div>
          </div>
        )}
        
        {/* Location */}
        {userData.location && (
          <div className="flex items-center">
            <span className="hidden sm:inline text-gray-300 mr-3">•</span>
            <div className="flex items-center whitespace-nowrap">
              <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500 mr-1" />
              <span className="select-all" title={userData.location}>
                {userData.location}
              </span>
            </div>
          </div>
        )}
        
        {/* Github */}
        {userData.githubId && (
          <div className="flex items-center">
            <span className="hidden sm:inline text-gray-300 mr-3">•</span>
            <div className="flex items-center whitespace-nowrap">
              <Github className="w-4 h-4 flex-shrink-0 text-gray-500 mr-1" />
              <a
                href={`https://github.com/${userData.githubId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                title={`github.com/${userData.githubId}`}
              >
                {userData.githubId}
              </a>
            </div>
          </div>
        )}
        
        {/* LinkedIn */}
        {userData.linkedinId && (
          <div className="flex items-center">
            <span className="hidden sm:inline text-gray-300 mr-3">•</span>
            <div className="flex items-center whitespace-nowrap">
              <Linkedin className="w-4 h-4 flex-shrink-0 text-gray-500 mr-1" />
              <a
                href={`https://linkedin.com/in/${userData.linkedinId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                title={`linkedin.com/in/${userData.linkedinId}`}
              >
                {userData.linkedinId}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 