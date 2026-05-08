import { useEffect, useRef, useState } from 'react';

import logger from '@utils/logger';
import { BehaviorEvent, UserBehaviorTracker } from '@utils/user-behavior';

import SandboxLayout from '@components/layouts/layout-sandbox';

import Sandbox from '@components/elements/sandbox';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [mouseTrail, setMouseTrail] = useState<TrailPoint[]>([]);
  const trackerRef = useRef<UserBehaviorTracker | null>(null);
  const testAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tracker = new UserBehaviorTracker({
      rageClick: { enabled: false },
      deadClick: { enabled: false },
      randomScrolling: { enabled: false },
      erraticMouse: {
        enabled: true,
        velocityThreshold: 1200,
        angleThreshold: 50,
        minDistance: 10,
        timeWindow: 1500,
      },
    });

    trackerRef.current = tracker;

    const unsubscribe = tracker.onBehaviorDetected((event) => {
      if (event.type === 'erratic-mouse') {
        logger.info('[ErraticMouse] Detected', event.data);
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

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!testAreaRef.current || !isTracking) {
      return;
    }

    const rect = testAreaRef.current.getBoundingClientRect();
    const point: TrailPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      timestamp: Date.now(),
    };

    setMouseTrail((prev) => {
      const now = Date.now();
      return [...prev, point]
        .filter((p) => now - p.timestamp < 1500)
        .slice(-30);
    });
  };

  const toggleTracking = () => {
    setIsTracking((prev) => !prev);
    setMouseTrail([]);
  };

  const clearEvents = () => {
    setEvents([]);
    setMouseTrail([]);
  };

  const getPointColor = (index: number, total: number) => {
    const opacity = 0.3 + (index / total) * 0.7;
    const lastEvent = events[0];

    if (!lastEvent) {
      return `rgba(128, 128, 128, ${opacity})`;
    }

    if (lastEvent.subtype === 'combined') {
      return `rgba(255, 0, 255, ${opacity})`;
    }

    if (lastEvent.subtype === 'high-velocity') {
      return `rgba(255, 0, 0, ${opacity})`;
    }

    if (lastEvent.subtype === 'direction-changes') {
      return `rgba(0, 128, 255, ${opacity})`;
    }

    return `rgba(128, 128, 128, ${opacity})`;
  };

  return (
    <SandboxLayout
      title="Thrashed Cursor / Wild Mouse"
      description="Erratic mouse movements, which can indicate user frustration or confusion."
      events={events}
      isTracking={isTracking}
      onToggleTracking={toggleTracking}
      onClearEvents={clearEvents}
    >
      <Sandbox
        title="Test Area"
        description="Try these mouse movements to trigger detection:"
      >
        <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
          <li>
            <span className="font-medium">High Velocity:</span> Move your mouse
            very quickly back and forth
          </li>
          <li>
            <span className="font-medium">Direction Changes:</span> Move your
            mouse in zigzag or erratic patterns
          </li>
          <li>
            <span className="font-medium">Combined:</span> Move quickly while
            changing direction frequently
          </li>
        </ul>

        <div
          ref={testAreaRef}
          onMouseMove={handleMouseMove}
          className="w-full h-75 bg-linear-to-br from-blue-50 to-purple-50 rounded-md border relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center text-purple-400 pointer-events-none">
            Move mouse here to test
          </div>

          {isTracking &&
            mouseTrail.map((point, trailIndex) => (
              <div
                key={trailIndex}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                  left: `${point.x - 1.5}px`,
                  top: `${point.y - 1.5}px`,
                  backgroundColor: getPointColor(trailIndex, mouseTrail.length),
                  transform: `scale(${0.5 + (trailIndex / mouseTrail.length) * 0.5})`,
                  transition: 'transform 100ms ease-out',
                }}
              />
            ))}
        </div>
      </Sandbox>
    </SandboxLayout>
  );
}
