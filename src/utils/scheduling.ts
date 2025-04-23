import deepEqual from 'fast-deep-equal';

export const HUGE_NUMBER = 2000000;

//  ---------------------------------------------------------------------------
//  MISCELLANEOUS
//  ---------------------------------------------------------------------------

export function delay<T = unknown>(value: T, ms: number) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
}

export function blockMainThreadUntil(time: number) {
  const delay = performance.now() + time;
  while (performance.now() < delay) {}
}

export function resourcefulOperation(value: number) {
  let newValue = String(value);

  for (let i = 0; i < HUGE_NUMBER; i++) {
    newValue = `${value} + ${i} = ${value + i}`;
  }

  return newValue;
}

export function* FAST_resourcefulOperation(value: number) {
  let newValue = String(value);

  while (true) {
    yield;

    for (let i = 0; i < HUGE_NUMBER; i++) {
      newValue = `${value} + ${i} = ${value + i}`;
    }

    return newValue;
  }
}

//  ---------------------------------------------------------------------------
//  CUSTOM SCHEDULER
//  ---------------------------------------------------------------------------

export enum SchedulerState {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export class Scheduler<T> {
  state: SchedulerState;
  result: T;
  worker: (data: T) => Generator;
  // @ts-ignore
  iterator: Generator;

  constructor(worker: (data: T) => Generator, initialResult: T) {
    this.state = SchedulerState.IDLE;
    this.worker = worker;
    this.result = initialResult;
  }

  performUnitOfWork(data: T) {
    switch (this.state) {
      case 'IDLE':
        this.state = SchedulerState.PENDING;
        this.iterator = this.worker(data);
        throw Promise.resolve();
      case 'PENDING':
        const { value, done } = this.iterator.next();
        if (done) {
          this.result = value;
          this.state = SchedulerState.DONE;
          return value;
        }
        throw Promise.resolve();
      case 'DONE':
        this.state = SchedulerState.IDLE;
        return this.result;
    }
  }
}

//  ---------------------------------------------------------------------------
//  CUSTOM suspend-react
//  ---------------------------------------------------------------------------

interface PromiseCache<TInput, TResponse> {
  promise?: Promise<void>;
  inputs: TInput[];
  error?: unknown;
  response?: TResponse;
}

const promiseCaches: Array<PromiseCache<unknown, unknown>> = [];

export function CUSTOM_suspend<TInput, TResponse>(
  promise: (...inputs: TInput[]) => Promise<TResponse>,
  inputs: TInput[] = [],
  lifespan: number = 0
): TResponse {
  for (const promiseCache of promiseCaches) {
    if (deepEqual(inputs, promiseCache.inputs)) {
      if (Object.prototype.hasOwnProperty.call(promiseCache, 'error')) {
        throw promiseCache.error;
      }

      if (Object.prototype.hasOwnProperty.call(promiseCache, 'response')) {
        return promiseCache.response as TResponse;
      }

      throw promiseCache.promise;
    }
  }

  const promiseCache: PromiseCache<TInput, TResponse> = {
    promise: promise(...inputs)
      .then((response: TResponse) => {
        promiseCache.response = response;
      })
      .catch((e: unknown) => {
        promiseCache.error = e;
      })
      .then(() => {
        if (lifespan > 0) {
          setTimeout(() => {
            const index = promiseCaches.indexOf(
              promiseCache as PromiseCache<unknown, unknown>
            );
            if (index !== -1) {
              promiseCaches.splice(index, 1);
            }
          }, lifespan);
        }
      }),
    inputs,
  };

  promiseCaches.push(promiseCache as PromiseCache<unknown, unknown>);
  throw promiseCache.promise;
}
