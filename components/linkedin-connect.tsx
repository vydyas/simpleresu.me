"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LinkedinIcon as LinkedIn } from "lucide-react";

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/linkedin-callback`;

export function LinkedInConnect() {
  const [hasExistingData, setHasExistingData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("linkedinUserData");
    setHasExistingData(!!storedData);
  }, []);

  const handleConnect = () => {
    if (hasExistingData) {
      router.push("/linkedin-resume");
    } else {
      const scopes = ["email", "openai", "social"].join("%20");
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}`;
      window.location.href = authUrl;
    }
  };

  return (
    <Button onClick={handleConnect} className="w-full" variant="outline">
      <LinkedIn className="mr-2 h-4 w-4" />
      <span>
        {hasExistingData ? "Update LinkedIn Data" : "Import data from LinkedIn"}
      </span>
    </Button>
  );
}
