import { Bench } from 'tinybench';

import type { AoSEntity, BenchOperation } from './types';

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
//  DATA GENERATION (dynamic field count)
//  ---------------------------------------------------------------------------

export function generateAoS(entityCount: number, fieldCount: number) {
  const entities: AoSEntity[] = new Array(entityCount);

  for (let index = 0; index < entityCount; index++) {
    const entity: AoSEntity = {};

    for (let field = 0; field < fieldCount; field++) {
      entity[`f${field}`] = Math.random() * 1000;
    }

    entities[index] = entity;
  }

  return entities;
}

export function generateSoA(entityCount: number, fieldCount: number) {
  const fields: Float64Array[] = new Array(fieldCount);

  for (let field = 0; field < fieldCount; field++) {
    const array = new Float64Array(entityCount);

    for (let index = 0; index < entityCount; index++) {
      array[index] = Math.random() * 1000;
    }

    fields[field] = array;
  }

  return fields;
}

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
//  BENCHMARK OPERATIONS
//  ---------------------------------------------------------------------------

// 1. Sum a single field (reads 1 of N — maximum cache waste in AoS)
export function sumFieldAoS(entities: AoSEntity[]) {
  let total = 0;

  for (let index = 0; index < entities.length; index++) {
    total += entities[index].f0;
  }

  return total;
}

export function sumFieldSoA(fields: Float64Array[]) {
  let total = 0;
  const target = fields[0];

  for (let index = 0; index < target.length; index++) {
    total += target[index];
  }

  return total;
}

// 2. Increment a single field (read+write 1 of N — same cache pattern)
export function incrementFieldAoS(entities: AoSEntity[]) {
  for (let index = 0; index < entities.length; index++) {
    entities[index].f0 += 1;
  }

  return entities[entities.length - 1].f0;
}

export function incrementFieldSoA(fields: Float64Array[]) {
  const target = fields[0];

  for (let index = 0; index < target.length; index++) {
    target[index] += 1;
  }

  return target[target.length - 1];
}

// 3. Update all fields (reads+writes N of N — baseline, both layouts busy)
export function updateAllAoS(entities: AoSEntity[], fieldCount: number) {
  for (let index = 0; index < entities.length; index++) {
    const entity = entities[index];

    for (let field = 0; field < fieldCount; field++) {
      entity[`f${field}`] += 1.5;
    }
  }

  return entities[entities.length - 1].f0;
}

export function updateAllSoA(fields: Float64Array[]) {
  for (let field = 0; field < fields.length; field++) {
    const array = fields[field];

    for (let index = 0; index < array.length; index++) {
      array[index] += 1.5;
    }
  }

  return fields[0][fields[0].length - 1];
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
