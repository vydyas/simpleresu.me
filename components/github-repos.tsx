"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import FancyHeading from "./fancy-heading";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
}

interface GitHubReposProps {
  githubId: string;
  limit?: number;
}

export function OpenSourceContributions({ githubId = 'vydyas', limit = 2 }: GitHubReposProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<GitHubRepo[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!githubId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`https://api.github.com/users/${githubId}/repos?sort=stars&per_page=100`);

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const data: GitHubRepo[] = await response.json();

        // Filter out forked repositories and sort by stars
        const nonForkedRepos = data
          .filter(repo => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, limit);

        setRepos(nonForkedRepos);
        setSelectedRepos(nonForkedRepos.slice(0, 2));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [githubId, limit]);

  const handleRepoSelection = (repo: GitHubRepo) => {
    setSelectedRepos((prev) => {
      if (prev.find((r) => r.name === repo.name)) {
        return prev.filter((r) => r.name !== repo.name);
      } else {
        return [...prev, repo];
      }
    });
  };

  if (isLoading) {
    return <div>Loading repositories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (repos.length === 0) {
    return <div>No repositories found</div>;
  }

  return (
    <Card className="w-full pb-4">
      <div className="flex flex-row items-center justify-between pb-4">
        <FancyHeading>
          Open Source Contribution
        </FancyHeading>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Select Repositories</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Repositories to Display</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {repos.map((repo) => (
                <div key={repo.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={repo.name}
                    checked={selectedRepos.some((r) => r.name === repo.name)}
                    onCheckedChange={() => handleRepoSelection(repo)}
                  />
                  <label
                    htmlFor={repo.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {repo.name}
                  </label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent>
        <div className="space-y-4">
          {selectedRepos.map((repo) => (
            <div
              key={repo.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-start space-x-4"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                  >
                    {repo.name}
                  </a>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">
                      ⭐ {repo.stargazers_count}
                    </Badge>
                    {repo.language && (
                      <Badge variant="outline">
                        {repo.language}
                      </Badge>
                    )}
                  </div>
                </div>
                {repo.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {repo.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Forks: {repo.forks_count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { OpenSourceContributions as GitHubRepos };
