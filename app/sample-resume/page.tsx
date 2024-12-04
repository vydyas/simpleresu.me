import { Resume } from "@/components/resume";

const sampleData = {
  firstName: "Siddhu",
  lastName: "Vydyabhushana",
  email: "jane.doe@example.com",
  headline: "Senior Full Stack Developer | React | Node.js | AWS",
  summary:
    "Experienced full stack developer with 8+ years of expertise in building scalable web applications. Passionate about creating efficient, user-friendly solutions and mentoring junior developers.",
  positions: [
    {
      title: "Senior Software Engineer",
      company: "Salesforce",
      startDate: "Apr 2021",
      endDate: "Present",
      description:
        "Lead developer for a team of 5, responsible for architecting and implementing high-performance web applications using React, Node.js, and AWS. Improved system efficiency by 40% through optimized database queries and caching strategies.",
    },
    {
      title: "Senior Software Engineer",
      company: "Salesforce",
      startDate: "Apr 2021",
      endDate: "Present",
      description:
        "Lead developer for a team of 5, responsible for architecting and implementing high-performance web applications using React, Node.js, and AWS. Improved system efficiency by 40% through optimized database queries and caching strategies.",
    },
    {
      title: "Senior Software Engineer",
      company: "Salesforce",
      startDate: "Apr 2021",
      endDate: "Present",
      description:
        "Lead developer for a team of 5, responsible for architecting and implementing high-performance web applications using React, Node.js, and AWS. Improved system efficiency by 40% through optimized database queries and caching strategies.",
    },
    {
      title: "Senior Software Engineer",
      company: "Salesforce",
      startDate: "Apr 2021",
      endDate: "Present",
      description:
        "Lead developer for a team of 5, responsible for architecting and implementing high-performance web applications using React, Node.js, and AWS. Improved system efficiency by 40% through optimized database queries and caching strategies.",
    },
  ],
  educations: [
    {
      schoolName: "University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "Sep 2012",
      endDate: "Jun 2016",
    },
  ],
  skills: [
    { name: "React" },
    { name: "Node.js" },
    { name: "TypeScript" },
    { name: "AWS" },
    { name: "Docker" },
    { name: "GraphQL" },
    { name: "MongoDB" },
    { name: "PostgreSQL" },
    { name: "Git" },
    { name: "CI/CD" },
  ],
};

export default function SampleResumePage() {
  return (
    <div className="container mx-auto py-10">
      <Resume 
        userData={sampleData} 
        githubId="vydyas" 
        template="default"
        config={{
          showPhoto: true,
          showSummary: true,
          showExperience: true,
          showEducation: true,
          showSkills: true,
          showProjects: false,
          showRepositories: false,
          showAwards: false,
          showLanguages: false,
          showVolunteer: false
        }}
      />
    </div>
  );
}
