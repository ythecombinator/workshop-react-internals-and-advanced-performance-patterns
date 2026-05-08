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
  const trackerRef = useRef<UserBehaviorTracker | null>(null);

  useEffect(() => {
    const tracker = new UserBehaviorTracker({
      rageClick: { enabled: false },
      deadClick: { enabled: false },
      randomScrolling: {
        enabled: true,
        velocityThreshold: 150,
        directionChangeThreshold: 4,
        timeWindow: 2000,
      },
      erraticMouse: { enabled: false },
    });

    trackerRef.current = tracker;

    const unsubscribe = tracker.onBehaviorDetected((event) => {
      if (event.type === 'random-scrolling') {
        logger.info('[Scrolling] Detected', event.data);
        setEvents((prev) => [event, ...prev].slice(0, 10));
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
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <SandboxLayout
      title="Random Scrolling"
      description="Erratic scrolling behavior, characterized by rapid direction changes and high velocity."
      events={events}
      isTracking={isTracking}
      onToggleTracking={toggleTracking}
      onClearEvents={clearEvents}
    >
      <Sandbox
        title="Test Area"
        description="Scroll rapidly up and down in the area below, changing direction frequently to trigger random scrolling detection."
      >
        <div className="w-full h-100 bg-gray-50 overflow-y-scroll rounded-md border">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-3">Scroll Test Content</h3>
            {Array.from({ length: 20 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h4 className="font-medium mb-2">Section {sectionIndex + 1}</h4>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie
                  vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                  porttitor. Ut in nulla enim.
                </p>
                <div
                  className={`h-16 my-4 rounded ${sectionIndex % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}
                ></div>
                <p className="text-gray-600">
                  Donec congue lacinia dui, a porttitor lectus condimentum
                  laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus
                  vestibulum faucibus eget in metus. In pellentesque faucibus
                  vestibulum.
                </p>
              </div>
            ))}
          </div>
        </div>
      </Sandbox>
    </SandboxLayout>
  );
}
