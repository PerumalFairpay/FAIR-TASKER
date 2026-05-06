"use client";

import { useEffect, useState } from "react";
import { Joyride, EventData, STATUS, Step } from "react-joyride";
import { useTheme } from "next-themes";

export const ProfileJoyride = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [{ run, steps }, setJoyrideState] = useState({
    run: false,
    steps: [
      {
        target: '.joyride-security-tab',
        content: 'To change your password, first click on the Security tab.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '.joyride-current-password',
        content: 'Enter your current password here to verify your identity.',
      },
      {
        target: '.joyride-new-password',
        content: 'Enter your strong new password here.',
      },
      {
        target: '.joyride-confirm-password',
        content: 'Re-type your new password to ensure it matches.',
      },
      {
        target: '.joyride-update-password-btn',
        content: 'Click here to securely update your password.',
      }
    ] as Step[],
  });

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const hasSeenTour = localStorage.getItem('hasSeenProfileTour');
      if (!hasSeenTour) {
        setTimeout(() => {
          setJoyrideState(prev => ({ ...prev, run: true }));
        }, 1000);
      }
    }
  }, []);

  const handleJoyrideEvent = (data: EventData) => {
    const { status, type, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Automatically switch to the Security tab when advancing from the first step
    if (type === 'step:after' && index === 0) {
      const tabElement = document.querySelector('.joyride-security-tab')?.closest('button');
      if (tabElement) {
        tabElement.click();
      }
    }

    if (finishedStatuses.includes(status)) {
      setJoyrideState(prev => ({ ...prev, run: false }));
      localStorage.setItem('hasSeenProfileTour', 'true');
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
