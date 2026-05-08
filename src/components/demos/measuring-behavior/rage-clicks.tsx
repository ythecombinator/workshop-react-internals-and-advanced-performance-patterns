import { useEffect, useRef, useState } from 'react';

import logger from '@utils/logger';
import { BehaviorEvent, UserBehaviorTracker } from '@utils/user-behavior';

import SandboxLayout from '@components/layouts/layout-sandbox';

import Sandbox from '@components/elements/sandbox';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const trackerRef = useRef<UserBehaviorTracker | null>(null);

  useEffect(() => {
    const tracker = new UserBehaviorTracker({
      rageClick: {
        enabled: true,
        threshold: 3,
        timeWindow: 800,
        radius: 30,
      },
      deadClick: { enabled: false },
      randomScrolling: { enabled: false },
      erraticMouse: { enabled: false },
    });

    trackerRef.current = tracker;

    const unsubscribe = tracker.onBehaviorDetected((event) => {
      if (event.type === 'rage-click') {
        logger.info('[RageClicks] Detected', event.data);
        setEvents((prev) => [event, ...prev].slice(0, 10));
        setClickCount(0);
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
    setClickCount(0);
  };

  const clearEvents = () => {
    setEvents([]);
    setClickCount(0);
  };

  const handleTestAreaClick = () => {
    if (!isTracking) {
      return;
    }

    setClickCount((prev) => prev + 1);
  };

  return (
    <SandboxLayout
      title="Rage Clicks"
      description="Multiple rapid clicks in the same area, which often indicate user frustration."
      events={events}
      isTracking={isTracking}
      onToggleTracking={toggleTracking}
      onClearEvents={clearEvents}
    >
      <Sandbox
        title="Test Area"
        description="Click rapidly multiple times in the same area below to trigger rage click detection."
      >
        <div
          className="w-full h-64 bg-linear-to-r from-red-50 to-orange-50 flex flex-col items-center justify-center rounded-md cursor-pointer relative"
          onClick={handleTestAreaClick}
        >
          <div className="text-lg font-medium text-red-500 mb-2">
            Click rapidly here
          </div>
          <div className="text-sm text-gray-500">
            Try clicking 3+ times quickly in the same area
          </div>

          {isTracking && clickCount > 0 && (
            <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full border border-red-200">
              <span className="text-red-600 font-bold">{clickCount}</span>
            </div>
          )}

          {events.length > 0 && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-red-600 font-medium">
              Rage click detected!
            </div>
          )}
        </div>
      </Sandbox>
    </SandboxLayout>
  );
}
