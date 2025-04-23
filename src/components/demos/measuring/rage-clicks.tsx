import { useEffect, useRef, useState } from 'react';

import { RageClickTracker, trackRageClicks } from '@utils/dxa';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [message, setMessage] = useState<string>(
    'Click the target area rapidly to trigger rage detection'
  );
  const [clickCount, setClickCount] = useState<number>(0);
  const targetRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<RageClickTracker | null>(null);

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    trackerRef.current = trackRageClicks(targetRef.current, {
      threshold: 4,
      timeWindow: 800,
      onRageClick: (_event, count, _positions) => {
        setMessage(`Rage clicking detected! ${count} clicks.`);
        setClickCount(count);
      },
    });

    return () => {
      trackerRef.current?.cleanup();
    };
  }, []);

  const resetDemo = () => {
    if (trackerRef.current) {
      trackerRef.current.reset();
      setClickCount(0);
      setMessage('Click the target area rapidly to trigger rage detection');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detecting Rage Clicks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div
            ref={targetRef}
            className="p-8 border-2 border-dashed rounded-md bg-gray-50 text-center cursor-pointer transition-colors hover:bg-gray-100"
          >
            <p className="font-medium">Click here rapidly</p>
            <p className="text-sm text-gray-500 mt-1">
              {4 - Math.min(clickCount, 4)} more clicks needed
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800">{message}</p>
          </div>

          <Button onClick={resetDemo} variant="outline" className="w-full">
            Reset Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
