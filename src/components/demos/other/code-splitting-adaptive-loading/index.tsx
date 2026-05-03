import { lazy, Suspense, useState } from 'react';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import Typography from '@components/ui/typography';

import { getConnectionInfo, isFastConnection } from './utils';

//  ---------------------------------------------------------------------------
//  ADAPTIVE LOADING: Network-aware code splitting
//  ---------------------------------------------------------------------------

//  Uses navigator.connection (Network Information API) to decide
//  whether to load a full YouTube iframe embed or a lightweight
//  thumbnail image. On fast connections we ship the heavy component;
//  on slow connections we ship just an image with a play link.

//  This keeps the initial bundle small for everyone: both variants
//  are lazy-loaded, so neither is included in the main chunk.

//  ---------------------------------------------------------------------------
//  LAZY COMPONENTS
//  ---------------------------------------------------------------------------

const YouTubeEmbed = lazy(() => import('./youtube-embed'));
const YouTubeThumbnail = lazy(() => import('./youtube-thumbnail'));

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const connection = getConnectionInfo();
  const [fast, setFast] = useState(isFastConnection);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Splitting + Adaptive Loading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Typography.p>
            Uses the{' '}
            <code className="bg-muted px-1 rounded">Network Information API</code>{' '}
            to decide at runtime which component to lazy-load: a full YouTube
            iframe embed on fast connections, or a lightweight thumbnail on
            slow ones.
          </Typography.p>

          <div className="p-4 bg-muted/50 rounded-md space-y-2">
            <Typography.h3 className="mt-0 mb-2">
              Current connection
            </Typography.h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                <span className="text-muted-foreground">effectiveType: </span>
                <code className="bg-muted px-1 rounded">
                  {connection?.effectiveType ?? 'unknown'}
                </code>
              </span>
              <span>
                <span className="text-muted-foreground">downlink: </span>
                <code className="bg-muted px-1 rounded">
                  {connection?.downlink !== undefined ? `${connection.downlink} Mbps` : 'unknown'}
                </code>
              </span>
              <span>
                <span className="text-muted-foreground">rtt: </span>
                <code className="bg-muted px-1 rounded">
                  {connection?.rtt !== undefined ? `${connection.rtt} ms` : 'unknown'}
                </code>
              </span>
              <span>
                <span className="text-muted-foreground">saveData: </span>
                <code className="bg-muted px-1 rounded">
                  {connection?.saveData?.toString() ?? 'unknown'}
                </code>
              </span>
              <span>
                <span className="text-muted-foreground">resolved: </span>
                <code className="bg-muted px-1 rounded">
                  {fast ? 'fast' : 'slow'}
                </code>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant={fast ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFast(true)}
            >
              Simulate fast
            </Button>
            <Button
              variant={!fast ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFast(false)}
            >
              Simulate slow
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center p-12 aspect-video border rounded-lg">
                <div className="animate-pulse text-muted-foreground">
                  Loading...
                </div>
              </div>
            }
          >
            {fast ? <YouTubeEmbed /> : <YouTubeThumbnail />}
          </Suspense>

          <div className="p-4 bg-muted/50 rounded-md">
            <Typography.h3 className="mt-0 mb-2">
              How it works
            </Typography.h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                Both components are <code className="bg-muted px-1 rounded">lazy()</code> imports,
                so neither is in the main bundle
              </li>
              <li>
                <code className="bg-muted px-1 rounded">navigator.connection.effectiveType</code>{' '}
                determines which one to load
              </li>
              <li>
                On slow / save-data connections, users get a ~3 KB thumbnail
                instead of a ~1.3 MB iframe + player
              </li>
              <li>
                The toggle buttons let you simulate both paths without
                throttling in DevTools
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
