"use client";

import { useEffect, useState } from 'react';

export function OnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(10);

  useEffect(() => {
    // Simulate user count changes
    const interval = setInterval(() => {
      setOnlineCount(Math.floor(Math.random() * (200 - 10 + 1) + 10));
    }, 60000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 ml-auto">
      <span className="text-xs text-gray-600">
        {onlineCount.toLocaleString()} users online
      </span>
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
} 