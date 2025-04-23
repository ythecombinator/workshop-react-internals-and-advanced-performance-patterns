import browserUsage from '@visx/mock-data/lib/mocks/browserUsage';

export const data = browserUsage.map((item) => ({
  label: item.date,
  date: item.date,
  value: item['Google Chrome'],
}));

export type Data = typeof data;
