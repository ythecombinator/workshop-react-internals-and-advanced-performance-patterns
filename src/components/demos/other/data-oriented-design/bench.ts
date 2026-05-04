import { Bench } from 'tinybench';

import type { BenchOperation } from './types';

//  ---------------------------------------------------------------------------
//  DCE SINK
//  ---------------------------------------------------------------------------

// Accumulator that prevents V8 from dead-code-eliminating bench functions.
let sinkAccumulator = 0;

export function consumeResult(value: number) {
  sinkAccumulator += value;
}

// Keep the sink reachable so V8 doesn't discard it entirely.
(globalThis as Record<string, unknown>).__benchSink = {
  get value() {
    return sinkAccumulator;
  },
};

//  ---------------------------------------------------------------------------
//  BENCHMARK HARNESS (tinybench)
//  ---------------------------------------------------------------------------

// Yields to the browser so it can paint between benchmark runs.
export function yieldToMainThread() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
}

export async function runBenchmarkOperation(operation: BenchOperation) {
  const bench = new Bench({
    time: 500,
    warmup: true,
    warmupIterations: 64,
    warmupTime: 250,
  });

  bench.add('AoS', operation.aosFn, { async: false });
  bench.add('SoA', operation.soaFn, { async: false });

  await bench.run();

  const aosTask = bench.getTask('AoS')!;
  const soaTask = bench.getTask('SoA')!;
  const aosResult = aosTask.result!;
  const soaResult = soaTask.result!;

  if (aosResult.state !== 'completed' || soaResult.state !== 'completed') {
    return null;
  }

  return {
    label: operation.label,
    detail: operation.detail,
    aosOpsPerSec: aosResult.throughput.mean,
    soaOpsPerSec: soaResult.throughput.mean,
    aosSamples: aosResult.latency.samplesCount,
    soaSamples: soaResult.latency.samplesCount,
  };
}

//  ---------------------------------------------------------------------------
//  FORMATTING
//  ---------------------------------------------------------------------------

export function formatOps(opsPerSec: number) {
  if (opsPerSec >= 1_000_000) {
    return `${(opsPerSec / 1_000_000).toFixed(1)}M`;
  }

  if (opsPerSec >= 1_000) {
    return `${(opsPerSec / 1_000).toFixed(1)}K`;
  }

  return opsPerSec.toFixed(0);
}
