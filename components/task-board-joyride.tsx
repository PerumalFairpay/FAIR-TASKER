"use client";

import { useEffect, useState } from "react";
import { Joyride, EventData, STATUS, Step } from "react-joyride";
import { useTheme } from "next-themes";

export const TaskBoardJoyride = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [{ run, steps }, setJoyrideState] = useState({
    run: false,
    steps: [
      {
        target: '.joyride-task-date-picker',
        content: 'Use the date picker to navigate between different days and view scheduled tasks.',
        disableBeacon: true,
      },
      {
        target: '.joyride-task-actions',
        content: 'Quickly access task reports, calendar view, or review the task management rules.',
      },
      {
        target: '.joyride-create-task-btn',
        content: 'Ready to start something new? Click here to create a new task.',
      },
      {
        target: '.joyride-column-overdue',
        content: 'Overdue: Tasks that have passed their deadline appear here automatically.',
      },
      {
        target: '.joyride-column-todo',
        content: 'To Do: This is your backlog for the day. Pick tasks from here to start working.',
      },
      {
        target: '.joyride-column-in-progress',
        content: 'In Progress: Drag tasks here when you start working on them.',
      },
      {
        target: '.joyride-column-completed',
        content: 'Completed: Once a task is done, drop it here. You will be prompted to enter an EOD summary.',
      },
      {
        target: '.joyride-column-moved',
        content: 'Moved: Tasks that are carried over to the next day appear here.',
      }
    ] as Step[],
  });

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const hasSeenTour = localStorage.getItem('hasSeenTaskBoardTour');
      if (!hasSeenTour) {
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
      localStorage.setItem('hasSeenTaskBoardTour', 'true');
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
