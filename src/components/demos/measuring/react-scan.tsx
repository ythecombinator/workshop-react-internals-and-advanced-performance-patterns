import { memo, useCallback, useEffect, useState } from 'react';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  HOOKS
//  ---------------------------------------------------------------------------

function useReactScan() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//unpkg.com/react-scan/dist/auto.global.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [count, setCount] = useState(0);

  useReactScan();

  // Unstable: new reference on every render
  const unstableOnClick = () => setCount((c) => c + 1);
  const unstableStyle = { color: 'purple' };

  // Stable: memoized reference
  const stableOnClick = useCallback(() => setCount((c) => c + 1), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>React Scan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Typography.p>
            React Scan automatically detects performance issues by highlighting
            components that re-render unnecessarily. It loads dynamically on
            this page via a script tag. Look for the floating toolbar in the
            bottom-right corner.
          </Typography.p>

          <div className="space-y-2 flex items-center gap-2">
            <Typography.small>
              Parent render count: <span className="font-bold">{count}</span>
            </Typography.small>
            <Button onClick={() => setCount((c) => c + 1)} variant="outline">
              Trigger parent re-render
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Typography.small className="text-red-600">
                Unstable props (will flash)
              </Typography.small>
              <ExpensiveChild onClick={unstableOnClick} style={unstableStyle} />
            </div>
            <div className="space-y-2">
              <Typography.small className="text-green-600">
                Stable props (won't flash)
              </Typography.small>
              <OptimizedChild onClick={stableOnClick} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

function ExpensiveChild({
  onClick,
  style,
}: {
  onClick: () => void;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="p-4 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
      style={style}
    >
      <Typography.small>
        I re-render on every parent state change
      </Typography.small>
      <Typography.subtle className="mt-1">
        React Scan highlights me when I render unnecessarily
      </Typography.subtle>
    </div>
  );
}

const OptimizedChild = memo(function OptimizedChild({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div
      className="p-4 border rounded-md bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
      onClick={onClick}
    >
      <Typography.small>I only re-render when my props change</Typography.small>
      <Typography.subtle className="mt-1">
        React Scan won't flag me because my props are stable
      </Typography.subtle>
    </div>
  );
});
