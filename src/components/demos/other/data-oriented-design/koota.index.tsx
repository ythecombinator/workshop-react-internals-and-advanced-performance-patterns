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
import type {
    BenchmarkResult,
    BenchOperation,
} from './types';

import { destroyWorlds, setupKootaWorlds } from './koota.utils';

//  ---------------------------------------------------------------------------
//  DATA-ORIENTED DESIGN (Koota): Schema traits (SoA) vs Callback traits (AoS)
//  ---------------------------------------------------------------------------

//  Koota stores trait data in two layouts depending on definition style:
//
//    trait({ x: 0, y: 0 })         -> Schema-based  -> SoA internally
//    trait(() => ({ x: 0, y: 0 })) -> Callback-based -> AoS internally
//
//  Both paths use `useStores` for direct store access so the benchmark
//  measures pure memory-layout difference, not API overhead.
//
//  AoS useStores -> array of objects:   store[eid].f0
//  SoA useStores -> object of arrays:   store.f0[eid]

const COUNT_OPTIONS = [10_000, 50_000, 100_000, 250_000];
const FIELD_OPTIONS = [4, 8, 16, 24, 32];

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
    setProgress('Spawning entities…');
    abortRef.current = false;

    (async () => {
      await yieldToMainThread();

      const { aosWorld, soaWorld, AoSTrait, SoATrait } = setupKootaWorlds(
        entityCount,
        fieldCount
      );

      const operations: BenchOperation[] = [
        {
          label: 'Sum single field',
          detail: `reads 1 of ${fieldCount} fields`,
          aosFn: () => {
            let total = 0;

            aosWorld.query(AoSTrait).useStores(([store], entities) => {
              for (let index = 0; index < entities.length; index++) {
                total += store[entities[index].id()].f0;
              }
            });

            consumeResult(total);
          },
          soaFn: () => {
            let total = 0;

            soaWorld.query(SoATrait).useStores(([store], entities) => {
              for (let index = 0; index < entities.length; index++) {
                total += store.f0[entities[index].id()];
              }
            });

            consumeResult(total);
          },
        },
        {
          label: 'Increment single field',
          detail: `read+write 1 of ${fieldCount} fields`,
          aosFn: () => {
            aosWorld.query(AoSTrait).useStores(([store], entities) => {
              for (let index = 0; index < entities.length; index++) {
                store[entities[index].id()].f0 += 1;
              }
            });
          },
          soaFn: () => {
            soaWorld.query(SoATrait).useStores(([store], entities) => {
              for (let index = 0; index < entities.length; index++) {
                store.f0[entities[index].id()] += 1;
              }
            });
          },
        },
        {
          label: 'Update all fields',
          detail: `read+write ${fieldCount} of ${fieldCount} fields`,
          aosFn: () => {
            aosWorld.query(AoSTrait).useStores(([store], entities) => {
              for (let index = 0; index < entities.length; index++) {
                const entity = store[entities[index].id()];

                for (let field = 0; field < fieldCount; field++) {
                  entity[`f${field}`] += 1.5;
                }
              }
            });
          },
          soaFn: () => {
            soaWorld.query(SoATrait).useStores(([store], entities) => {
              for (let index = 0; index < entities.length; index++) {
                const entityId = entities[index].id();

                for (let field = 0; field < fieldCount; field++) {
                  store[`f${field}`][entityId] += 1.5;
                }
              }
            });
          },
        },
      ];

      const benchResults: BenchmarkResult[] = [];

      for (let opIndex = 0; opIndex < operations.length; opIndex++) {
        if (abortRef.current) {
          break;
        }

        const operation = operations[opIndex];
        setProgress(
          `Running ${opIndex + 1}/${operations.length}: ${operation.label}`
        );

        await yieldToMainThread();

        const result = await runBenchmarkOperation(operation);

        if (result) {
          benchResults.push(result);
        }
      }

      destroyWorlds(aosWorld, soaWorld);
      setResults(benchResults);
      setProgress('');
      setRunning(false);
    })();
  }, [entityCount, fieldCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data-Oriented Design (Koota)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Typography.p>
            Same AoS vs SoA comparison, but inside{' '}
            <a
              href="https://github.com/pmndrs/koota"
              target="_blank"
              rel="noreferrer"
              className="underline font-medium"
            >
              Koota
            </a>
            . <strong>Schema-based</strong> traits (
            <code className="bg-muted px-1 rounded text-sm">
              {'trait({ x: 0 })'}
            </code>
            ) use SoA storage, while <strong>callback-based</strong> traits (
            <code className="bg-muted px-1 rounded text-sm">
              {'trait(() => ({ x: 0 }))'}
            </code>
            ) use AoS storage. Both paths use{' '}
            <code className="bg-muted px-1 rounded text-sm">useStores</code>{' '}
            for direct store access, so the benchmark measures pure
            memory-layout difference, not API overhead.
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
                  <span key={option}>
                    {option >= 1_000_000
                      ? `${(option / 1_000_000).toFixed(0)}M`
                      : `${(option / 1_000).toFixed(0)}k`}
                  </span>
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
            <Typography.h3 className="mt-0 mb-2">
              How Koota stores data
            </Typography.h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                <strong>Callback-based</strong> traits (AoS) store each entity
                as a heap-allocated object. Via{' '}
                <code className="bg-muted px-1 rounded">useStores</code>, you
                get the raw array of objects:{' '}
                <code className="bg-muted px-1 rounded">store[eid].f0</code>.
              </li>
              <li>
                <strong>Schema-based</strong> traits (SoA) store each field in
                its own contiguous array. Via{' '}
                <code className="bg-muted px-1 rounded">useStores</code>, you
                get the object of arrays:{' '}
                <code className="bg-muted px-1 rounded">store.f0[eid]</code>.
              </li>
              <li>
                Using{' '}
                <code className="bg-muted px-1 rounded">readEach</code>/
                <code className="bg-muted px-1 rounded">updateEach</code>{' '}
                instead of{' '}
                <code className="bg-muted px-1 rounded">useStores</code> on SoA
                traits creates a snapshot object per entity, negating the cache
                benefit and making SoA <em>slower</em> than AoS.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
