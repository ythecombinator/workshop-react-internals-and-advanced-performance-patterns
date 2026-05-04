import Typography from '@components/ui/typography';

import { formatOps } from './bench';
import type { BenchmarkResult } from './types';

export default function ResultRow({ result }: { result: BenchmarkResult }) {
  const speedup = result.soaOpsPerSec / result.aosOpsPerSec;
  const soaFaster = speedup > 1;

  return (
    <div className="grid grid-cols-5 gap-4 items-center py-2 border-b last:border-b-0">
      <div>
        <Typography.small className="font-medium">
          {result.label}
        </Typography.small>
        <div className="text-xs text-muted-foreground">{result.detail}</div>
      </div>
      <div className="text-right font-mono text-sm">
        {formatOps(result.aosOpsPerSec)} ops/s
      </div>
      <div className="text-right font-mono text-sm">
        {formatOps(result.soaOpsPerSec)} ops/s
      </div>
      <div
        className={`text-right font-mono text-sm font-bold ${soaFaster ? 'text-green-600' : 'text-red-600'}`}
      >
        {speedup.toFixed(1)}x
      </div>
      <div className="text-right">
        <div
          className="h-2 rounded-full bg-green-500/80 ml-auto"
          style={{ width: `${Math.min(speedup / 15, 1) * 100}%` }}
        />
      </div>
    </div>
  );
}
