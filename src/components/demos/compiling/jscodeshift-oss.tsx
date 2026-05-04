import React, { forwardRef, useContext, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  PATTERNS TO BE MODERNIZED VIA OSS CODEMODS
//  ---------------------------------------------------------------------------
//
//  This file deliberately uses legacy React patterns so we can demo
//  automated modernization using OSS react-codemods:
//
//    1. `npx codemod react/19/remove-forward-ref`  → removes forwardRef wrapper
//    2. `npx codemod react/19/use-context-hook`    → useContext → use
//    3. `npx codemod react/19/remove-context-provider` → Context.Provider → Context
//    4. `npx codemod react/create-element-to-jsx`  → createElement → JSX
//
//  Run the NPM scripts to see each transform in action:
//    yarn codemod:jscodeshift-oss:remove-forward-ref
//    yarn codemod:jscodeshift-oss:use-context-hook
//

//  ---------------------------------------------------------------------------
//  CONTEXT (legacy: Context.Provider pattern)
//  ---------------------------------------------------------------------------

const ThemeContext = React.createContext<'light' | 'dark'>('light');

//  ---------------------------------------------------------------------------
//  UI: forwardRef pattern (legacy)
//  ---------------------------------------------------------------------------

const FancyInput = forwardRef<HTMLInputElement, { label: string }>(
  function FancyInput({ label }, ref) {
    // Legacy: useContext instead of use()
    // See https://react.dev/blog/2024/12/05/react-19#new-feature-use
    // Why `use()` over `useContext()`?
    //  - use() can be called conditionally (after early returns, inside if-blocks)
    //  - use() also reads promises, suspending until resolved.
    const theme = useContext(ThemeContext);

    return (
      <div
        className={`p-3 rounded-md border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          ref={ref}
          type="text"
          className="w-full px-3 py-1.5 border rounded-md text-sm bg-transparent"
          placeholder={`Type here (${theme} theme)...`}
        />
      </div>
    );
  }
);

//  ---------------------------------------------------------------------------
//  UI: createElement pattern (legacy)
//  ---------------------------------------------------------------------------

function LegacyBadge({ text }: { text: string }) {
  return React.createElement(
    'span',
    {
      className:
        'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
    },
    text
  );
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <Card>
      <CardHeader>
        <CardTitle>OSS Codemods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Typography.p>
            This component is intentionally written with legacy React patterns.
            Run the OSS codemods to modernize it automatically.
          </Typography.p>

          {/* legacy: Context.Provider instead of just Context */}
          <ThemeContext.Provider value={theme}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
                  }
                  className="px-3 py-1.5 text-sm border rounded-md hover:bg-accent transition-colors"
                >
                  Toggle theme
                </button>
                <LegacyBadge text={`Current: ${theme}`} />
              </div>

              <FancyInput label="forwardRef + useContext input" />
            </div>
          </ThemeContext.Provider>

          <div className="p-4 bg-muted/50 rounded-md">
            <Typography.h3 className="mt-0 mb-2">Notes</Typography.h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                <code className="bg-muted px-1 rounded">forwardRef</code>,
                removable with{' '}
                <code className="bg-muted px-1 rounded">
                  react/19/remove-forward-ref
                </code>
              </li>
              <li>
                <code className="bg-muted px-1 rounded">useContext</code>,
                replaceable with{' '}
                <code className="bg-muted px-1 rounded">
                  react/19/use-context-hook
                </code>
              </li>
              <li>
                <code className="bg-muted px-1 rounded">Context.Provider</code>,{' '}
                simplifiable with{' '}
                <code className="bg-muted px-1 rounded">
                  react/19/remove-context-provider
                </code>
              </li>
              <li>
                <code className="bg-muted px-1 rounded">
                  React.createElement
                </code>
                , convertible with{' '}
                <code className="bg-muted px-1 rounded">
                  react/create-element-to-jsx
                </code>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
