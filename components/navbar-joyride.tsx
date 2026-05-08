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
        content: 'Welcome to FairPAY Tech Works! This is your main navigation hub.',
        disableBeacon: true,
      },
      {
        target: '.joyride-attendance',
        content: 'Track your work hours and mark your attendance daily here.',
      },
      {
        target: '.joyride-task-management',
        content: 'Stay on top of your work! Access your task board and submit EOD reports.',
      },
      {
        target: '.joyride-fyro',
        content: 'Meet Fyro, our AI assistant! Ask questions or get help with your work.',
      },
      {
        target: '.joyride-feedback',
        content: 'Have suggestions? Share your feedback with the team here.',
      },
      {
        target: '.joyride-theme-toggle',
        content: 'Switch between Light and Dark mode for a more comfortable view.',
      },
      {
        target: '.joyride-profile',
        content: 'Manage your personal details and update your password here.',
      },
      {
        target: '.joyride-sidebar-toggle',
        content: 'Expand or collapse the sidebar to maximize your workspace.',
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
        primaryColor: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: resolvedTheme === 'dark' ? '#1c1c1e' : '#ffffff',
        textColor: resolvedTheme === 'dark' ? '#f4f4f5' : '#18181b',
        arrowColor: resolvedTheme === 'dark' ? '#1c1c1e' : '#ffffff',
        overlayColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)',
        showProgress: true,
        buttons: ['back', 'primary', 'skip'],
      }}
    />
  );
};
