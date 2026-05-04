import ContentLoader from 'react-content-loader';

import Typography from '@components/ui/typography';

const SKELETON_ROWS = 3;

export default function ResultsSkeleton() {
  return (
    <div className="p-4 bg-muted/50 rounded-md space-y-1">
      <div className="grid grid-cols-5 gap-4 pb-2 border-b">
        <Typography.small className="font-bold">Operation</Typography.small>
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
      {Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-5 gap-4 items-center py-2 border-b last:border-b-0"
        >
          <ContentLoader
            speed={2}
            width={120}
            height={32}
            backgroundColor="hsl(var(--muted))"
            foregroundColor="hsl(var(--muted-foreground) / 0.1)"
          >
            <rect x="0" y="4" rx="3" ry="3" width="100" height="10" />
            <rect x="0" y="20" rx="3" ry="3" width="70" height="8" />
          </ContentLoader>
          <ContentLoader
            speed={2}
            width={80}
            height={16}
            backgroundColor="hsl(var(--muted))"
            foregroundColor="hsl(var(--muted-foreground) / 0.1)"
            className="ml-auto"
          >
            <rect x="10" y="2" rx="3" ry="3" width="70" height="12" />
          </ContentLoader>
          <ContentLoader
            speed={2}
            width={80}
            height={16}
            backgroundColor="hsl(var(--muted))"
            foregroundColor="hsl(var(--muted-foreground) / 0.1)"
            className="ml-auto"
          >
            <rect x="10" y="2" rx="3" ry="3" width="70" height="12" />
          </ContentLoader>
          <ContentLoader
            speed={2}
            width={60}
            height={16}
            backgroundColor="hsl(var(--muted))"
            foregroundColor="hsl(var(--muted-foreground) / 0.1)"
            className="ml-auto"
          >
            <rect x="10" y="2" rx="3" ry="3" width="50" height="12" />
          </ContentLoader>
          <ContentLoader
            speed={2}
            width={80}
            height={12}
            backgroundColor="hsl(var(--muted))"
            foregroundColor="hsl(var(--muted-foreground) / 0.1)"
            className="ml-auto"
          >
            <rect x="20" y="3" rx="4" ry="4" width="60" height="8" />
          </ContentLoader>
        </div>
      ))}
    </div>
  );
}
