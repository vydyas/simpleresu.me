import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitHubRepos } from "../github-repos";

interface GoogleSearchResumeProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    headline: string;
    summary: string;
    positions: Array<{
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    educations: Array<{
      schoolName: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate: string;
    }>;
    skills: Array<{ name: string }>;
  };
  githubId: string;
}

export default function GoogleSearchResume({
  userData,
  githubId,
}: GoogleSearchResumeProps) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-4">
      <div className="mb-4">
        <input
          type="text"
          value={`${userData.firstName} ${userData.lastName}`}
          readOnly
          className="w-full p-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4 text-sm text-gray-600">
        About {Math.floor(Math.random() * 100000)} results (0.
        {Math.floor(Math.random() * 100)} seconds)
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-600 hover:underline">
            {userData.firstName} {userData.lastName} - Professional Profile
          </h2>
          <p className="text-sm text-green-700 mb-2">
            https://www.linkedin.com/in/{userData.firstName.toLowerCase()}-
            {userData.lastName.toLowerCase()}
          </p>
          <p className="text-sm text-gray-700 mb-2">{userData.headline}</p>
          <p className="text-sm">{userData.summary}</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
            Work Experience
          </h3>
          {userData.positions.map((position, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">
                {position.title} at {position.company}
              </p>
              <p className="text-sm text-gray-600">
                {position.startDate} - {position.endDate}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
            Education
          </h3>
          {userData.educations.map((education, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">
                {education.degree} in {education.fieldOfStudy}
              </p>
              <p className="text-sm">{education.schoolName}</p>
              <p className="text-sm text-gray-600">
                {education.startDate} - {education.endDate}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {userData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <GitHubRepos githubId={githubId} />
    </div>
  );
}
