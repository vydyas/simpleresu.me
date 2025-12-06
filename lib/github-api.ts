export interface GitHubUserData {
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  avatar_url: string;
  html_url: string;
}

export async function fetchGitHubUserData(username: string): Promise<GitHubUserData | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error('GitHub user not found');
    }
    const data = await response.json();
    return {
      name: data.name,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return null;
  }
}
