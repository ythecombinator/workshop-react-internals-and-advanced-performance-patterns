import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  HOOKS
//  ---------------------------------------------------------------------------

function useReactGrab() {
  useEffect(() => {
    import('react-grab');
  }, []);
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  useReactGrab();

  return (
    <Card>
      <CardHeader>
        <CardTitle>React Grab</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Typography.p>
            React Grab lets you select context for coding agents directly from
            your website. Hover over any UI element and press{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">⌘C</kbd> (Mac)
            or{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">Ctrl+C</kbd>{' '}
            (Windows/Linux) to copy the element's context.
          </Typography.p>

          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Typography.h3 className="mt-0">
                Try it — hover over any element on this page
              </Typography.h3>
              <Typography.subtle>
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">⌘C</kbd> to
                copy its file name, React component, and HTML source code
              </Typography.subtle>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TargetCard
              title="Button Component"
              description="Copy this to tell your coding agent exactly which component to modify"
            />
            <TargetCard
              title="Card Layout"
              description="React Grab resolves the source file and line number automatically"
            />
            <TargetCard
              title="Nested Element"
              description="Works with any depth of React component tree"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <Typography.h3 className="mt-0 mb-2">What gets copied</Typography.h3>
            <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto">
{`<div class="p-4 border rounded-md ...">
  <p class="text-sm font-medium">Button Component</p>
</div>
in TargetCard at components/demos/measuring/react-grab.tsx:80:5`}
            </pre>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <Typography.h3 className="mt-0 mb-2">Key takeaways</Typography.h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Bridges the gap between visual UI and agentic code editing</li>
              <li>Uses React Fiber tree to resolve component names and source locations</li>
              <li>Coding agents (Cursor, Claude Code, Copilot) run up to 3× faster with precise context</li>
              <li>Supports plugins for custom context-menu actions and MCP integration</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

function TargetCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 border rounded-md bg-white hover:shadow-md transition-shadow cursor-pointer">
      <Typography.small>{title}</Typography.small>
      <Typography.subtle className="mt-1">{description}</Typography.subtle>
    </div>
  );
}
