import { useState } from 'react';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  ANTI-PATTERN TO BE FIXED VIA ts-morph
//  ---------------------------------------------------------------------------
//
//  This file uses inline object type annotations in component parameters
//  instead of named interfaces. ts-morph can detect and extract them
//  automatically using the TypeScript compiler API.
//
//  Run the NPM script to apply the transform:
//    yarn codemod:ts-morph
//

//  ---------------------------------------------------------------------------
//  DATA
//  ---------------------------------------------------------------------------

const METRICS = [
  { id: 'fcp', label: 'FCP', value: 1.2, delta: -8 },
  { id: 'lcp', label: 'LCP', value: 2.4, delta: 12 },
  { id: 'cls', label: 'CLS', value: 0.05, delta: -3 },
  { id: 'inp', label: 'INP', value: 180, delta: 5 },
];

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

// Anti-pattern: inline prop types (ts-morph target)
function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: 'good' | 'needs-improvement' | 'poor';
}) {
  const classes = {
    good: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'needs-improvement':
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${classes[variant]}`}
    >
      {label}
    </span>
  );
}

// Anti-pattern: inline prop types (ts-morph target)
function MetricCard({
  label,
  value,
  unit,
  delta,
}: {
  label: string;
  value: number;
  unit: string;
  delta: number;
}) {
  const rating =
    delta <= -5 ? 'good' : delta >= 5 ? 'poor' : 'needs-improvement';

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <Typography.subtle>{label}</Typography.subtle>
        <div className="flex items-center gap-2">
          <Typography.h3 className="mt-0">
            {value}
            {unit}
          </Typography.h3>
          <StatusBadge label={rating} variant={rating} />
        </div>
      </div>
      <div
        className={`text-sm font-mono ${delta <= 0 ? 'text-green-600' : 'text-red-600'}`}
      >
        {delta >= 0 ? '+' : ''}
        {delta}%
      </div>
    </div>
  );
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ts-morph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Typography.p>
            <code className="bg-muted px-1 rounded">ts-morph</code> wraps the
            TypeScript compiler API, giving you type-aware AST navigation and
            manipulation. Unlike jscodeshift (which works at the syntax level),
            ts-morph can resolve types, follow imports, and understand the full
            type system.
          </Typography.p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setRefreshCount((prev) => prev + 1)}
            >
              Re-render ({refreshCount})
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METRICS.map((metric) => (
              <MetricCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                unit={
                  metric.id === 'cls' ? '' : metric.id === 'inp' ? 'ms' : 's'
                }
                delta={metric.delta}
              />
            ))}
          </div>

          <div className="p-4 bg-muted/50 rounded-md">
            <Typography.h3 className="mt-0 mb-2">
              Anti-pattern in this file
            </Typography.h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                <code className="bg-muted px-1 rounded">
                  {'{ label: string; variant: ... }'}
                </code>{' '}
                inline prop types instead of named interfaces
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
