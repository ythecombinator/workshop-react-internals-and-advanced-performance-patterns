import { useEffect, useRef, useState } from 'react';

import logger from '@utils/logger';
import { BehaviorEvent, UserBehaviorTracker } from '@utils/user-behavior';

import SandboxLayout from '@components/layouts/layout-sandbox';

import Sandbox from '@components/elements/sandbox';

import { Button } from '@components/ui/button';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [lastClickedElement, setLastClickedElement] = useState<string | null>(
    null
  );
  const trackerRef = useRef<UserBehaviorTracker | null>(null);

  useEffect(() => {
    const tracker = new UserBehaviorTracker({
      rageClick: { enabled: false },
      deadClick: { enabled: true },
      randomScrolling: { enabled: false },
      erraticMouse: { enabled: false },
    });

    trackerRef.current = tracker;

    const unsubscribe = tracker.onBehaviorDetected((event) => {
      if (event.type === 'dead-click') {
        logger.info('[DeadClicks] Detected', event.data);
        setEvents((prev) => [event, ...prev].slice(0, 10));
        setLastClickedElement(event.data.element as string);
      }
    });

    return () => {
      tracker.stopTracking();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!trackerRef.current) {
      return;
    }

    if (isTracking) {
      trackerRef.current.startTracking();
    } else {
      trackerRef.current.stopTracking();
    }
  }, [isTracking]);

  const toggleTracking = () => {
    setIsTracking((prev) => !prev);
    setLastClickedElement(null);
  };

  const clearEvents = () => {
    setEvents([]);
    setLastClickedElement(null);
  };

  return (
    <SandboxLayout
      title="Dead Clicks"
      description="Clicks on non-interactive elements, which often indicate confusion or misunderstanding of the interface."
      events={events}
      isTracking={isTracking}
      onToggleTracking={toggleTracking}
      onClearEvents={clearEvents}
    >
      <Sandbox
        title="Test Area"
        description="Click on non-interactive elements (like text or gray areas) to trigger dead click detection."
      >
        <div className="w-full bg-linear-to-r from-orange-50 to-yellow-50 rounded-md p-4">
          <div className="text-center mb-6 text-gray-500">
            This entire area contains both interactive and non-interactive
            elements
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-24 bg-gray-100 flex items-center justify-center rounded-md">
              <span className="text-gray-500">Non-interactive area</span>
            </div>
            <div className="h-24 bg-gray-100 flex items-center justify-center rounded-md">
              <span className="text-gray-500">Non-interactive area</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">This text is not interactive</p>
            <Button>Interactive Button</Button>
          </div>

          <div className="mt-6 p-3 border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-600 mb-2">
              This paragraph is not interactive.
            </p>
            <a href="#" className="text-blue-500 hover:underline">
              This link is interactive
            </a>
          </div>
        </div>

        {lastClickedElement && isTracking && (
          <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              <strong>Dead click detected on:</strong> {lastClickedElement}
            </p>
          </div>
        )}
      </Sandbox>
    </SandboxLayout>
  );
}
