export type AoSEntity = Record<string, number>;

export interface BenchOperation {
  label: string;
  detail: string;
  aosFn: () => void;
  soaFn: () => void;
}

export interface BenchmarkResult {
  label: string;
  detail: string;
  aosOpsPerSec: number;
  soaOpsPerSec: number;
  aosSamples: number;
  soaSamples: number;
}
