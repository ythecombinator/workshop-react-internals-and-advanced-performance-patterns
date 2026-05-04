import { useCallback, useRef, useState } from 'react';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Slider } from '@components/ui/slider';
import Typography from '@components/ui/typography';

import {
  consumeResult,
  runBenchmarkOperation,
  yieldToMainThread,
} from './bench';
import ResultRow from './result-row';
import ResultsSkeleton from './results-skeleton';
import type { BenchmarkResult, BenchOperation } from './types';

import {
  generateAoS,
  generateSoA,
  incrementFieldAoS,
  incrementFieldSoA,
  sumFieldAoS,
  sumFieldSoA,
  updateAllAoS,
  updateAllSoA,
} from './utils';

//  ---------------------------------------------------------------------------
//  DATA-ORIENTED DESIGN: Array-of-Structs vs Struct-of-Arrays
//  ---------------------------------------------------------------------------

//  Demonstrates the performance difference between two memory layouts
//  for the same logical data:
//
//    AoS (Array of Structs): [{ f0, f1, ..., fN }, ...]
//    SoA (Struct of Arrays):  [Float64Array(f0), Float64Array(f1), ...]

//  When an operation only touches one or two fields (e.g. sum field 0),
//  SoA wins because the CPU cache loads contiguous floats instead of
//  skipping over unrelated fields in each struct.
//
//  Two adjustable axes let you see the effect scale:
//    - Entity count: 
//      More items 
//      = larger dataset 
//      = more cache misses
//    - Fields per entity: 
//      More fields 
//      = fatter structs 
//      = more waste per cache line when only 1 field is accessed

const COUNT_OPTIONS = [10_000, 50_000, 100_000, 500_000, 1_000_000];
const FIELD_OPTIONS = [4, 8, 16, 32, 64];

export default function Demo() {
  const [countIndex, setCountIndex] = useState(2);
  const [fieldIndex, setFieldIndex] = useState(2);
  const [results, setResults] = useState<BenchmarkResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState('');
  const abortRef = useRef(false);

  const entityCount = COUNT_OPTIONS[countIndex];
  const fieldCount = FIELD_OPTIONS[fieldIndex];
  const structBytes = fieldCount * 8;

  const runBenchmark = useCallback(() => {
    setRunning(true);
    setResults(null);
    setProgress('Generating data…');
    abortRef.current = false;

    const operations: BenchOperation[] = [
      {
        label: 'Sum single field',
        detail: `reads 1 of ${fieldCount} fields`,
        aosFn: () => {},
        soaFn: () => {},
      },
      {
        label: 'Increment single field',
        detail: `read+write 1 of ${fieldCount} fields`,
        aosFn: () => {},
        soaFn: () => {},
      },
      {
        label: 'Update all fields',
        detail: `read+write ${fieldCount} of ${fieldCount} fields`,
        aosFn: () => {},
        soaFn: () => {},
      },
    ];

    // Run each benchmark in its own macrotask so the browser can paint
    // the skeleton, progress text, and animations between operations.
    (async () => {
      await yieldToMainThread();

      const aos = generateAoS(entityCount, fieldCount);
      const soa = generateSoA(entityCount, fieldCount);

      // Wire up the closures now that data is ready
      operations[0].aosFn = () => {
        consumeResult(sumFieldAoS(aos));
      };
      operations[0].soaFn = () => {
        consumeResult(sumFieldSoA(soa));
      };
      operations[1].aosFn = () => {
        consumeResult(incrementFieldAoS(aos));
      };
      operations[1].soaFn = () => {
        consumeResult(incrementFieldSoA(soa));
      };
      operations[2].aosFn = () => {
        consumeResult(updateAllAoS(aos, fieldCount));
      };
      operations[2].soaFn = () => {
        consumeResult(updateAllSoA(soa));
      };

      const benchResults: BenchmarkResult[] = [];

      for (let opIndex = 0; opIndex < operations.length; opIndex++) {
        if (abortRef.current) {
          break;
        }

        const operation = operations[opIndex];
        setProgress(
          `Running ${opIndex + 1}/${operations.length}: ${operation.label}`
        );

        // Yield so React can paint the progress update
        await yieldToMainThread();

        const result = await runBenchmarkOperation(operation);

        if (result) {
          benchResults.push(result);
        }
      }

      setResults(benchResults);
      setProgress('');
      setRunning(false);
    })();
  }, [entityCount, fieldCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data-Oriented Design (Custom)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Typography.p>
            Compares two memory layouts for the same data: Array of Structs
            (AoS) vs Struct of Arrays (SoA). Adjust both{' '}
            <strong>entity count</strong> and <strong>fields per entity</strong>{' '}
            to see how the SoA advantage scales. More fields means fatter
            structs, which means more cache waste when only one field is
            accessed.
          </Typography.p>

          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography.small className="text-muted-foreground">
                  Entity count
                </Typography.small>
                <code className="bg-muted px-2 py-0.5 rounded text-sm">
                  {entityCount.toLocaleString()}
                </code>
              </div>
              <Slider
                value={[countIndex]}
                min={0}
                max={COUNT_OPTIONS.length - 1}
                step={1}
                onValueChange={([value]) => setCountIndex(value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {COUNT_OPTIONS.map((option) => (
                  <span key={option}>{(option / 1000).toFixed(0)}k</span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography.small className="text-muted-foreground">
                  Fields per entity
                </Typography.small>
                <code className="bg-muted px-2 py-0.5 rounded text-sm">
                  {fieldCount} fields ({structBytes} bytes/struct)
                </code>
              </div>
              <Slider
                value={[fieldIndex]}
                min={0}
                max={FIELD_OPTIONS.length - 1}
                step={1}
                onValueChange={([value]) => setFieldIndex(value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {FIELD_OPTIONS.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={runBenchmark} disabled={running}>
              {running ? 'Running…' : 'Run benchmark'}
            </Button>
            {running && progress && (
              <Typography.small className="text-muted-foreground animate-pulse">
                {progress}
              </Typography.small>
            )}
          </div>

          {running && !results && <ResultsSkeleton />}

          {results && (
            <div className="p-4 bg-muted/50 rounded-md space-y-1">
              <div className="grid grid-cols-5 gap-4 pb-2 border-b">
                <Typography.small className="font-bold">
                  Operation
                </Typography.small>
                <Typography.small className="text-right font-bold">
                  AoS
                </Typography.small>
                <Typography.small className="text-right font-bold">
                  SoA
                </Typography.small>
                <Typography.small className="text-right font-bold">
                  Speedup
                </Typography.small>
                <div />
              </div>
              {results.map((result) => (
                <ResultRow key={result.label} result={result} />
              ))}
            </div>
          )}

          <div className="p-4 bg-muted/50 rounded-md">
            <Typography.h3 className="mt-0 mb-2">Why it matters</Typography.h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                <strong>AoS</strong> stores each entity as an object with all
                fields interleaved. Reading 1 field loads the entire struct into
                cache: at {fieldCount} fields that's{' '}
                <strong>{structBytes} bytes</strong> per entity, but only 8 are
                useful.
              </li>
              <li>
                <strong>SoA</strong> stores each field in a contiguous{' '}
                <code className="bg-muted px-1 rounded">Float64Array</code>.
                Scanning one field is a sequential memory read where every byte in
                the cache line is useful.
              </li>
              <li>
                Slide <strong>fields per entity</strong> from 4 to 64 and watch
                single-field operations go from modest to dramatic speedups,
                while "update all fields" stays roughly constant.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
