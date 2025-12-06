import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GitHubRepos } from "../github-repos";
import Image from "next/image";

interface GitHubProfileResumeProps {
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

export default function GitHubProfileResume({
  userData,
  githubId,
}: GitHubProfileResumeProps) {
  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-100">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Image
              src={`https://github.com/${githubId}.png`}
              alt={`${userData.firstName} ${userData.lastName}`}
              className="w-24 h-24 rounded-full mr-4"
              width={80}
              height={80}
            />
            <div>
              <h1 className="text-2xl font-bold">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-gray-600">{userData.headline}</p>
            </div>
          </div>
          <p className="mb-4">{userData.summary}</p>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <span>{userData.email}</span>
            <a
              href={`https://github.com/${githubId}`}
              className="text-blue-600 hover:underline"
            >
              github.com/{githubId}
            </a>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
          {userData.positions.map((position, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">
                {position.title} at {position.company}
              </h3>
              <p className="text-sm text-gray-600">
                {position.startDate} - {position.endDate}
              </p>
              <p className="mt-2">{position.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          {userData.educations.map((education, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">
                {education.degree} in {education.fieldOfStudy}
              </h3>
              <p className="text-sm text-gray-600">{education.schoolName}</p>
              <p className="text-sm text-gray-600">
                {education.startDate} - {education.endDate}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {userData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      <GitHubRepos githubId={githubId} />
    </div>
  );
}
