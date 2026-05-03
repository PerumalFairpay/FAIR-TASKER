"use client";

import { useEffect, useState } from "react";
import { Joyride, EventData, STATUS, Step } from "react-joyride";
import { useTheme } from "next-themes";

export const NavbarJoyride = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [{ run, steps }, setJoyrideState] = useState({
    run: false,
    steps: [
      {
        target: '.joyride-logo',
        content: 'Welcome to FairTasker! Click here to go to your dashboard anytime.',
        disableBeacon: true,
      },
      {
        target: '.joyride-nav-menu',
        content: 'Here you can access all modules and features based on your permissions.',
      },
      {
        target: '.joyride-profile',
        content: 'View your profile and account settings here.',
      },
      {
        target: '.joyride-sidebar-toggle',
        content: 'Click here to expand or collapse the sidebar for more details.',
      }
    ] as Step[],
  });

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const hasSeenTour = localStorage.getItem('hasSeenNavTour');
      // Only run tour automatically on desktop to ensure sidebar targets are visible
      if (!hasSeenTour && window.innerWidth >= 1024) {
        setTimeout(() => {
          setJoyrideState(prev => ({ ...prev, run: true }));
        }, 1000);
      }
    }
  }, []);

  const handleJoyrideEvent = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setJoyrideState(prev => ({ ...prev, run: false }));
      localStorage.setItem('hasSeenNavTour', 'true');
    }
  };

  if (!isMounted) return null;

  return (
    <Joyride
      onEvent={handleJoyrideEvent}
      continuous
      run={run}
      scrollToFirstStep
      steps={steps}
      options={{
        zIndex: 10000,
        primaryColor: '#006FEE',
        backgroundColor: resolvedTheme === 'dark' ? '#18181b' : '#ffffff',
        textColor: resolvedTheme === 'dark' ? '#f4f4f5' : '#18181b',
        showProgress: true,
        buttons: ['back', 'primary', 'skip'],
      }}
    />
  );
};
