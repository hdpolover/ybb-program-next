'use client';

import { useEffect, useState } from 'react';

export default function GreetingWithClock({ name }: { name: string }) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time only on client side
    setCurrentTime(new Date());
    setMounted(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    if (!currentTime) return 'Hello';
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:-- --';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Loading...';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Don't render anything on the server
  if (!mounted) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#e53b8c] animate-pulse">
            Loading...
          </h1>
          <span className="ml-auto rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-400">
            --:--:-- --
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-300 animate-pulse">Loading date...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-extrabold text-[#e53b8c]">
          {getGreeting()}, {name.toUpperCase()}!
        </h1>
        <span className="ml-auto rounded-full bg-[#e53b8c] px-3 py-1 text-sm font-medium text-white">
          {formatTime(currentTime)}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{formatDate(currentTime)}</p>
    </div>
  );
}
