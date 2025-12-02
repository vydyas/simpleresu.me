"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LinkedInCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Store the code in localStorage or state management
      localStorage.setItem("linkedinAuthCode", code);
      router.push("/linkedin-resume");
    }
  }, [router, searchParams]);

  return <div>Processing LinkedIn authentication...</div>;
}

export default function LinkedInCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LinkedInCallbackInner />
    </Suspense>
  );
}
