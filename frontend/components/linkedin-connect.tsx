"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

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
    <Button
      onClick={handleConnect}
      className="w-full bg-[#0077B5] hover:bg-[#006699] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:ring-opacity-50"
    >
      <Linkedin className="w-5 h-5 mr-2" />
      {hasExistingData ? "Update LinkedIn Data" : "Import data from LinkedIn"}
    </Button>
  );
}
